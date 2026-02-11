import { doctypes } from '@/lib/doctypeMeta';
import { listAllDocs } from '@/lib/frappe';

export type DashboardKpi = {
  doctype: string;
  total: number;
};

export type ActivityItem = {
  doctype: string;
  name: string;
  modified?: string;
  status?: string;
};

export type DashboardSnapshot = {
  kpi: DashboardKpi[];
  recent: ActivityItem[];
  monthly: Array<{ month: string; total: number }>;
  statusMix: Array<{ status: string; total: number }>;
};

const priorityKeywords = [
  /property/i,
  /inquiry/i,
  /booking/i,
  /allotment/i,
  /payment/i,
  /possession/i,
  /transfer/i,
  /client/i,
];

export function getTrackedDoctypes(limit = 10) {
  const chosen: string[] = [];
  for (const matcher of priorityKeywords) {
    const hit = doctypes.find((dt) => matcher.test(dt.name))?.name;
    if (hit && !chosen.includes(hit)) chosen.push(hit);
  }
  if (chosen.length < limit) {
    doctypes.forEach((dt) => {
      if (chosen.length < limit && !chosen.includes(dt.name)) chosen.push(dt.name);
    });
  }
  return chosen.slice(0, limit);
}

export async function loadDashboardSnapshot(tracked: string[]): Promise<DashboardSnapshot> {
  const results = await Promise.allSettled(
    tracked.map(async (doctype) => {
      const docs = await listAllDocs<Record<string, unknown>>(
        doctype,
        ['name', 'modified', 'status'],
        500,
        10000,
      );
      return { doctype, docs };
    }),
  );

  const fulfilled = results
    .filter(
      (
        r,
      ): r is PromiseFulfilledResult<{
        doctype: string;
        docs: Record<string, unknown>[];
      }> => r.status === 'fulfilled',
    )
    .map((r) => r.value);

  const kpi = fulfilled
    .map((item) => ({ doctype: item.doctype, total: item.docs.length }))
    .sort((a, b) => b.total - a.total);

  const recent = fulfilled
    .flatMap((item) =>
      item.docs.map((doc) => ({
        doctype: item.doctype,
        name: String(doc.name || ''),
        modified: String(doc.modified || ''),
        status: String(doc.status || ''),
      })),
    )
    .sort((a, b) => (a.modified < b.modified ? 1 : -1))
    .slice(0, 20);

  const monthlyMap = new Map<string, number>();
  recent.forEach((item) => {
    const date = item.modified ? new Date(item.modified) : null;
    if (!date || Number.isNaN(date.getTime())) return;
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 1);
  });

  const monthly = [...monthlyMap.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .slice(-8)
    .map(([month, total]) => ({ month, total }));

  const statusMap = new Map<string, number>();
  recent.forEach((item) => {
    const key = (item.status || 'Unspecified').trim() || 'Unspecified';
    statusMap.set(key, (statusMap.get(key) || 0) + 1);
  });

  const statusMix = [...statusMap.entries()]
    .map(([status, total]) => ({ status, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  return { kpi, recent, monthly, statusMix };
}
