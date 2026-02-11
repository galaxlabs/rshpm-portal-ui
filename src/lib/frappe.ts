import axios from 'axios';

const apiPrefix = import.meta.env.VITE_FRAPPE_API_PREFIX || '/api';
const authMode = import.meta.env.VITE_AUTH_MODE || 'session';
const tokenKey = import.meta.env.VITE_FRAPPE_API_KEY || '';
const tokenSecret = import.meta.env.VITE_FRAPPE_API_SECRET || '';
const tokenAuthorization =
  authMode === 'token' && tokenKey && tokenSecret ? `token ${tokenKey}:${tokenSecret}` : '';
const localUserKey = 'rshpm_portal_user';

export const frappeClient = axios.create({
  baseURL: '',
  withCredentials: true,
});

if (tokenAuthorization) {
  frappeClient.defaults.headers.common.Authorization = tokenAuthorization;
}

type FrappePayload<T> = {
  data?: T;
  message?: T;
  exc?: string;
  exception?: string;
  _server_messages?: string;
};

type FrappeDocResponse<T> = {
  data: T;
};

export type ListQueryOptions = {
  filters?: unknown[];
  orderBy?: string;
};

export type PrintHtmlResponse = {
  html: string;
  style?: string;
  css?: string;
};

export function parseServerMessages(raw?: string) {
  if (!raw) return '';
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr) || !arr.length) return '';
    const first = arr[0];
    if (typeof first !== 'string') return String(first);
    try {
      const parsed = JSON.parse(first);
      return parsed?.message || first;
    } catch {
      return first;
    }
  } catch {
    return raw;
  }
}

function unwrapErrorPayload<T>(payload?: FrappePayload<T>) {
  if (!payload) return '';
  return payload.exception || payload.exc || parseServerMessages(payload._server_messages);
}

export function getApiErrorMessage(err: unknown) {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as FrappePayload<unknown> | undefined;
    return unwrapErrorPayload(data) || err.message || 'Request failed';
  }
  if (err instanceof Error) return err.message || 'Request failed';
  return 'Request failed';
}

export async function login(usr: string, pwd: string) {
  if (authMode === 'token') {
    localStorage.setItem(localUserKey, usr || 'Token User');
    return { message: 'Logged In' };
  }

  const payload = new URLSearchParams();
  payload.set('usr', usr);
  payload.set('pwd', pwd);

  const res = await frappeClient.post(`${apiPrefix}/method/login`, payload.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return res.data;
}

export async function logout() {
  if (authMode === 'token') {
    localStorage.removeItem(localUserKey);
    return;
  }
  await frappeClient.post(`${apiPrefix}/method/logout`);
}

export async function getLoggedUser() {
  if (authMode === 'token') {
    return localStorage.getItem(localUserKey) || '';
  }
  const res = await frappeClient.get(`${apiPrefix}/method/frappe.auth.get_logged_user`);
  return res.data?.message as string;
}

export async function listDocs<T extends Record<string, unknown>>(
  doctype: string,
  fields: string[] = ['name', 'modified', 'owner'],
  limit = 100,
  start = 0,
  options?: ListQueryOptions,
) {
  const query = new URLSearchParams({
    fields: JSON.stringify(fields),
    limit_page_length: String(limit),
    limit_start: String(start),
    order_by: options?.orderBy || 'modified desc',
  });

  if (options?.filters?.length) {
    query.set('filters', JSON.stringify(options.filters));
  }

  const url = `${apiPrefix}/resource/${encodeURIComponent(doctype)}?${query.toString()}`;
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(tokenAuthorization ? { Authorization: tokenAuthorization } : {}),
    },
  });

  const payload = (await res.json().catch(() => ({}))) as FrappePayload<T[]>;
  const embeddedError = unwrapErrorPayload(payload);
  if (!res.ok) {
    throw new Error(embeddedError || `HTTP ${res.status}`);
  }
  if (embeddedError) throw new Error(embeddedError);
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.message)) return payload.message;
  return [];
}

export async function listAllDocs<T extends Record<string, unknown>>(
  doctype: string,
  fields: string[] = ['name', 'modified', 'owner'],
  batchSize = 500,
  maxRows = 10000,
  options?: ListQueryOptions,
) {
  const rows: T[] = [];
  let start = 0;

  while (rows.length < maxRows) {
    const batch = await listDocs<T>(doctype, fields, batchSize, start, options);
    rows.push(...batch);
    if (batch.length < batchSize) break;
    start += batchSize;
  }

  return rows;
}

export async function getDocCount(doctype: string, filters?: unknown[]) {
  try {
    const rows = await listAllDocs<Record<string, unknown>>(doctype, ['name'], 500, 20000, {
      filters,
    });
    return rows.length;
  } catch {
    return 0;
  }
}

export async function getDoc<T extends Record<string, unknown>>(doctype: string, name: string) {
  const res = await frappeClient.get<FrappeDocResponse<T>>(
    `${apiPrefix}/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`,
  );
  return res.data.data;
}

export async function createDoc<T extends Record<string, unknown>>(doctype: string, payload: Partial<T>) {
  const res = await frappeClient.post<FrappeDocResponse<T>>(
    `${apiPrefix}/resource/${encodeURIComponent(doctype)}`,
    payload,
  );
  return res.data.data;
}

export async function updateDoc<T extends Record<string, unknown>>(
  doctype: string,
  name: string,
  payload: Partial<T>,
) {
  const res = await frappeClient.put<FrappeDocResponse<T>>(
    `${apiPrefix}/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`,
    payload,
  );
  return res.data.data;
}

export async function deleteDoc(doctype: string, name: string) {
  await frappeClient.delete(`${apiPrefix}/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`);
}

export async function listPrintFormats(doctype: string) {
  type PrintFormat = Record<string, unknown> & {
    name?: string;
    doc_type?: string;
    disabled?: number;
  };

  const formats = await listDocs<PrintFormat>(
    'Print Format',
    ['name', 'doc_type', 'disabled', 'standard'],
    200,
    0,
    {
      filters: [['doc_type', '=', doctype]],
      orderBy: 'modified desc',
    },
  );

  return formats.filter((f) => !f.disabled).map((f) => String(f.name || ''));
}

export function getPrintViewUrl(doctype: string, name: string, format?: string, triggerPrint = false) {
  const query = new URLSearchParams({
    doctype,
    name,
    no_letterhead: '0',
  });
  if (format) query.set('format', format);
  if (triggerPrint) query.set('trigger_print', '1');
  return `/printview?${query.toString()}`;
}

export async function fetchPrintHtml(doctype: string, name: string, format?: string) {
  const payload = new URLSearchParams();
  payload.set('doctype', doctype);
  payload.set('name', name);
  if (format) payload.set('print_format', format);
  payload.set('no_letterhead', '0');

  const res = await frappeClient.post<FrappePayload<PrintHtmlResponse>>(
    `${apiPrefix}/method/frappe.www.printview.get_html_and_style`,
    payload.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

  const embeddedError = unwrapErrorPayload(res.data);
  if (embeddedError) throw new Error(embeddedError);

  const message = res.data?.message;
  if (message && typeof message === 'object' && 'html' in message) {
    return message;
  }
  throw new Error('Unable to load print HTML');
}
