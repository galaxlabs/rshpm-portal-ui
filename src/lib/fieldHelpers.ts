import type { DoctypeField, DoctypeMeta } from '@/types/doctype';

const layoutTypes = new Set([
  'Section Break',
  'Column Break',
  'Tab Break',
  'HTML',
  'Button',
  'Heading',
]);

export function getRenderableFields(meta: DoctypeMeta) {
  return meta.fields.filter((f) => f.fieldname && !layoutTypes.has(f.fieldtype || ''));
}

export function getEditableFields(meta: DoctypeMeta) {
  return getRenderableFields(meta).filter((f) => !f.read_only && !f.hidden);
}

export function getListFields(meta: DoctypeMeta) {
  const fields = getRenderableFields(meta).filter((f) => f.in_list_view && f.fieldname);
  const mapped = fields.map((f) => f.fieldname as string);
  return ['name', ...mapped.slice(0, 7), 'modified'];
}

export function getFieldDefault(f: DoctypeField) {
  if (f.default !== undefined && f.default !== null) return f.default;
  if (f.fieldtype === 'Check') return false;
  if (f.fieldtype === 'Table') return [];
  return '';
}

export function parseSelectOptions(field: DoctypeField) {
  return (field.options || '')
    .split('\n')
    .map((o) => o.trim())
    .filter(Boolean);
}
