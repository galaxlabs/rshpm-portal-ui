import { listAllDocs } from '@/lib/frappe';

type AnyDoc = Record<string, unknown>;

type BookingRow = {
  name: string;
  client: string;
  property: string;
  status: string;
  netTotal: number;
  totalPaid: number;
  remainingBalance: number;
  modified: string;
};

type PaymentRow = {
  name: string;
  client: string;
  booking: string;
  property: string;
  status: string;
  amount: number;
  modified: string;
};

export type ClientStatement = {
  client: string;
  bookingsCount: number;
  bookingValue: number;
  paymentsCount: number;
  paymentValue: number;
  balance: number;
  bookings: BookingRow[];
  payments: PaymentRow[];
};

function toNum(v: unknown) {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function getClientName(doc: AnyDoc) {
  return String(doc.customer || doc.client || doc.client_name || doc.party || 'Unmapped');
}

export async function loadClientStatements() {
  const [bookings, payments] = await Promise.all([
    listAllDocs<AnyDoc>(
      'Booking',
      ['name', 'customer', 'client', 'property', 'status', 'net_total', 'total_paid', 'remaining_balance', 'modified'],
      500,
      20000,
    ),
    listAllDocs<AnyDoc>(
      'Payment',
      ['name', 'customer', 'client', 'booking', 'property', 'status', 'paid_amount', 'amount_paid', 'amount', 'modified'],
      500,
      20000,
    ),
  ]);

  const rows = new Map<string, ClientStatement>();
  const ensure = (client: string) => {
    if (!rows.has(client)) {
      rows.set(client, {
        client,
        bookingsCount: 0,
        bookingValue: 0,
        paymentsCount: 0,
        paymentValue: 0,
        balance: 0,
        bookings: [],
        payments: [],
      });
    }
    return rows.get(client)!;
  };

  bookings.forEach((doc) => {
    const client = getClientName(doc);
    const row = ensure(client);
    const netTotal = toNum(doc.net_total);
    const totalPaid = toNum(doc.total_paid);
    const remainingBalance = toNum(doc.remaining_balance);

    row.bookingsCount += 1;
    row.bookingValue += netTotal;
    row.balance += remainingBalance;
    row.bookings.push({
      name: String(doc.name || ''),
      client,
      property: String(doc.property || ''),
      status: String(doc.status || ''),
      netTotal,
      totalPaid,
      remainingBalance,
      modified: String(doc.modified || ''),
    });
  });

  payments.forEach((doc) => {
    const client = getClientName(doc);
    const row = ensure(client);
    const amount = toNum(doc.paid_amount || doc.amount_paid || doc.amount);
    row.paymentsCount += 1;
    row.paymentValue += amount;
    row.payments.push({
      name: String(doc.name || ''),
      client,
      booking: String(doc.booking || ''),
      property: String(doc.property || ''),
      status: String(doc.status || ''),
      amount,
      modified: String(doc.modified || ''),
    });
  });

  return [...rows.values()]
    .sort((a, b) => b.bookingValue - a.bookingValue)
    .slice(0, 200);
}
