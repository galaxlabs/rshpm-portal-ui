import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTrackedDoctypes, loadDashboardSnapshot, type DashboardSnapshot } from '@/lib/dashboard';

const palette = ['#22d3ee', '#2dd4bf', '#84cc16', '#facc15', '#fb7185', '#818cf8', '#f97316', '#06b6d4'];

const emptySnapshot: DashboardSnapshot = {
  kpi: [],
  recent: [],
  monthly: [],
  statusMix: [],
};

export function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(emptySnapshot);

  useEffect(() => {
    setLoading(true);
    loadDashboardSnapshot(getTrackedDoctypes(4))
      .then((data) => setSnapshot(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-400">Analytics Workspace</p>
        <h2 className="text-2xl font-semibold">Core Charts and Metrics</h2>
      </div>

      {loading ? <p className="text-sm text-slate-300">Loading charts...</p> : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Core Volume Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-72 rounded-md bg-gradient-to-br from-cyan-950/25 to-slate-950/30">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={snapshot.kpi}>
                <CartesianGrid strokeDasharray="4 4" stroke="#223146" vertical={false} />
                <XAxis dataKey="doctype" stroke="#dbeafe" />
                <YAxis stroke="#dbeafe" />
                <Tooltip
                  contentStyle={{ background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="total" radius={[8, 8, 0, 0]} barSize={36}>
                  {snapshot.kpi.map((entry, index) => (
                    <Cell key={entry.doctype} fill={palette[index % palette.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Movement</CardTitle>
          </CardHeader>
          <CardContent className="h-72 rounded-md bg-gradient-to-br from-emerald-950/25 to-slate-950/30">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={snapshot.monthly}>
                <CartesianGrid strokeDasharray="4 4" stroke="#223146" vertical={false} />
                <XAxis dataKey="month" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{ background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="total" stroke="#22d3ee" fill="#22d3ee33" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72 rounded-md bg-gradient-to-br from-fuchsia-950/20 to-slate-950/30">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={snapshot.statusMix} dataKey="total" nameKey="status" outerRadius={110} innerRadius={60} paddingAngle={2}>
                  {snapshot.statusMix.map((entry, index) => (
                    <Cell key={entry.status} fill={palette[index % palette.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trend Line</CardTitle>
          </CardHeader>
          <CardContent className="h-72 rounded-md bg-gradient-to-br from-indigo-950/25 to-slate-950/30">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={snapshot.monthly}>
                <CartesianGrid strokeDasharray="4 4" stroke="#223146" vertical={false} />
                <XAxis dataKey="month" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{ background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Line type="monotone" dataKey="total" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, fill: '#7dd3fc' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module KPI Grid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="border-b border-border px-3 py-2 text-left text-xs uppercase text-slate-400">Module</th>
                  <th className="border-b border-border px-3 py-2 text-left text-xs uppercase text-slate-400">Total</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.kpi.map((item) => (
                  <tr key={item.doctype}>
                    <td className="border-b border-border px-3 py-2">{item.doctype}</td>
                    <td className="border-b border-border px-3 py-2">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
