import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Layers3, RefreshCw, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTrackedDoctypes, loadDashboardSnapshot, type DashboardSnapshot } from '@/lib/dashboard';

const emptySnapshot: DashboardSnapshot = {
  kpi: [],
  recent: [],
  monthly: [],
  statusMix: [],
};

export function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(emptySnapshot);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await loadDashboardSnapshot(getTrackedDoctypes(10));
      setSnapshot(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const total = useMemo(
    () => snapshot.kpi.reduce((sum, item) => sum + item.total, 0),
    [snapshot.kpi],
  );
  const top = snapshot.kpi[0];
  const recentCount = snapshot.recent.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-border bg-slate-950/55 p-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">Executive Dashboard</p>
          <h2 className="mt-1 text-2xl font-semibold">Portfolio Overview</h2>
        </div>
        <Button size="sm" variant="secondary" onClick={() => void load()} disabled={loading}>
          <RefreshCw className="mr-1 h-3 w-3" />
          Refresh
        </Button>
      </div>

      {error ? <p className="rounded-md border border-red-800 bg-red-950/40 p-3 text-sm text-red-300">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{loading ? '...' : total}</p>
            <p className="text-xs text-slate-400">From tracked business DocTypes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top DocType</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="flex items-center gap-1 text-xl font-bold">
              {loading ? '...' : top?.doctype || '-'} <ArrowUpRight className="h-4 w-4 text-primary" />
            </p>
            <p className="text-xs text-slate-400">{top?.total || 0} records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tracked Models</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="flex items-center gap-2 text-3xl font-bold">
              <Layers3 className="h-6 w-6 text-primary" /> {snapshot.kpi.length}
            </p>
            <p className="text-xs text-slate-400">Categorized in sidebar groups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="flex items-center gap-2 text-3xl font-bold">
              <Timer className="h-6 w-6 text-primary" /> {loading ? '...' : recentCount}
            </p>
            <p className="text-xs text-slate-400">Last modified records inspected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>DocType Load Board</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {snapshot.kpi.map((item) => (
                <div key={item.doctype} className="rounded-md border border-border bg-slate-900/50 p-3">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{item.doctype}</span>
                    <span className="text-slate-300">{item.total}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-teal-400"
                      style={{
                        width: `${Math.max(
                          6,
                          Math.round((item.total / Math.max(1, top?.total || 1)) * 100),
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
              {!snapshot.kpi.length && !loading ? (
                <p className="text-sm text-slate-400">No records available yet.</p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {snapshot.recent.slice(0, 12).map((item) => (
                <div key={`${item.doctype}-${item.name}`} className="rounded-md border border-border bg-slate-900/50 p-3">
                  <p className="text-sm font-semibold text-slate-100">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.doctype}</p>
                  <p className="text-xs text-slate-500">
                    {item.modified ? new Date(item.modified).toLocaleString() : '-'}
                  </p>
                </div>
              ))}
              {!snapshot.recent.length && !loading ? (
                <p className="text-sm text-slate-400">No recent updates found.</p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
