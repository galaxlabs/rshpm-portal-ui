import { useEffect, useMemo, useState } from 'react';
import { Building2, RefreshCw, Timer, Users } from 'lucide-react';
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
      const data = await loadDashboardSnapshot(getTrackedDoctypes(4));
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
  const recentCount = snapshot.recent.length;
  const countByName = useMemo(
    () =>
      Object.fromEntries(snapshot.kpi.map((x) => [x.doctype.toLowerCase(), x.total])) as Record<string, number>,
    [snapshot.kpi],
  );
  const clients = countByName.client || 0;
  const properties = countByName.property || 0;
  const bookings = countByName.booking || 0;
  const payments = countByName.payment || 0;
  const maxForBar = Math.max(1, ...snapshot.kpi.map((k) => k.total));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-border bg-slate-950/55 p-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">Executive Dashboard</p>
          <h2 className="mt-1 text-2xl font-semibold">Core Business Metrics</h2>
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
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="flex items-center gap-2 text-3xl font-bold text-cyan-300">
              <Users className="h-6 w-6" /> {loading ? '...' : clients}
            </p>
            <p className="text-xs text-slate-400">Active client records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="flex items-center gap-2 text-3xl font-bold text-emerald-300">
              <Building2 className="h-6 w-6" /> {loading ? '...' : properties}
            </p>
            <p className="text-xs text-slate-400">Inventory units/properties</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-300">{loading ? '...' : bookings}</p>
            <p className="text-xs text-slate-400">Confirmed and active bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-pink-300">{loading ? '...' : payments}</p>
            <p className="text-xs text-slate-400">Registered payment vouchers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Core Records</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{loading ? '...' : total}</p>
            <p className="text-xs text-slate-400">Clients + Properties + Bookings + Payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="flex items-center gap-2 text-3xl font-bold text-primary">
              <Timer className="h-6 w-6" /> {loading ? '...' : recentCount}
            </p>
            <p className="text-xs text-slate-400">Last modified records inspected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Module Load Board</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {snapshot.kpi.map((item) => (
                <div key={item.doctype} className="rounded-md border border-border bg-gradient-to-r from-slate-900/70 to-slate-950/40 p-3">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{item.doctype}</span>
                    <span className="text-slate-300">{item.total}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400"
                      style={{
                        width: `${Math.max(6, Math.round((item.total / maxForBar) * 100))}%`,
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
