// rshpm-portal-ui-master/src/lib/frappe.ts

import axios from "axios";

/**
 * ENV (Vite)
 *  - VITE_FRAPPE_BASE_URL: https://dev.galaxylabs.online   (optional)
 *  - VITE_FRAPPE_API_PREFIX: /api                         (optional, default /api)
 *  - VITE_AUTH_MODE: session | token                      (optional, default session)
 *  - VITE_API_KEY / VITE_API_SECRET                       (only if token auth)
 */

export const apiPrefix = import.meta.env.VITE_FRAPPE_API_PREFIX || "/api";
export const authMode = (import.meta.env.VITE_AUTH_MODE || "session").toLowerCase();

// normalize base URL (remove trailing slash)
export const baseUrl = ((import.meta.env.VITE_FRAPPE_BASE_URL as string) || "").replace(/\/$/, "");

// local storage key (optional - only used if your UI wants it)
const localUserKey = "rshpm_user";

export const frappeClient = axios.create({
  // If baseUrl is empty, axios uses same-origin relative paths
  baseURL: baseUrl || "",
  withCredentials: true, // IMPORTANT for session auth
});

/** Token auth header helper */
function getTokenHeaders() {
  const apiKey = import.meta.env.VITE_API_KEY 
  const apiSecret = import.meta.env.VITE_API_SECRET
  if (!apiKey || !apiSecret) return {};
  return { Authorization: `token ${apiKey}:${apiSecret}` };
}

/**
 * Build URL:
 * - If UI and Frappe are same-origin => use relative path
 * - If UI hosted separately => set VITE_FRAPPE_BASE_URL and use absolute
 */
function buildUrl(path: string) {
  return baseUrl ? `${baseUrl}${path}` : path;
}

/** -------------------------------------------
 *  Auth
 *  -------------------------------------------
 */

/**
 * Session Login (Frappe standard)
 * POST /api/method/login
 */
