import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { loadClientStatements, type ClientStatement } from '@/lib/reports';

function money(v: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v);
}

export function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<ClientStatement[]>([]);

  useEffect(() => {
    setLoading(true);
    setError('');
    loadClientStatements()
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load statements'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.client.toLowerCase().includes(q));
  }, [rows, query]);

  const totalBooking = filtered.reduce((sum, r) => sum + r.bookingValue, 0);
  const totalPayment = filtered.reduce((sum, r) => sum + r.paymentValue, 0);
  const totalBalance = filtered.reduce((sum, r) => sum + r.balance, 0);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-400">Reporting 02</p>
        <h2 className="text-2xl font-semibold">Client Wise Statements</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Booking Value</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{money(totalBooking)}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Payments</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{money(totalPayment)}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Outstanding</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{money(totalBalance)}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 max-w-md">
            <Input
              placeholder="Search client..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {loading ? <p className="text-sm text-slate-400">Loading statements...</p> : null}
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          {!loading && !error ? (
            <div className="space-y-3">
              {filtered.map((row) => (
                <details key={row.client} className="rounded-md border border-border bg-slate-900/50 p-3">
                  <summary className="cursor-pointer list-none">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold">{row.client}</span>
                      <span className="text-xs text-slate-300">
                        Bookings {row.bookingsCount} | Payments {row.paymentsCount} | Balance {money(row.balance)}
                      </span>
                    </div>
                  </summary>
                  <div className="mt-3 grid gap-3 xl:grid-cols-2">
                    <div>
                      <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">Booking Children</p>
                      <div className="space-y-2">
                        {row.bookings.map((b) => (
                          <div key={b.name} className="rounded border border-border p-2 text-xs">
                            <p className="font-semibold">{b.name}</p>
                            <p>Property: {b.property || '-'}</p>
                            <p>Status: {b.status || '-'}</p>
                            <p>Net: {money(b.netTotal)} | Paid: {money(b.totalPaid)} | Bal: {money(b.remainingBalance)}</p>
                          </div>
                        ))}
                        {!row.bookings.length ? <p className="text-xs text-slate-400">No booking rows.</p> : null}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">Payment Children</p>
                      <div className="space-y-2">
                        {row.payments.map((p) => (
                          <div key={p.name} className="rounded border border-border p-2 text-xs">
                            <p className="font-semibold">{p.name}</p>
                            <p>Booking: {p.booking || '-'}</p>
                            <p>Property: {p.property || '-'}</p>
                            <p>Status: {p.status || '-'}</p>
                            <p>Amount: {money(p.amount)}</p>
                          </div>
                        ))}
                        {!row.payments.length ? <p className="text-xs text-slate-400">No payment rows.</p> : null}
                      </div>
                    </div>
                  </div>
                </details>
              ))}
              {!filtered.length ? <p className="text-sm text-slate-400">No client records found.</p> : null}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
