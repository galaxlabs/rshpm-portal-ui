export type DoctypeField = {
  fieldname?: string;
  label?: string | null;
  fieldtype?: string | null;
  reqd?: number;
  read_only?: number;
  hidden?: number;
  in_list_view?: number;
  options?: string | null;
  default?: string | null;
  fetch_from?: string | null;
};

export type DoctypePermission = {
  role?: string | null;
  read?: number;
  write?: number;
  create?: number;
  delete?: number;
  submit?: number;
  cancel?: number;
  amend?: number;
  print?: number;
  email?: number;
  share?: number;
  export?: number;
  report?: number;
};

export type DoctypeController = {
  hooks: string[];
  throw_lines: string[];
};

export type DoctypeMeta = {
  name: string;
  module?: string | null;
  istable?: number;
  is_submittable?: number;
  autoname?: string | null;
  naming_rule?: string | null;
  title_field?: string | null;
  search_fields?: string | null;
  quick_entry?: number;
  track_changes?: number;
  field_order: string[];
  fields: DoctypeField[];
  permissions: DoctypePermission[];
  controller: DoctypeController;
};

export type DoctypeDump = {
  source: string;
  generated_at: string;
  doctypes: DoctypeMeta[];
};