export async function loginSession(usr: string, pwd: string) {
  const url = buildUrl(`${apiPrefix}/method/login`);
  const res = await frappeClient.post(
    url,
    { usr, pwd },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  return res.data;
}

/**
 * Session Logout
 * POST /api/method/logout
 */
export async function logoutSession() {
  const url = buildUrl(`${apiPrefix}/method/logout`);
  const res = await frappeClient.post(url, {}, { withCredentials: true });
  return res.data;
}

/**
 * Get Logged User
 * GET /api/method/frappe.auth.get_logged_user
 *
 * CRITICAL: if message == "Guest", treat as not logged in
 */

export async function getLoggedUser(): Promise<string> {
  try {
    const url = buildUrl(`${apiPrefix}/method/rshpm_system.api.auth.whoami`);
    const res = await frappeClient.get(url, {
      withCredentials: authMode !== "token",
      headers: authMode === "token" ? getTokenHeaders() : {},
    });
    const user = res.data?.message?.user as string | undefined;
    return user && user !== "Guest" ? user : "";
  } catch {
    return "";
  }
}


/**
 * Backward-compatible exports expected by UI:
 * useAuth.tsx expects `login` and `logout`
 */
export async function login(usr: string, pwd: string) {
  if (authMode === "token") {
    // token auth doesn't use username/password
    // just store display user (optional)
    localStorage.setItem("rshpm_user", usr || "API User");
    return { message: "Token mode" };
  }
  return loginSession(usr, pwd);
}


export async function logout() {
  return logoutSession();
}

/** -------------------------------------------
 *  Resource CRUD
 *  -------------------------------------------
 */

export async function listDocs(
  doctype: string,
  opts?: {
    fields?: string[];
    filters?: any;
    order_by?: string;
    limit_start?: number;
    limit_page_length?: number;
  }
) {
  const query = new URLSearchParams();

  const fields = opts?.fields?.length ? opts.fields : ["name"];
  query.set("fields", JSON.stringify(fields));

  if (opts?.filters) query.set("filters", JSON.stringify(opts.filters));
  if (opts?.order_by) query.set("order_by", opts.order_by);
  if (typeof opts?.limit_start === "number") query.set("limit_start", String(opts.limit_start));
  query.set("limit_page_length", String(opts?.limit_page_length ?? 20));

  const endpoint = `${apiPrefix}/resource/${encodeURIComponent(doctype)}?${query.toString()}`;
  const url = buildUrl(endpoint);

  const res = await frappeClient.get(url, {
    withCredentials: authMode !== "token",
    headers: authMode === "token" ? getTokenHeaders() : {},
  });

  // Frappe resource API shape: { data: [...] }
  const rows = Array.isArray(res.data?.data) ? res.data.data : [];

  // Return ALL common shapes so every page works:
  // - some pages use .docs
  // - some use .data
  // - some use .message
  return {
    docs: rows,
    data: rows,
    message: rows,
    raw: res.data,
  };
}


/**
 * Backward-compatible export expected by dashboard.ts: listAllDocs
 */
export async function listAllDocs<T = Record<string, unknown>>(
  doctype: string,
  fieldsOrOpts?: string[] | {
    fields?: string[];
    filters?: any;
    order_by?: string;
    limit_start?: number;
    limit_page_length?: number;
  },
  limit_page_length = 200,
  max_rows = 2000
): Promise<T[]> {
  // Support BOTH call styles:
  // 1) listAllDocs("DocType", ["name","modified"], 500, 10000)
  // 2) listAllDocs("DocType", { fields, filters, ... })
  const opts =
    Array.isArray(fieldsOrOpts)
      ? { fields: fieldsOrOpts }
      : (fieldsOrOpts || {});

  const pageLen = Array.isArray(fieldsOrOpts) ? limit_page_length : (opts.limit_page_length ?? 200);
  let start = Array.isArray(fieldsOrOpts) ? 0 : (opts.limit_start ?? 0);

  const out: T[] = [];

  while (out.length < max_rows) {
    const res = await listDocs(doctype, {
      ...opts,
      limit_start: start,
      limit_page_length: pageLen,
    });

    // listDocs might return { data: [...] } (Frappe) or your normalized object
    const rows =
      Array.isArray((res as any)?.data) ? (res as any).data
      : Array.isArray((res as any)?.docs) ? (res as any).docs
      : Array.isArray((res as any)?.message) ? (res as any).message
      : [];

    out.push(...(rows as T[]));

    if (rows.length < pageLen) break;
    start += pageLen;
  }

  return out;
}


export async function getDoc(doctype: string, name: string) {
  const endpoint = `${apiPrefix}/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`;
  const url = buildUrl(endpoint);

  const res = await frappeClient.get(url, {
    withCredentials: true,
    headers: authMode === "token" ? getTokenHeaders() : {},
  });

  return res.data;
}

export async function createDoc(doctype: string, data: any) {
  const endpoint = `${apiPrefix}/resource/${encodeURIComponent(doctype)}`;
  const url = buildUrl(endpoint);

  const res = await frappeClient.post(url, data, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      ...(authMode === "token" ? getTokenHeaders() : {}),
    },
  });

  return res.data;
}

export async function updateDoc(doctype: string, name: string, data: any) {
  const endpoint = `${apiPrefix}/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`;
  const url = buildUrl(endpoint);

  const res = await frappeClient.put(url, data, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      ...(authMode === "token" ? getTokenHeaders() : {}),
    },
  });

  return res.data;
}

export async function deleteDoc(doctype: string, name: string) {
  const endpoint = `${apiPrefix}/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`;
  const url = buildUrl(endpoint);

  const res = await frappeClient.delete(url, {
    withCredentials: true,
    headers: authMode === "token" ? getTokenHeaders() : {},
  });

  return res.data;
}

/** -------------------------------------------
 *  Helpers expected by UI
 *  -------------------------------------------
 */

/**
 * Extract a human-friendly error message from Frappe/axios errors
 * (UI expects: getApiErrorMessage)
 */
export function getApiErrorMessage(err: any): string {
  // axios error shape
  const data = err?.response?.data;

  // Frappe often returns: { exception, exc_type, _server_messages, message }
  // Or it returns: { message: "..." }
  if (typeof data?.message === "string" && data.message.trim()) return data.message;

  // _server_messages is JSON string array with messages
  if (typeof data?._server_messages === "string") {
    try {
      const arr = JSON.parse(data._server_messages);
      if (Array.isArray(arr) && arr.length) {
        // each element may be JSON string itself
        const first = arr[0];
        if (typeof first === "string") {
          try {
            const inner = JSON.parse(first);
            if (inner?.message) return String(inner.message);
          } catch {
            return first;
          }
        }
        return String(first);
      }
    } catch {
      // ignore
    }
  }

  // fallback
  return err?.message || "Something went wrong";
}

