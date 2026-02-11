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
    loadDashboardSnapshot(getTrackedDoctypes(10))
      .then((data) => setSnapshot(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-400">Analytics Workspace</p>
        <h2 className="text-2xl font-semibold">Charts and Trend Monitoring</h2>
      </div>

      {loading ? <p className="text-sm text-slate-300">Loading charts...</p> : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Volume by DocType</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={snapshot.kpi}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="doctype" stroke="#cbd5e1" angle={-15} textAnchor="end" height={70} />
                <YAxis stroke="#cbd5e1" />
                <Tooltip />
                <Bar dataKey="total" radius={4}>
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
            <CardTitle>Monthly Change</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={snapshot.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#14b8a6" fill="#14b8a655" strokeWidth={2} />
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
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={snapshot.statusMix} dataKey="total" nameKey="status" outerRadius={105} innerRadius={48}>
                  {snapshot.statusMix.map((entry, index) => (
                    <Cell key={entry.status} fill={palette[index % palette.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Line Trend (Monthly)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={snapshot.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Raw KPI Grid (for external chart tools)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="border-b border-border px-3 py-2 text-left text-xs uppercase text-slate-400">DocType</th>
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
