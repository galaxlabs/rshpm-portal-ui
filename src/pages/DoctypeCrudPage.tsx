import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Download, ExternalLink, Printer, RefreshCw, Search } from 'lucide-react';
import { getChildMeta, getDoctypeMeta, doctypes } from '@/lib/doctypeMeta';
import {
  createDoc,
  deleteDoc,
  getApiErrorMessage,
  getDoc,
  getPrintViewUrl,
  listAllDocs,
  updateDoc,
} from '@/lib/frappe';
import { fromDoctypeSlug, safeLabel } from '@/lib/utils';
import { getEditableFields, getFieldDefault, getListFields, parseSelectOptions } from '@/lib/fieldHelpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableWrapper, TH, TD } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { DoctypeField } from '@/types/doctype';

type DocRecord = Record<string, unknown>;
const PAGE_SIZE = 20;

function LinkFieldPicker({
  linkedDoctype,
  value,
  onChange,
  options,
}: {
  linkedDoctype: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((item) => item.toLowerCase().includes(q));
  }, [search, options]);

  return (
    <div className="space-y-2">
      <Input
        placeholder={`Search ${linkedDoctype}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select
        className="h-auto"
        size={Math.min(8, Math.max(4, filtered.length || 4))}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select {linkedDoctype}...</option>
        {filtered.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Select>
    </div>
  );
}

function ChildTableEditor({
  field,
  value,
  onChange,
  linkOptionsMap,
}: {
  field: DoctypeField;
  value: unknown;
  onChange: (v: unknown[]) => void;
  linkOptionsMap: Record<string, string[]>;
}) {
  const rows = Array.isArray(value) ? (value as DocRecord[]) : [];
  const childMeta = getChildMeta(field.options || '');
  const childFields = childMeta ? getEditableFields(childMeta).filter((f) => f.fieldtype !== 'Table') : [];

  function updateCell(index: number, fieldname: string, fieldValue: unknown) {
    const next = [...rows];
    next[index] = { ...next[index], [fieldname]: fieldValue };
    onChange(next);
  }

  function addRow() {
    const row: DocRecord = {};
    childFields.forEach((f) => {
      if (f.fieldname) row[f.fieldname] = getFieldDefault(f);
    });
    onChange([...rows, row]);
  }

  return (
    <div className="space-y-2 rounded-md border border-border p-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-300">{field.label || field.fieldname}</p>
        <Button size="sm" variant="secondary" type="button" onClick={addRow}>
          Add Row
        </Button>
      </div>
      {childFields.length === 0 ? <p className="text-xs text-slate-400">No child meta found for {field.options}</p> : null}
      {rows.map((row, idx) => (
        <div className="grid gap-2 rounded border border-border p-2 md:grid-cols-2" key={idx}>
          {childFields.map((cf) => (
            <div key={`${idx}-${cf.fieldname}`}>
              <label className="mb-1 block text-xs text-slate-400">{cf.label || cf.fieldname}</label>
              {cf.fieldtype === 'Select' && parseSelectOptions(cf).length ? (
                <Select
                  value={String((row[cf.fieldname as string] as string) || '')}
                  onChange={(e) => updateCell(idx, cf.fieldname as string, e.target.value)}
                >
                  <option value="">Select...</option>
                  {parseSelectOptions(cf).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Select>
              ) : cf.fieldtype === 'Link' && cf.options ? (
                <LinkFieldPicker
                  linkedDoctype={cf.options}
                  value={String((row[cf.fieldname as string] as string) || '')}
                  options={linkOptionsMap[cf.options] || []}
                  onChange={(v) => updateCell(idx, cf.fieldname as string, v)}
                />
              ) : (
                <Input
                  value={String((row[cf.fieldname as string] as string) || '')}
                  onChange={(e) => updateCell(idx, cf.fieldname as string, e.target.value)}
                />
              )}
            </div>
          ))}
          <div className="md:col-span-2">
            <Button
              type="button"
              size="sm"
              variant="danger"
              onClick={() => onChange(rows.filter((_, rowIdx) => rowIdx !== idx))}
            >
              Remove Row
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
  linkOptionsMap,
}: {
  field: DoctypeField;
  value: unknown;
  onChange: (v: unknown) => void;
  linkOptionsMap: Record<string, string[]>;
}) {
  if (field.fieldtype === 'Check') {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input checked={!!value} onChange={(e) => onChange(e.target.checked)} type="checkbox" />
        {field.label || field.fieldname}
      </label>
    );
  }

  if (field.fieldtype === 'Table') {
    return <ChildTableEditor field={field} value={value} onChange={(v) => onChange(v)} linkOptionsMap={linkOptionsMap} />;
  }

  const options = field.fieldtype === 'Select' ? parseSelectOptions(field) : [];
  if (options.length) {
    return (
      <Select value={String(value ?? '')} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </Select>
    );
  }

  if (field.fieldtype === 'Link' && field.options) {
    const linkedDoctype = field.options;
    const items = linkOptionsMap[linkedDoctype] || [];
    return (
      <LinkFieldPicker
        linkedDoctype={linkedDoctype}
        value={String(value ?? '')}
        options={items}
        onChange={(v) => onChange(v)}
      />
    );
  }

  if (['Text', 'Small Text', 'Text Editor', 'Long Text', 'Geolocation', 'Code'].includes(field.fieldtype || '')) {
    return <Textarea value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} />;
  }

  const inputType = ['Float', 'Int', 'Currency'].includes(field.fieldtype || '')
    ? 'number'
    : field.fieldtype === 'Date'
      ? 'date'
      : field.fieldtype === 'Datetime'
        ? 'datetime-local'
        : 'text';

  const raw = String(value ?? '');
  const normalizedDate =
    raw.toLowerCase() === 'today'
      ? new Date().toISOString().slice(0, 10)
      : /^\d{4}-\d{2}-\d{2}$/.test(raw)
        ? raw
        : '';
  const normalizedDatetime =
    raw.toLowerCase() === 'now'
      ? new Date().toISOString().slice(0, 16)
      : /^\d{4}-\d{2}-\d{2}[ t]\d{2}:\d{2}/.test(raw)
        ? raw.replace(' ', 'T').slice(0, 16)
        : '';

  const normalizedValue =
    inputType === 'date' ? normalizedDate : inputType === 'datetime-local' ? normalizedDatetime : raw;

  return <Input type={inputType} value={normalizedValue} onChange={(e) => onChange(e.target.value)} />;
}

function getStatusClass(value: unknown) {
  const v = String(value || '').toLowerCase();
  if (['booked', 'allotted', 'possession', 'transferred'].includes(v)) return 'bg-emerald-900/40 text-emerald-300';
  if (['reserved', 'pending'].includes(v)) return 'bg-amber-900/40 text-amber-300';
  if (['cancelled', 'blocked'].includes(v)) return 'bg-rose-900/40 text-rose-300';
  return 'bg-slate-800 text-slate-300';
}

export function DoctypeCrudPage() {
  const { slug = '' } = useParams();
  const doctype = fromDoctypeSlug(slug, doctypes.map((d) => d.name));
  const meta = getDoctypeMeta(doctype);

  const [rows, setRows] = useState<DocRecord[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState<DocRecord>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [linkOptionsMap, setLinkOptionsMap] = useState<Record<string, string[]>>({});

  const listFields = useMemo(() => (meta ? getListFields(meta) : ['name']), [meta]);
  const editableFields = useMemo(() => (meta ? getEditableFields(meta) : []), [meta]);
  const mainFields = useMemo(
    () => editableFields.filter((field) => field.fieldtype !== 'Table'),
    [editableFields],
  );
  const childTableFields = useMemo(
    () => editableFields.filter((field) => field.fieldtype === 'Table'),
    [editableFields],
  );
  const safeRows = Array.isArray(rows) ? rows : [];
  const availableListFields = useMemo(() => {
    const hasAnyExtraField = safeRows.some((row) =>
      listFields.some((f) => f !== 'name' && row[f] !== undefined && row[f] !== null && String(row[f]) !== ''),
    );
    return hasAnyExtraField ? listFields : ['name'];
  }, [safeRows, listFields]);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return safeRows;
    return safeRows.filter((row) =>
      availableListFields.some((field) => String(row[field] ?? '').toLowerCase().includes(q)),
    );
  }, [safeRows, query, availableListFields]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, page]);

  useEffect(() => {
    setPage(1);
  }, [query, slug]);

  useEffect(() => {
    if (!meta) return;
    const defaults: DocRecord = {};
    editableFields.forEach((f) => {
      if (f.fieldname) defaults[f.fieldname] = getFieldDefault(f);
    });
    setForm(defaults);
  }, [meta, editableFields]);

  useEffect(() => {
    if (!meta) return;
    setLoading(true);
    setLoadError('');
    listAllDocs<DocRecord>(meta.name, listFields, 500, 20000)
      .then((docs) => {
        const safe = Array.isArray(docs) ? docs : [];
        setRows(safe);
      })
      .catch((err: unknown) => {
        setRows([]);
        setLoadError(getApiErrorMessage(err));
      })
      .finally(() => setLoading(false));
  }, [meta, listFields]);

  useEffect(() => {
    if (!meta) return;

    const directLinks = editableFields
      .filter((f) => f.fieldtype === 'Link' && f.options)
      .map((f) => String(f.options));

    const childTableLinks = editableFields
      .filter((f) => f.fieldtype === 'Table' && f.options)
      .flatMap((tableField) => {
        const childMeta = getChildMeta(String(tableField.options));
        if (!childMeta) return [];
        return getEditableFields(childMeta)
          .filter((f) => f.fieldtype === 'Link' && f.options)
          .map((f) => String(f.options));
      });

    const linkDoctypes = Array.from(new Set([...directLinks, ...childTableLinks]));

    if (!linkDoctypes.length) {
      setLinkOptionsMap({});
      return;
    }

    Promise.allSettled(
      linkDoctypes.map(async (dt) => {
        const docs = await listAllDocs<DocRecord>(dt, ['name'], 200, 2000);
        const names = docs.map((row) => String(row.name ?? '')).filter(Boolean);
        return [dt, names] as const;
      }),
    ).then((results) => {
      const next: Record<string, string[]> = {};
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          next[result.value[0]] = result.value[1];
        }
      });
      setLinkOptionsMap(next);
    });
  }, [meta, editableFields]);

  if (!meta) return <p>Document not found</p>;
  const activeMeta = meta;

  async function reload() {
    setLoadError('');
    try {
      const docs = await listAllDocs<DocRecord>(activeMeta.name, listFields, 500, 20000);
      setRows(Array.isArray(docs) ? docs : []);
    } catch (err: unknown) {
      setRows([]);
      setLoadError(getApiErrorMessage(err));
    }
  }

  async function onEdit(name: string) {
    const fullRes = await getDoc(activeMeta.name, name);
    const full = ((fullRes as { data?: DocRecord })?.data || fullRes) as DocRecord;
    setSelected(name);
    setForm(full);
  }

  async function onDelete(name: string) {
    if (!confirm(`Delete ${activeMeta.name} ${name}?`)) return;
    await deleteDoc(activeMeta.name, name);
    setMessage(`Deleted ${name}`);
    await reload();
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      if (selected) {
        await updateDoc(activeMeta.name, selected, form);
        setMessage(`Updated ${selected}`);
      } else {
        const payload: DocRecord = { ...form, doctype: activeMeta.name };
        const docRes = await createDoc(activeMeta.name, payload);
        const doc = ((docRes as { data?: DocRecord })?.data || docRes) as DocRecord;
        setMessage(`Created ${String(doc.name || '')}`);
      }
      await reload();
    } catch (err: unknown) {
      setMessage(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    const defaults: DocRecord = {};
    editableFields.forEach((f) => {
      if (f.fieldname) defaults[f.fieldname] = getFieldDefault(f);
    });
    setSelected(null);
    setForm(defaults);
  }

  function exportCsv() {
    const cols = availableListFields;
    const lines = [cols.join(',')];

    filteredRows.forEach((row) => {
      const line = cols
        .map((field) => {
          const v = String(row[field] ?? '').replace(/"/g, '""');
          return `"${v}"`;
        })
        .join(',');
      lines.push(line);
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${activeMeta.name.toLowerCase().replace(/\s+/g, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_430px]">
      <div>
        <Card className="animate-fade-up">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>{activeMeta.name} Documents</CardTitle>
              <div className="flex items-center gap-2">
                <Badge>{filteredRows.length} filtered</Badge>
                <Badge>{safeRows.length} total</Badge>
                <Button size="sm" variant="secondary" onClick={() => void reload()}>
                  <RefreshCw className="mr-1 h-3 w-3" /> Reload
                </Button>
                <Button size="sm" variant="secondary" onClick={exportCsv}>
                  <Download className="mr-1 h-3 w-3" /> Export CSV
                </Button>
              </div>
            </div>

            <div className="relative mt-3 max-w-md">
              <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                className="pl-8"
                placeholder="Search visible fields..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? <p>Loading...</p> : null}
            {loadError ? <p className="mb-2 text-sm text-rose-400">Load error: {loadError}</p> : null}
            <TableWrapper className="max-h-[62vh]">
              <Table>
                <thead>
                  <tr>
                    {availableListFields.map((f) => (
                      <TH key={f}>{safeLabel(f)}</TH>
                    ))}
                    <TH>Actions</TH>
                  </tr>
                </thead>
                <tbody>
                  {pagedRows.map((row) => (
                    <tr key={String(row.name)}>
                      {availableListFields.map((f) => (
                        <TD key={`${row.name}-${f}`}>
                          {f.toLowerCase() === 'status' ? (
                            <span className={`rounded-full px-2 py-1 text-xs ${getStatusClass(row[f])}`}>
                              {String(row[f] ?? '') || '-'}
                            </span>
                          ) : (
                            String(row[f] ?? '')
                          )}
                        </TD>
                      ))}
                      <TD>
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" onClick={() => void onEdit(String(row.name))}>
                            Edit
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => void onDelete(String(row.name))}>
                            Delete
                          </Button>
                        </div>
                      </TD>
                    </tr>
                  ))}
                  {!loading && !pagedRows.length ? (
                    <tr>
                      <TD className="py-6 text-center text-sm text-slate-400" colSpan={availableListFields.length + 1}>
                        No documents found for this view.
                      </TD>
                    </tr>
                  ) : null}
                </tbody>
              </Table>
            </TableWrapper>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <p>
                Page {page} of {pageCount}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Prev
                </Button>
                <Button size="sm" variant="secondary" disabled={page >= pageCount} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="animate-fade-up delay-1 xl:sticky xl:top-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{selected ? `Edit ${selected}` : `Create ${activeMeta.name}`}</CardTitle>
            <Button size="sm" variant="secondary" onClick={resetForm}>
              New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={onSave}>
            {mainFields.map((field) => (
              <div key={field.fieldname}>
                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
                  {field.label || field.fieldname}
                  {field.reqd ? ' *' : ''}
                </label>
                <FieldInput
                  field={field}
                  value={form[field.fieldname as string]}
                  linkOptionsMap={linkOptionsMap}
                  onChange={(v) => setForm((prev) => ({ ...prev, [field.fieldname as string]: v }))}
                />
              </div>
            ))}

            {childTableFields.length ? (
              <div className="rounded-md border border-border bg-slate-950/40 p-3">
                <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">Child Tables</p>
                <div className="space-y-3">
                  {childTableFields.map((field) => (
                    <div key={field.fieldname}>
                      <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
                        {field.label || field.fieldname}
                        {field.reqd ? ' *' : ''}
                      </label>
                      <FieldInput
                        field={field}
                        value={form[field.fieldname as string]}
                        linkOptionsMap={linkOptionsMap}
                        onChange={(v) => setForm((prev) => ({ ...prev, [field.fieldname as string]: v }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {message ? <p className="text-sm text-primary">{message}</p> : null}
            {selected ? (
              <div className="grid gap-2 md:grid-cols-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => window.open(getPrintViewUrl(activeMeta.name, selected), '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Open Print View
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => window.open(`${getPrintViewUrl(activeMeta.name, selected)}&trigger_print=1`, '_blank', 'noopener,noreferrer')}
                >
                  <Printer className="mr-1 h-3 w-3" />
                  Print Selected
                </Button>
              </div>
            ) : null}
            <Button className="w-full" disabled={saving} type="submit">
              {saving ? 'Saving...' : selected ? 'Update' : 'Create'}
            </Button>

            {(activeMeta.controller?.hooks?.length || activeMeta.controller?.throw_lines?.length) ? (
              <div className="rounded-md border border-border bg-slate-900/55 p-3 text-xs">
                <p className="mb-2 uppercase tracking-wider text-slate-400">Backend Validation Notes</p>
                {activeMeta.controller?.hooks?.length ? (
                  <p className="mb-1 text-slate-300">
                    Hooks: {activeMeta.controller.hooks.join(', ')}
                  </p>
                ) : null}
                {activeMeta.controller?.throw_lines?.length ? (
                  <p className="text-slate-300">
                    Throws: {activeMeta.controller.throw_lines.slice(0, 4).join(' | ')}
                  </p>
                ) : null}
              </div>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