/**
 * Build Print View URL for a doctype doc
 * (UI expects: getPrintViewUrl)
 */
/**
 * Fetch printable HTML from Frappe
 * Uses standard endpoint: /printview
 *
 * Returns HTML string (or response data containing HTML).
 */
export async function fetchPrintHtml(
  doctype: string,
  name: string,
  printFormat?: string
): Promise<string> {
  const url = getPrintViewUrl(doctype, name, printFormat);

  // We want raw HTML, not JSON
  const res = await frappeClient.get(url, {
    withCredentials: true,
    headers: authMode === "token" ? getTokenHeaders() : {},
    responseType: "text",
  });

  // axios returns html as string in res.data
  return res.data as string;
}
/**
 * List Print Formats for a DocType
 * Uses Frappe resource API on "Print Format" doctype.
 */
export async function listPrintFormats(doctype: string) {
  const filters = [["doc_type", "=", doctype], ["disabled", "=", 0]];
  const fields = ["name", "doc_type", "disabled"];

  const res = await listDocs("Print Format", {
    fields,
    filters,
    order_by: "modified desc",
    limit_page_length: 200,
  });

  // Frappe resource response shape: { data: [...] }
  return res?.data || [];
}

export function getPrintViewUrl(doctype: string, name: string, printFormat?: string) {
  const params = new URLSearchParams();
  params.set("doctype", doctype);
  params.set("name", name);

  if (printFormat) params.set("format", printFormat);

  // standard Frappe printview:
  // /printview?doctype=...&name=...&format=...
  const path = `/printview?${params.toString()}`;

  // If UI is separate domain, build absolute to Frappe site
  return baseUrl ? `${baseUrl}${path}` : path;
}

// // rshpm-portal-ui-master/src/lib/frappe.ts

// import axios from "axios";

// /**
//  * ENV (Vite)
//  *  - VITE_FRAPPE_BASE_URL: https://dev.galaxylabs.online   (optional)
//  *  - VITE_FRAPPE_API_PREFIX: /api                         (optional, default /api)
//  *  - VITE_AUTH_MODE: session | token                      (optional, default session)
//  *  - VITE_API_KEY / VITE_API_SECRET                       (only if token auth)
//  */

// export const apiPrefix = import.meta.env.VITE_FRAPPE_API_PREFIX || "/api";
// export const authMode = (import.meta.env.VITE_AUTH_MODE || "session").toLowerCase();

// // normalize base URL (remove trailing slash)
// export const baseUrl = ((import.meta.env.VITE_FRAPPE_BASE_URL as string) || "").replace(/\/$/, "");

// // local storage key for token-mode user (optional)
// const localUserKey = "rshpm_user";

// // Axios client
// export const frappeClient = axios.create({
//   // If baseUrl is empty, axios will use relative paths (same-origin)
//   baseURL: baseUrl || "",
//   withCredentials: true, // IMPORTANT for session auth
// });

// // Token auth header helper
// function getTokenHeaders() {
//   const apiKey = import.meta.env.VITE_API_KEY as string;
//   const apiSecret = import.meta.env.VITE_API_SECRET as string;
//   if (!apiKey || !apiSecret) return {};
//   return {
//     Authorization: `token ${apiKey}:${apiSecret}`,
//   };
// }

// function buildUrl(path: string) {
//   // path is expected like "/api/resource/Property?..."
//   // If baseUrl exists -> absolute URL. If not -> same-origin relative.
//   return baseUrl ? `${baseUrl}${path}` : path;
// }

// /**
//  * Frappe session login
//  * POST /api/method/login
//  */
// export async function loginSession(usr: string, pwd: string) {
//   const url = buildUrl(`${apiPrefix}/method/login`);

//   const res = await frappeClient.post(
//     url,
//     { usr, pwd },
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       // withCredentials already on client, but kept for clarity
//       withCredentials: true,
//     }
//   );

//   return res.data;
// }

