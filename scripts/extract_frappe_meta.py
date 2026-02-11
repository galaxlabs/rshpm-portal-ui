#!/usr/bin/env python3
import json
import re
from pathlib import Path
from datetime import datetime, UTC

SOURCE_ROOT = Path('/home/dg/db-b/apps/rshpm_system/rshpm_system/rshpm_system/doctype')
OUT_JSON = Path('/home/dg/rshpm-portal-ui/src/data/doctypes.generated.json')
OUT_MD = Path('/home/dg/rshpm-portal-ui/docs/doctype-model-audit.md')

HOOK_NAMES = [
    'validate', 'before_insert', 'after_insert', 'before_save', 'on_update',
    'before_submit', 'on_submit', 'before_cancel', 'on_cancel', 'on_trash'
]


def parse_python_rules(py_path: Path):
    result = {'hooks': [], 'throw_lines': []}
    if not py_path.exists():
        return result

    text = py_path.read_text(encoding='utf-8')

    hook_pattern = re.compile(r'^\s*def\s+(' + '|'.join(HOOK_NAMES) + r')\s*\(', re.MULTILINE)
    result['hooks'] = sorted(set(hook_pattern.findall(text)))

    for line in text.splitlines():
        if 'frappe.throw(' in line:
            cleaned = line.strip()
            if len(cleaned) > 220:
                cleaned = cleaned[:220] + '...'
            result['throw_lines'].append(cleaned)

    return result


def normalize_field(field: dict):
    return {
        'fieldname': field.get('fieldname'),
        'label': field.get('label'),
        'fieldtype': field.get('fieldtype'),
        'reqd': int(bool(field.get('reqd'))),
        'read_only': int(bool(field.get('read_only'))),
        'hidden': int(bool(field.get('hidden'))),
        'in_list_view': int(bool(field.get('in_list_view'))),
        'options': field.get('options'),
        'default': field.get('default'),
        'fetch_from': field.get('fetch_from'),
    }


def parse_doctype(json_path: Path):
    raw = json.loads(json_path.read_text(encoding='utf-8'))
    py_path = json_path.with_suffix('.py')
    py_meta = parse_python_rules(py_path)

    fields = [normalize_field(f) for f in raw.get('fields', [])]
    permissions = []
    for perm in raw.get('permissions', []):
        permissions.append({
            'role': perm.get('role'),
            'read': int(bool(perm.get('read'))),
            'write': int(bool(perm.get('write'))),
            'create': int(bool(perm.get('create'))),
            'delete': int(bool(perm.get('delete'))),
            'submit': int(bool(perm.get('submit'))),
            'cancel': int(bool(perm.get('cancel'))),
            'amend': int(bool(perm.get('amend'))),
            'print': int(bool(perm.get('print'))),
            'email': int(bool(perm.get('email'))),
            'share': int(bool(perm.get('share'))),
            'export': int(bool(perm.get('export'))),
            'report': int(bool(perm.get('report'))),
        })

    return {
        'name': raw.get('name'),
        'module': raw.get('module'),
        'istable': int(bool(raw.get('istable'))),
        'is_submittable': int(bool(raw.get('is_submittable'))),
        'autoname': raw.get('autoname'),
        'naming_rule': raw.get('naming_rule'),
        'title_field': raw.get('title_field'),
        'search_fields': raw.get('search_fields'),
        'quick_entry': int(bool(raw.get('quick_entry'))),
        'track_changes': int(bool(raw.get('track_changes'))),
        'field_order': raw.get('field_order', []),
        'fields': fields,
        'permissions': permissions,
        'controller': py_meta,
    }


def write_markdown(meta: dict):
    lines = []
    lines.append('# RSHPM DocType Model Audit')
    lines.append('')
    lines.append(f"Generated: {datetime.now(UTC).isoformat()}")
    lines.append('')
    lines.append(f"Total DocTypes: {len(meta['doctypes'])}")
    lines.append('')

    for dt in meta['doctypes']:
        lines.append(f"## {dt['name']}")
        lines.append('')
        lines.append(f"- Module: `{dt['module']}`")
        lines.append(f"- Table DocType: `{bool(dt['istable'])}`")
        lines.append(f"- Submittable: `{bool(dt['is_submittable'])}`")
        lines.append(f"- Autoname: `{dt['autoname']}`")
        lines.append('')

        lines.append('### Fields')
        lines.append('')
        lines.append('| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |')
        lines.append('|---|---|---:|---:|---:|---:|---:|---|')
        for f in dt['fields']:
            options = (f['options'] or '').replace('\n', ', ')
            lines.append(
                f"| {f['fieldname'] or ''} | {f['label'] or ''} | {f['fieldtype'] or ''} | {f['reqd']} | {f['read_only']} | {f['hidden']} | {f['in_list_view']} | {options} |"
            )
        lines.append('')

        lines.append('### Permissions')
        lines.append('')
        if not dt['permissions']:
            lines.append('- No explicit permissions in DocType JSON.')
        else:
            lines.append('| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |')
            lines.append('|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|')
            for p in dt['permissions']:
                lines.append(
                    f"| {p['role'] or ''} | {p['read']} | {p['write']} | {p['create']} | {p['delete']} | {p['submit']} | {p['cancel']} | {p['amend']} | {p['report']} | {p['export']} |"
                )
        lines.append('')

        lines.append('### Validation/Logic (Python Controller)')
        lines.append('')
        hooks = ', '.join(dt['controller']['hooks']) if dt['controller']['hooks'] else 'None detected'
        lines.append(f"- Hooks: {hooks}")
        if dt['controller']['throw_lines']:
            lines.append('- `frappe.throw` lines:')
            for t in dt['controller']['throw_lines']:
                lines.append(f"  - `{t}`")
        else:
            lines.append('- `frappe.throw` lines: none detected')
        lines.append('')

    OUT_MD.write_text('\n'.join(lines), encoding='utf-8')


def main():
    doctypes = []
    for dt_dir in sorted(SOURCE_ROOT.iterdir()):
        if not dt_dir.is_dir() or dt_dir.name.startswith('__'):
            continue
        json_path = dt_dir / f"{dt_dir.name}.json"
        if not json_path.exists():
            continue
        doctypes.append(parse_doctype(json_path))

    meta = {
        'source': str(SOURCE_ROOT),
        'generated_at': datetime.now(UTC).isoformat(),
        'doctypes': doctypes,
    }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_MD.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(meta, indent=2), encoding='utf-8')
    write_markdown(meta)

    print(f"Generated {OUT_JSON} and {OUT_MD} for {len(doctypes)} DocTypes")


if __name__ == '__main__':
    main()
