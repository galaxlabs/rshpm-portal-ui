import { useEffect, useState } from 'react';
import { ExternalLink, Printer } from 'lucide-react';
import { doctypes } from '@/lib/doctypeMeta';
import { fetchPrintHtml, getApiErrorMessage, getPrintViewUrl, listDocs, listPrintFormats } from '@/lib/frappe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

type ListItem = {
  name: string;
  modified?: string;
};

export function PrintCenterPage() {
  const [doctype, setDoctype] = useState(doctypes[0]?.name || '');
  const [docs, setDocs] = useState<ListItem[]>([]);
  const [formats, setFormats] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [format, setFormat] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!doctype) return;
    setLoading(true);
    setError('');
    Promise.all([
      listDocs<ListItem>(doctype, ['name', 'modified'], 80, 0),
      listPrintFormats(doctype).catch(() => []),
    ])
      .then(([records, availableFormats]) => {
        setDocs(records);
        setName(records[0]?.name || '');
        setFormats(availableFormats);
        setFormat(availableFormats[0] || '');
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [doctype]);

  async function onLoadHtml() {
    if (!doctype || !name) return;
    setError('');
    setLoading(true);
    try {
      const htmlPayload = await fetchPrintHtml(doctype, name, format || undefined);
      const rendered = `${htmlPayload.style || htmlPayload.css || ''}${htmlPayload.html || ''}`;
      setPreviewHtml(rendered);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setPreviewHtml('');
    } finally {
      setLoading(false);
    }
  }

  function openPrint(trigger = false) {
    if (!doctype || !name) return;
    const url = getPrintViewUrl(doctype, name, format || undefined, trigger);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-400">Print Center</p>
        <h2 className="text-2xl font-semibold">Default and HTML Print Views</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Print Source</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">DocType</label>
            <Select value={doctype} onChange={(e) => setDoctype(e.target.value)}>
              {doctypes.map((dt) => (
                <option key={dt.name} value={dt.name}>
                  {dt.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Document</label>
            <Select value={name} onChange={(e) => setName(e.target.value)}>
              {docs.map((doc) => (
                <option key={doc.name} value={doc.name}>
                  {doc.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Print Format</label>
            <Select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="">Default</option>
              {formats.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Manual Document Name</label>
            <Input
              value={name}
              placeholder="Enter document name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => openPrint(false)} disabled={!name || loading}>
          <ExternalLink className="mr-1 h-4 w-4" />
          Open Default Print
        </Button>
        <Button variant="secondary" onClick={() => openPrint(true)} disabled={!name || loading}>
          <Printer className="mr-1 h-4 w-4" />
          Open Browser Print Dialog
        </Button>
        <Button onClick={() => void onLoadHtml()} disabled={!name || loading}>
          Load HTML Preview
        </Button>
      </div>

      {error ? <p className="rounded-md border border-red-800 bg-red-950/40 p-3 text-sm text-red-300">{error}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>HTML Print Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {!previewHtml ? (
            <p className="text-sm text-slate-400">Load HTML preview to render the Frappe print template here.</p>
          ) : (
            <iframe title="print-preview" className="h-[76vh] w-full rounded-md border border-border bg-white" srcDoc={previewHtml} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