// /**
//  * Logout
//  * POST /api/method/logout
//  */
// export async function logoutSession() {
//   const url = buildUrl(`${apiPrefix}/method/logout`);
//   const res = await frappeClient.post(url, {}, { withCredentials: true });
//   return res.data;
// }

// /**
//  * Get logged user
//  * GET /api/method/frappe.auth.get_logged_user
//  *
//  * CRITICAL FIX:
//  * If response is "Guest" => treat as NOT logged in.
//  */
// export async function getLoggedUser(): Promise<string> {
//   // token-mode: if you want, store chosen user name locally
//   if (authMode === "token") {
//     return localStorage.getItem(localUserKey) || "";
//   }

//   const url = buildUrl(`${apiPrefix}/method/frappe.auth.get_logged_user`);
//   const res = await frappeClient.get(url, { withCredentials: true });

//   const u = (res.data?.message as string) || "";
//   return u === "Guest" ? "" : u;
// }

// /**
//  * List documents of a DocType
//  * GET /api/resource/<DocType>?fields=...&filters=...&limit_page_length=...
//  */
// export async function listDocs(
//   doctype: string,
//   opts?: {
//     fields?: string[];
//     filters?: any; // Frappe filter format
//     order_by?: string;
//     limit_start?: number;
//     limit_page_length?: number;
//   }
// ) {
//   const query = new URLSearchParams();

//   // defaults
//   const fields = opts?.fields?.length ? opts.fields : ["name"];
//   query.set("fields", JSON.stringify(fields));

//   if (opts?.filters) query.set("filters", JSON.stringify(opts.filters));
//   if (opts?.order_by) query.set("order_by", opts.order_by);
//   if (typeof opts?.limit_start === "number") query.set("limit_start", String(opts.limit_start));
//   query.set("limit_page_length", String(opts?.limit_page_length ?? 20));

//   const endpoint = `${apiPrefix}/resource/${encodeURIComponent(doctype)}?${query.toString()}`;
//   const url = buildUrl(endpoint);

//   const res = await frappeClient.get(url, {
//     withCredentials: true,
//     headers: authMode === "token" ? getTokenHeaders() : {},
//   });

//   return res.data;
// }

// /**
//  * Get one document
//  * GET /api/resource/<DocType>/<name>
//  */
// export async function getDoc(doctype: string, name: string) {
//   const endpoint = `${apiPrefix}/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`;
//   const url = buildUrl(endpoint);

//   const res = await frappeClient.get(url, {
//     withCredentials: true,
//     headers: authMode === "token" ? getTokenHeaders() : {},
//   });

//   return res.data;
// }

// /**
//  * Create document
//  * POST /api/resource/<DocType>
//  */
// export async function createDoc(doctype: string, data: any) {
//   const endpoint = `${apiPrefix}/resource/${encodeURIComponent(doctype)}`;
//   const url = buildUrl(endpoint);

//   const res = await frappeClient.post(url, data, {
//     withCredentials: true,
//     headers: {
//       "Content-Type": "application/json",
//       ...(authMode === "token" ? getTokenHeaders() : {}),
//     },
//   });

//   return res.data;
// }

// /**
//  * Update document
//  * PUT /api/resource/<DocType>/<name>
//  */
// export async function updateDoc(doctype: string, name: string, data: any) {
//   const endpoint = `${apiPrefix}/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`;
//   const url = buildUrl(endpoint);

//   const res = await frappeClient.put(url, data, {
//     withCredentials: true,
//     headers: {
//       "Content-Type": "application/json",
//       ...(authMode === "token" ? getTokenHeaders() : {}),
//     },
//   });

//   return res.data;
// }
// // Backward-compatible exports used by existing UI code
// export async function login(usr: string, pwd: string) {
//   return loginSession(usr, pwd);
// }

// // dashboard.ts expects: import { listAllDocs } from "@/lib/frappe";
// export async function listAllDocs(
//   doctype: string,
//   opts?: {
//     fields?: string[];
//     filters?: any;
//     order_by?: string;
//     limit_start?: number;
//     limit_page_length?: number;
//   }
// ) {
//   return listDocs(doctype, opts);
// }
// // useAuth.tsx expects: import { logout } from "@/lib/frappe";
// export async function logout() {
//   return logoutSession();
// }
