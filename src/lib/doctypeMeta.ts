import dump from '@/data/doctypes.generated.json';
import type { DoctypeDump, DoctypeMeta } from '@/types/doctype';

const metaDump = dump as unknown as DoctypeDump;

export const doctypes: DoctypeMeta[] = metaDump.doctypes.filter((d) => !d.istable);
export const childTables: DoctypeMeta[] = metaDump.doctypes.filter((d) => !!d.istable);

export type DoctypeGroup = {
  name: string;
  items: DoctypeMeta[];
};

const categoryMatchers: Array<{ name: string; match: RegExp }> = [
  { name: 'Sales Pipeline', match: /inquiry|booking|allotment|possession|transfer|deal|lead/i },
  { name: 'Property Management', match: /property|unit|tower|floor|project|block|location/i },
  { name: 'Client & CRM', match: /client|customer|contact|partner|investor/i },
  { name: 'Finance & Payments', match: /payment|invoice|receipt|ledger|commission|tax/i },
  { name: 'Legal & Documentation', match: /agreement|document|letter|kyc|contract|print/i },
  { name: 'System & Setup', match: /setting|config|template|role|permission|user/i },
];

export function groupDoctypesByCategory(items: DoctypeMeta[]) {
  const groups = new Map<string, DoctypeMeta[]>();
  categoryMatchers.forEach((c) => groups.set(c.name, []));
  groups.set('Other', []);

  items.forEach((doctype) => {
    const text = `${doctype.name} ${doctype.module || ''}`;
    const category = categoryMatchers.find((c) => c.match.test(text))?.name || 'Other';
    groups.get(category)?.push(doctype);
  });

  return [...groups.entries()]
    .map(([name, grouped]) => ({
      name,
      items: grouped.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .filter((g) => g.items.length);
}

export function getDoctypeMeta(name: string) {
  return metaDump.doctypes.find((dt) => dt.name === name);
}

export function getChildMeta(name: string) {
  return childTables.find((dt) => dt.name === name);
}

export const generatedAt = metaDump.generated_at;
