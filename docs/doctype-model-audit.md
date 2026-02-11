# RSHPM DocType Model Audit

Generated: 2026-02-11T12:19:05.810365+00:00

Total DocTypes: 29

## Allotment

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `True`
- Autoname: `naming_series:`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| naming_series |  | Select | 0 | 1 | 1 | 0 | ALT-.YYYY.-.##### |
| company | Company | Link | 1 | 1 | 0 | 1 | Property Company |
| column_break_fepm |  | Column Break | 0 | 0 | 0 | 0 |  |
| booking | Booking | Link | 1 | 0 | 0 | 0 | Booking |
| client | Client | Link | 0 | 0 | 0 | 0 | Client |
| section_break_gurt |  | Section Break | 0 | 0 | 0 | 0 |  |
| property | Property | Link | 0 | 0 | 0 | 0 | Property |
| column_break_phyg |  | Column Break | 0 | 0 | 0 | 0 |  |
| allotment_date | Allotment Date | Date | 0 | 0 | 0 | 0 |  |
| total_price | Total Price | Currency | 0 | 0 | 0 | 0 |  |
| section_break_pflp |  | Section Break | 0 | 0 | 0 | 0 |  |
| terms | Terms | Text Editor | 0 | 0 | 0 | 0 |  |
| signed_copy | Signed Copy | Attach | 0 | 0 | 0 | 0 |  |
| amended_from | Amended From | Link | 0 | 1 | 0 | 0 | Allotment |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |
| Sales User | 1 | 1 | 1 | 0 | 1 | 0 | 0 | 1 | 1 |
| Manager | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 1 | 1 |
| Client | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: on_cancel, on_submit, validate
- `frappe.throw` lines:
  - `frappe.throw("Invalid Booking.", title="Invalid Booking")`
  - `frappe.throw("Booking must be submitted before allotment.", title="Booking Not Submitted")`
  - `frappe.throw("Booking company and Allotment company must be the same.", title="Company Mismatch")`
  - `frappe.throw("Invalid Property.", title="Invalid Property")`
  - `frappe.throw(`
  - `frappe.throw(`
  - `frappe.throw(f"Cannot allot property because it is already {prop_status}.", title="Property Locked")`
  - `frappe.throw(f"Cannot cancel allotment because property is already {prop_status}.", title="Not Allowed")`

## Amenity

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `False`
- Autoname: `field:amenity_name`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| amenity_name | Amenity Name | Data | 0 | 0 | 0 | 0 |  |
| is_active | Is Active | Check | 0 | 0 | 0 | 0 |  |
| category | Category | Link | 0 | 0 | 0 | 0 | Amenity Category |
| description | Description | Small Text | 0 | 0 | 0 | 0 |  |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: None detected
- `frappe.throw` lines: none detected

## Amenity Category

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `False`
- Autoname: `field:category_name`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| category_name | Category Name | Data | 0 | 0 | 0 | 0 |  |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: None detected
- `frappe.throw` lines: none detected

## Attachments

- Module: `Rshpm System`
- Table DocType: `True`
- Submittable: `False`
- Autoname: `None`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| document_types | Document Types | Link | 0 | 0 | 0 | 1 | Document Types |
| attachment | Attachment | Attach | 0 | 0 | 0 | 1 |  |
| required | Required | Check | 0 | 0 | 0 | 1 | Document Types |
| received | Received | Check | 0 | 0 | 0 | 1 | Document Types |

### Permissions

- No explicit permissions in DocType JSON.

### Validation/Logic (Python Controller)

- Hooks: None detected
- `frappe.throw` lines: none detected

## Bank Transactions

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `False`
- Autoname: `None`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| company | Company | Link | 0 | 0 | 0 | 0 | Company |
| column_break_uvig |  | Column Break | 0 | 0 | 0 | 0 |  |
| bank_account | Bank Account | Data | 0 | 0 | 0 | 0 |  |
| txn_date | Txn Date | Data | 0 | 0 | 0 | 0 |  |
| amount | Amount | Currency | 0 | 0 | 0 | 0 |  |
| reference | Reference | Small Text | 0 | 0 | 0 | 0 |  |
| sender_account | Sender Account | Data | 0 | 0 | 0 | 0 |  |
| status | Status | Select | 0 | 0 | 0 | 0 | Unmatched, Matched, Investigate |
| matched_payment | Matched Payment | Link | 0 | 0 | 0 | 0 | Payment |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: None detected
- `frappe.throw` lines: none detected

## Block

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `False`
- Autoname: `field:block_name`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| block_name | Block Name | Data | 0 | 0 | 0 | 0 |  |
| total_number_of_plots | Total Number of Plots | Int | 0 | 0 | 0 | 0 |  |
| amended_from | Amended From | Link | 0 | 1 | 0 | 0 | Block |
| company | Company | Link | 0 | 0 | 0 | 0 | Company |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: None detected
- `frappe.throw` lines: none detected

## Block Layout Plan

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `True`
- Autoname: `format:{project_name}-{file_no}`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| block | Block | Link | 0 | 0 | 0 | 0 | Block |
| approved_map | Approved Map | Attach | 0 | 0 | 0 | 0 |  |
| plots_list | list of plots | Data | 0 | 0 | 0 | 0 |  |
| status | Status | Select | 0 | 0 | 0 | 0 | Draft, Submitted, Approved |
| layout_plan_items | Layout Plan Items | Table | 0 | 0 | 0 | 0 | Layout Plan Items |
| project_name | Project Name | Link | 0 | 0 | 0 | 0 | Block |
| file_no | File No | Link | 0 | 0 | 0 | 0 | Block |
| amended_from | Amended From | Link | 0 | 1 | 0 | 0 | Block Layout Plan |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: None detected
- `frappe.throw` lines: none detected

## Booking

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `True`
- Autoname: `None`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| booking_date | Booking Date | Date | 1 | 0 | 0 | 1 |  |
| column_break_hsgk |  | Column Break | 0 | 0 | 0 | 0 |  |
| customer | Customer | Link | 1 | 0 | 0 | 0 | Client |
| property | Property | Link | 1 | 0 | 0 | 0 | Property |
| total_cost | Total Cost | Currency | 0 | 0 | 0 | 0 |  |
| payment_plan_section | Payment Plan | Section Break | 0 | 0 | 0 | 0 |  |
| down_payment_percentage | Down Payment Percentage | Percent | 0 | 0 | 0 | 0 |  |
| column_break_pkch |  | Column Break | 0 | 0 | 0 | 0 |  |
| total_installments | Total Installments | Int | 0 | 0 | 0 | 0 |  |
| installment_interval | Installment Interval | Select | 0 | 0 | 0 | 0 | Monthly, Quarterly, Semi-Annual |
| section_break_oiva |  | Section Break | 0 | 0 | 0 | 0 |  |
| installment_schedule | Installment Schedule | Table | 0 | 0 | 0 | 0 | Installment Schedule Table |
| down_payment_amount | Down Payment Amount | Currency | 0 | 1 | 0 | 0 |  |
| column_break_ijpd |  | Column Break | 0 | 0 | 0 | 0 |  |
| column_break_yast |  | Column Break | 0 | 0 | 0 | 0 |  |
| down_payment_paid | Down Payment Paid | Currency | 0 | 1 | 0 | 0 |  |
| installments_paid_total | Installments Paid Total | Currency | 0 | 1 | 0 | 0 |  |
| total_paid | Total Paid | Currency | 0 | 1 | 0 | 0 |  |
| remaining_balance | Remaining Balance | Currency | 0 | 1 | 0 | 0 |  |
| next_due_date | Next Due Date | Date | 0 | 1 | 0 | 0 |  |
| overdue_amount | Overdue Amount | Currency | 0 | 1 | 0 | 0 |  |
| advance_amount | Advance Amount | Currency | 0 | 1 | 0 | 0 |  |
| amended_from | Amended From | Link | 0 | 1 | 0 | 0 | Booking |
| company | Company | Link | 1 | 0 | 0 | 0 | Property Company |
| discount | Discount | Currency | 0 | 0 | 0 | 0 |  |
| net_total | Net Total | Currency | 0 | 1 | 0 | 0 |  |
| payment_plan_type | Payment Plan Type | Select | 0 | 0 | 0 | 0 | Fixed, Flexible |
| grace_days | Grace Days | Int | 0 | 0 | 0 | 0 |  |
| penalty_rule | Penalty Rule | Data | 0 | 0 | 0 | 0 |  |
| status | Status | Select | 0 | 1 | 0 | 0 | Draft, Submitted, Active, Completed, Cancelled |
| booking_info_section | Booking Info | Section Break | 0 | 0 | 0 | 0 |  |
| payment_mode | Payment Mode | Select | 1 | 0 | 0 | 0 | Full Payment, Installments |
| pricing_section | Pricing | Section Break | 0 | 0 | 0 | 0 |  |
| installment_start | Installment Start | Date | 0 | 0 | 0 | 0 |  |
| schedule_locked | Schedule Locked | Check | 0 | 0 | 1 | 0 |  |
| other_charges_total | Other Charges Total | Currency | 0 | 1 | 0 | 0 |  |
| token_paid_total | Token Paid | Currency | 0 | 1 | 0 | 0 |  |
| advance_paid_total | Advance Paid Total | Currency | 0 | 0 | 0 | 0 |  |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |
| Admin | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |
| Receptionist | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 1 |
| Accounts | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| Cashier | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| Client | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| Sales User | 1 | 1 | 1 | 0 | 1 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: on_cancel, on_submit, validate
- `frappe.throw` lines:
  - `frappe.throw("Property not found at submit time.")`
  - `frappe.throw(f"Property already locked under Booking: {current_booking}")`
  - `frappe.throw("Company is required.")`
  - `frappe.throw("Customer is required.")`
  - `frappe.throw("Property is required.")`
  - `frappe.throw("Booking Date is required.")`
  - `frappe.throw(f"Property '{self.property}' not found.")`
  - `frappe.throw("Property company and Booking company must be the same.")`
  - `frappe.throw(f"Property is already {status} under Booking: {current_booking}")`
  - `frappe.throw("Property reservation has expired. Set it back to Inventory or extend reserved till.")`
  - `frappe.throw(f"Property is Reserved under another Booking: {current_booking}")`
  - `frappe.throw(f"Property is not bookable because current status is '{status}'.")`
  - `frappe.throw("Payment Plan Type is required for Installments.")`
  - `frappe.throw("Total Installments must be greater than 0 for Installments.")`
  - `frappe.throw("Installment Interval is required for Installments.")`
  - `frappe.throw("Discount cannot be greater than Total Cost.")`
  - `frappe.throw("Total Installments must be greater than 0.")`
  - `frappe.throw("Installment total is 0. Reduce down payment or add installments.")`
  - `frappe.throw("Company is required to generate Booking ID.")`
  - `frappe.throw("Company Code is missing in Property Company.")`

## Charge Type

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `False`
- Autoname: `field:charge_type`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| charge_type | Charge Type | Data | 0 | 0 | 0 | 0 |  |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: None detected
- `frappe.throw` lines: none detected

## Client

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `False`
- Autoname: `naming_series:`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| cnic_number | CNIC Number | Data | 1 | 0 | 0 | 1 |  |
| column_break_krre |  | Column Break | 0 | 0 | 0 | 0 |  |
| mobile_number | Mobile Number | Data | 1 | 0 | 0 | 0 | Phone |
| email_address | Email Address | Data | 0 | 0 | 0 | 0 | Email |
| date_of_birth | Date of Birth | Date | 0 | 0 | 0 | 0 |  |
| address | Address | Small Text | 0 | 0 | 0 | 0 |  |
| nominee_details_section | Nominee Details | Section Break | 0 | 0 | 0 | 0 |  |
| nominee_name | Nominee Name | Data | 0 | 0 | 0 | 0 |  |
| column_break_phgp |  | Column Break | 0 | 0 | 0 | 0 |  |
| nominee_cnic | Nominee CNIC | Data | 0 | 0 | 0 | 0 |  |
| nominee_mobile | Nominee Mobile | Data | 0 | 0 | 0 | 0 |  |
| profile_picture | Profile Picture | Attach Image | 0 | 0 | 0 | 0 |  |
| company | Company | Link | 0 | 0 | 0 | 0 | Property Company |
| full_name | Full Name | Data | 0 | 0 | 0 | 0 |  |
| father_name | Father Name | Data | 0 | 0 | 0 | 0 |  |
| cnic_normalized | Cnic Normalized | Data | 0 | 1 | 1 | 0 |  |
| phone_normalized | Phone Normalized | Data | 0 | 1 | 1 | 0 |  |
| reletion_with_nominee | Reletion With Nominee | Select | 0 | 0 | 0 | 0 | Wife, Father, Mother, Son, Doughter, Sister, Brother |
| kyc_status | KYC Status | Select | 0 | 0 | 0 | 0 | Unverified, Verified, Rejected |
| risk_flags | Risk Flags | Small Text | 0 | 0 | 0 | 0 |  |
| section_break_dosb |  | Section Break | 0 | 0 | 0 | 0 |  |
| attachments | Attachments | Table | 0 | 0 | 0 | 0 | Attachments |
| naming_series |  | Data | 0 | 0 | 1 | 0 |  |
| user | User | Link | 0 | 0 | 0 | 0 | User |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |
| Receptionist | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 1 |
| Sales User | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| Accounts | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: after_insert, on_trash, on_update, validate
- `frappe.throw` lines:
  - `frappe.throw("CNIC must be 13 digits (numbers only).", title="Invalid CNIC")`
  - `frappe.throw("Mobile number looks invalid. Please enter a valid phone number.", title="Invalid Mobile")`
  - `frappe.throw(`
  - `frappe.throw(`
  - `frappe.throw("Client DocType must have field `user` (Link to User, unique).")`

## Document Types

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `False`
- Autoname: `field:document_types`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| document_types | Document Types | Data | 0 | 0 | 0 | 0 |  |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: None detected
- `frappe.throw` lines: none detected

## Follow Ups

- Module: `Rshpm System`
- Table DocType: `True`
- Submittable: `False`
- Autoname: `None`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| date | Date | Date | 0 | 0 | 0 | 1 |  |
| remarks | Remarks | Small Text | 0 | 0 | 0 | 1 |  |
| next_action_date | Next Ection Date | Date | 0 | 0 | 0 | 1 |  |

### Permissions

- No explicit permissions in DocType JSON.

### Validation/Logic (Python Controller)

- Hooks: None detected
- `frappe.throw` lines: none detected

## Housing Scheme

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `False`
- Autoname: `format:{project_name}{developer}`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| project_name | Project Name | Data | 0 | 0 | 0 | 0 |  |
| location | Location | Data | 0 | 0 | 0 | 0 |  |
| developer | Developer | Data | 0 | 0 | 0 | 0 |  |
| phase | Phase | Data | 0 | 0 | 0 | 0 |  |
| company | Company | Link | 0 | 0 | 0 | 1 | Company |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: None detected
- `frappe.throw` lines: none detected

## Inquiry

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `False`
- Autoname: `naming_series:`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| company | Company | Link | 0 | 0 | 0 | 0 | Company |
| first_name | First Name | Data | 0 | 0 | 0 | 0 |  |
| last_name | Last Name  | Data | 0 | 0 | 0 | 0 |  |
| full_name | Full Name | Data | 0 | 0 | 0 | 0 |  |
| interested_scheme | Interested Scheme | Link | 0 | 0 | 0 | 0 | Housing Scheme |
| property_type | Property Type | Select | 0 | 0 | 0 | 0 | Plot, House, Shop, Apartment, Other |
| block | Block | Link | 0 | 0 | 0 | 0 | Block |
| client | Client | Link | 0 | 0 | 0 | 0 | Client |
| assigned_to | Assigned To | Link | 0 | 0 | 0 | 0 | User |
| column_break_smsd |  | Column Break | 0 | 0 | 0 | 0 |  |
| phone | Mobile | Data | 0 | 0 | 0 | 0 |  |
| cnic | CNIC | Data | 0 | 0 | 0 | 0 |  |
| address | Address | Small Text | 0 | 0 | 0 | 0 |  |
| budget | Budget  | Data | 0 | 0 | 0 | 0 |  |
| notes | Notes | Small Text | 0 | 0 | 0 | 0 |  |
| status | Status | Select | 0 | 0 | 0 | 0 | New, Contacted, Follow-up, Converted, Closed, Qualified, Lost |
| section_break_qddu |  | Section Break | 0 | 0 | 0 | 0 |  |
| follow_ups | Follow Ups | Table | 0 | 0 | 0 | 0 | Follow Ups |
| section_break_xwxt |  | Section Break | 0 | 0 | 0 | 0 |  |
| cnic_normalized |  | Data | 0 | 1 | 1 | 0 |  |
| phone_normalized |  | Data | 0 | 1 | 1 | 0 |  |
| naming_series |  | Data | 0 | 1 | 1 | 0 |  |
| column_break_rydv |  | Column Break | 0 | 0 | 0 | 0 |  |
| converted_on |  | Datetime | 0 | 1 | 0 | 0 |  |
| converted_by |  | Link | 0 | 1 | 0 | 0 | User |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |
| Receptionist | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 1 |
| Sales User | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| Manager | 1 | 1 | 0 | 1 | 0 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: validate
- `frappe.throw` lines:
  - `frappe.throw("Mobile number looks invalid. Please enter a valid phone number.", title="Invalid Mobile")`
  - `frappe.throw("CNIC must be 13 digits (numbers only).", title="Invalid CNIC")`
  - `frappe.throw("CNIC is required to convert Inquiry to Client.", title="CNIC Required")`

## Installment Schedule Table

- Module: `Rshpm System`
- Table DocType: `True`
- Submittable: `False`
- Autoname: `None`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| installment_name | Installment Name | Data | 0 | 0 | 0 | 1 |  |
| due_amount | Due Amount | Currency | 0 | 0 | 0 | 1 |  |
| status | Status | Select | 0 | 0 | 0 | 1 | Unpaid, Partially Paid, Paid, Overdue |
| column_break_vxsj |  | Column Break | 0 | 0 | 0 | 0 |  |
| due_date | Due Date | Date | 0 | 0 | 0 | 1 |  |
| paid_amount | Paid Amount | Currency | 0 | 0 | 0 | 1 |  |
| last_payment_date | Last Payment Date | Date | 0 | 0 | 0 | 0 |  |

### Permissions

- No explicit permissions in DocType JSON.

### Validation/Logic (Python Controller)

- Hooks: None detected
- `frappe.throw` lines: none detected

## Layout Plan Items

- Module: `Rshpm System`
- Table DocType: `True`
- Submittable: `False`
- Autoname: `None`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| property_no | Property No | Data | 0 | 0 | 0 | 0 |  |
| area | Area | Data | 0 | 0 | 0 | 0 |  |
| type | Type | Data | 0 | 0 | 0 | 0 |  |
| coordinates | Coordinates | Data | 0 | 0 | 0 | 0 |  |

### Permissions

- No explicit permissions in DocType JSON.

### Validation/Logic (Python Controller)

- Hooks: None detected
- `frappe.throw` lines: none detected

## Other Charges Invoice

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `True`
- Autoname: `None`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| section_break_nw5b |  | Section Break | 0 | 0 | 0 | 0 |  |
| amended_from | Amended From | Link | 0 | 1 | 0 | 0 | Other Charges Invoice |
| company | Company | Link | 0 | 1 | 0 | 1 | Property Company |
| column_break_rcsf |  | Column Break | 0 | 0 | 0 | 0 |  |
| booking | Booking | Link | 1 | 0 | 0 | 1 | Booking |
| customer | Customer | Link | 0 | 1 | 0 | 1 | Client |
| property | Property | Link | 0 | 1 | 0 | 1 | Property |
| allocation_method | Allocation Method | Select | 0 | 0 | 0 | 0 | Spread Across Remaining Installments, Add to Next Installment, Create New Installment |
| total_amount | Total Amount | Currency | 0 | 1 | 0 | 1 |  |
| posting_date | Posting Date | Date | 1 | 0 | 0 | 1 |  |
| effective_from | Effective From | Date | 0 | 0 | 0 | 0 |  |
| section_break_wndj |  | Section Break | 0 | 0 | 0 | 0 |  |
| items | Items | Table | 0 | 0 | 0 | 0 | Other Charges Invoice Item |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: on_cancel, on_submit, validate
- `frappe.throw` lines:
  - `frappe.throw("Booking is required.")`
  - `frappe.throw("Please add at least one item.")`
  - `frappe.throw("Item amount must be greater than 0.")`
  - `frappe.throw("Effective From is required when Allocation Method is 'Create New Installment'.")`
  - `frappe.throw("Cannot apply charges because Booking is Cancelled.")`
  - `frappe.throw("Cannot cancel this Other Charges Invoice because the next installment has payments. Ask Manager/Admin.")`
  - `frappe.throw("Cannot cancel because the created installment row cannot be matched safely. Ask Manager/Admin.")`
  - `frappe.throw("Cannot cancel because the created installment already has payment. Ask Manager/Admin.")`

## Other Charges Invoice Item

- Module: `Rshpm System`
- Table DocType: `True`
- Submittable: `False`
- Autoname: `None`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| charge_type | Charge Type | Link | 0 | 0 | 0 | 1 | Charge Type |
| description | Description | Data | 0 | 0 | 0 | 1 |  |
| amount | Amount | Currency | 0 | 0 | 0 | 1 |  |

### Permissions

- No explicit permissions in DocType JSON.

### Validation/Logic (Python Controller)

- Hooks: None detected
- `frappe.throw` lines: none detected

## Ownership Transfer

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `True`
- Autoname: `None`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| property | Property | Link | 1 | 0 | 0 | 1 | Property |
| column_break_ahyj |  | Column Break | 0 | 0 | 0 | 0 |  |
| from_client | From Client | Link | 1 | 0 | 0 | 1 | Client |
| to_client | To Client | Link | 1 | 0 | 0 | 1 | Client |
| transfer_type | Transfer Type | Select | 0 | 0 | 0 | 0 |  |
| transfer_date | Transfer Date | Date | 0 | 0 | 0 | 0 |  |
| transfer_fee | Transfer Fee | Currency | 0 | 0 | 0 | 0 |  |
| remarks | Remarks | Small Text | 0 | 0 | 0 | 0 |  |
| check_list_section | Check List | Section Break | 0 | 0 | 0 | 0 |  |
| original_documents_returned | Original Documents Returned | Check | 0 | 0 | 0 | 0 |  |
| document_return_log | Documents Return Log | Small Text | 0 | 0 | 0 | 0 |  |
| company | Company | Link | 1 | 0 | 0 | 1 | Property Company |
| required_docs | Required Docs | Table | 0 | 0 | 0 | 0 | Attachments |
| amended_from | Amended From | Link | 0 | 1 | 0 | 0 | Ownership Transfer |
| transfer_fee_paid | Transfer Fee Paid | Link | 0 | 0 | 0 | 0 | Payment |
| booking | Booking | Link | 0 | 0 | 0 | 0 | Booking |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: on_cancel, on_submit, validate
- `frappe.throw` lines:
  - `frappe.throw("Property is required.", title="Missing Property")`
  - `frappe.throw("From Client is required.", title="Missing From Client")`
  - `frappe.throw("To Client is required.", title="Missing To Client")`
  - `frappe.throw("From Client and To Client cannot be the same.", title="Invalid Transfer")`
  - `frappe.throw("Invalid Property.", title="Invalid Property")`
  - `frappe.throw(f"Cannot transfer because property is {status}.", title="Not Allowed")`
  - `frappe.throw(`
  - `frappe.throw(`
  - `frappe.throw("Current owner record is missing/corrupted.", title="Missing Ownership")`
  - `frappe.throw("Current owner record is not Active. Fix ownership before transfer.", title="Invalid Ownership")`
  - `frappe.throw(`
  - `frappe.throw("Property has no current owner. Submit Possession first.", title="Missing Ownership")`

## Payment

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `True`
- Autoname: `naming_series:`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| payment_date | Payment Date | Date | 1 | 0 | 0 | 1 |  |
| column_break_yrpn |  | Column Break | 0 | 0 | 0 | 0 |  |
| customer | Customer | Link | 0 | 0 | 0 | 0 | Client |
| property | Property | Link | 0 | 0 | 0 | 0 | Property |
| amount_paid | Amount Paid | Currency | 0 | 0 | 0 | 0 |  |
| receiptinvoice_number | Receipt/Invoice Number | Data | 0 | 0 | 0 | 0 |  |
| payment_mode | Payment Mode | Select | 0 | 0 | 0 | 0 | Cash, Bank, Cheque, Online |
| payment_type | Payment Type | Select | 0 | 0 | 0 | 0 | Token, Down Payment, Installment |
| received_by | Received By | Link | 0 | 0 | 0 | 0 | User |
| booking | Booking | Link | 1 | 0 | 0 | 0 | Booking |
| unallocated_amount | Unallocated Amount | Currency | 0 | 0 | 0 | 0 |  |
| is_advance | Is Advance | Check | 0 | 0 | 0 | 0 |  |
| section_break_tvhw |  | Section Break | 0 | 0 | 0 | 0 |  |
| amended_from | Amended From | Link | 0 | 1 | 0 | 0 | Payment |
| section_break_npgq |  | Section Break | 0 | 0 | 0 | 0 |  |
| payment_allocation | Payment Allocation | Table | 0 | 0 | 0 | 0 | Payment Allocation |
| company | Company | Link | 0 | 0 | 0 | 0 | Property Company |
| approved_by | Approved By | Link | 0 | 0 | 0 | 0 | User |
| reference_no | Reference No | Small Text | 0 | 0 | 0 | 0 |  |
| naming_series |  | Select | 0 | 1 | 1 | 0 | PAY-.YYYY.-.##### |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |
| Cashier | 1 | 1 | 1 | 0 | 1 | 0 | 0 | 1 | 1 |
| Accounts | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| Manager | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| Sales User | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: on_cancel, on_submit, validate
- `frappe.throw` lines:
  - `frappe.throw("Booking is required in Payment.")`
  - `frappe.throw("Booking is required.")`
  - `frappe.throw("Amount Paid must be greater than 0.")`
  - `frappe.throw("Payment Date is required.")`
  - `frappe.throw("Payment company and Booking company must be the same.", title="Company Mismatch")`
  - `frappe.throw("Payment customer must match booking customer.", title="Mismatch")`
  - `frappe.throw("Payment property must match booking property.", title="Mismatch")`
  - `frappe.throw("Please submit the Booking first. Payments are allowed only after Booking submission.")`
  - `frappe.throw("Booking must be submitted to cancel payments safely.")`
  - `# 			frappe.throw("Booking is required.")`
  - `# 			frappe.throw("Amount Paid must be greater than 0.")`
  - `# 			frappe.throw("Payment Date is required.")`
  - `# 			frappe.throw("Payment company and Booking company must be the same.", title="Company Mismatch")`
  - `# 			frappe.throw("Payment customer must match booking customer.", title="Mismatch")`
  - `# 			frappe.throw("Payment property must match booking property.", title="Mismatch")`
  - `# 	    	frappe.throw("Please submit the Booking first. Payments are allowed only after Booking submission.")`

## Payment Allocation

- Module: `Rshpm System`
- Table DocType: `True`
- Submittable: `False`
- Autoname: `None`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| installment_name | Installment Name | Data | 0 | 0 | 0 | 1 |  |
| allocated_amount | Allocated Amount | Currency | 0 | 0 | 0 | 1 |  |
| allocated_date | Allocated Date | Date | 0 | 0 | 0 | 1 |  |
| note | Note | Small Text | 0 | 0 | 0 | 0 |  |
| attachments_typ | Attachments | Select | 0 | 0 | 0 | 1 | Deposit Slip, Screenshot, Receipt Scan |
| attach_image | Attach Image | Attach Image | 0 | 0 | 0 | 0 |  |
| attach_file | Attach File | Attach | 0 | 0 | 0 | 1 |  |
| column_break_xfwa |  | Column Break | 0 | 0 | 0 | 0 |  |
| schedule_row_name | Schedule Row ID | Data | 0 | 1 | 1 | 0 |  |
| due_date | Due Date | Date | 0 | 0 | 0 | 1 |  |
| installment_no | Installment No | Int | 0 | 0 | 0 | 0 |  |
| payment | Payment | Link | 0 | 0 | 0 | 1 | Payment |

### Permissions

- No explicit permissions in DocType JSON.

### Validation/Logic (Python Controller)

- Hooks: None detected
- `frappe.throw` lines: none detected

## Possession

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `False`
- Autoname: `naming_series:`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| possession_date | Possession Date | Date | 1 | 0 | 0 | 1 |  |
| notes | Notes | Small Text | 0 | 0 | 0 | 0 |  |
| final_clearance_check | Final Clearance Check | Check | 0 | 0 | 0 | 0 |  |
| company | Company | Link | 0 | 0 | 0 | 0 | Company |
| naming_series |  | Select | 0 | 0 | 1 | 0 | POS-.YYYY.-.##### |
| booking | Booking | Link | 0 | 0 | 0 | 0 | Booking |
| property | Property | Link | 0 | 0 | 0 | 0 | Property |
| client | Client | Link | 0 | 0 | 0 | 0 | Property |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: on_cancel, on_submit, validate
- `frappe.throw` lines:
  - `frappe.throw("Booking is required.", title="Missing Booking")`
  - `frappe.throw("Invalid Booking.", title="Invalid Booking")`
  - `frappe.throw("Booking must be submitted before Possession.", title="Booking Not Submitted")`
  - `frappe.throw("Company mismatch between Booking and Possession.", title="Company Mismatch")`
  - `frappe.throw(`
  - `frappe.throw("Final Clearance Check must be checked before submitting Possession.", title="Clearance Required")`
  - `frappe.throw("Remaining balance exists. Clear all dues before possession.", title="Payment Pending")`
  - `frappe.throw("Cannot cancel possession after transfer.", title="Not Allowed")`

## Property

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `False`
- Autoname: `naming_series:`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| property_info_section | Property Info | Section Break | 0 | 0 | 0 | 0 |  |
| plot_number | Plot Number | Data | 1 | 0 | 0 | 1 |  |
| total_cost | Total Cost | Currency | 1 | 0 | 0 | 1 |  |
| column_break_knie |  | Column Break | 0 | 0 | 0 | 0 |  |
| block | Block | Link | 1 | 0 | 0 | 0 | Block |
| status | Status | Select | 0 | 0 | 0 | 0 | Inventory, Reserved, Booked, Allotted, Possession, Transferred, Cancelled, Blocked |
| unique_id | Unique ID | Data | 0 | 1 | 1 | 0 |  |
| section_break_sktf |  | Section Break | 0 | 0 | 0 | 0 |  |
| location | Location | Geolocation | 0 | 0 | 0 | 0 |  |
| qr_code | QR Code | Attach Image | 0 | 1 | 0 | 0 |  |
| property_type | Property Type | Select | 0 | 0 | 0 | 0 | Residential, Commercial, Plot |
| section_break_kjiu |  | Section Break | 0 | 0 | 0 | 0 |  |
| description | Description | Text Editor | 0 | 0 | 0 | 0 |  |
| section_break_dohw |  | Section Break | 0 | 0 | 0 | 0 |  |
| amenities | Amenities | Table | 0 | 0 | 0 | 0 | Property Amenity |
| property_price_history | Property Price History | Table | 0 | 0 | 0 | 0 | Property Price History |
| reserved_till | Reserved Till | Datetime | 0 | 0 | 0 | 0 |  |
| current_booking | Current Booking | Link | 0 | 0 | 0 | 0 | Booking |
| booked_by | Booked By | Data | 0 | 0 | 0 | 0 |  |
| current_owner | Current Owner | Link | 0 | 0 | 0 | 0 | Property Ownership |
| is_owner_locked | Is Owner Locked | Check | 0 | 0 | 0 | 0 |  |
| area_text | Area | Float | 1 | 0 | 0 | 1 |  |
| area_unit | Area Unit | Select | 1 | 0 | 0 | 1 | Kanal, Marla, Sqyd, Sqft |
| company | Company | Link | 0 | 0 | 0 | 1 | Property Company |
| unit_type | Unit Type | Link | 1 | 0 | 0 | 1 | Property Unit Type |
| area_value | Area (Sqft) | Float | 0 | 1 | 0 | 1 |  |
| housing_scheme | Housing Scheme | Link | 1 | 0 | 0 | 0 | Housing Scheme |
| naming_series | Naming Series | Select | 0 | 0 | 1 | 0 | PROP-.YYYY.-.##### |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |
| Admin | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |
| Sales User | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| Client | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| Manager | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: validate
- `frappe.throw` lines:
  - `frappe.throw(`
  - `frappe.throw(`
  - `frappe.throw(`
  - `frappe.throw(`
  - `frappe.throw(`
  - `frappe.throw(`

## Property Amenity

- Module: `Rshpm System`
- Table DocType: `True`
- Submittable: `False`
- Autoname: `None`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| amenity | Amenity | Link | 0 | 0 | 0 | 1 | Amenity |
| value | Value | Data | 0 | 0 | 0 | 1 |  |
| notes | Notes | Small Text | 0 | 0 | 0 | 1 |  |
| included | Included | Check | 0 | 0 | 0 | 1 |  |
| extra_cost | Extra Cost | Currency | 0 | 0 | 0 | 1 |  |

### Permissions

- No explicit permissions in DocType JSON.

### Validation/Logic (Python Controller)

- Hooks: None detected
- `frappe.throw` lines: none detected

## Property Company

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `False`
- Autoname: `field:company_name`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| company_name | Company Name | Data | 0 | 0 | 0 | 1 |  |
| legal_name | Legal Name | Data | 0 | 0 | 0 | 1 |  |
| logo | Logo | Attach Image | 0 | 0 | 0 | 0 |  |
| address | Address | Data | 0 | 0 | 0 | 0 |  |
| is_active | Is Active | Check | 0 | 0 | 0 | 0 |  |
| section_break_oflx |  | Section Break | 0 | 0 | 0 | 0 |  |
| column_break_wcwh |  | Column Break | 0 | 0 | 0 | 0 |  |
| phone | Phone | Phone | 0 | 0 | 0 | 0 |  |
| email | Email | Data | 0 | 0 | 0 | 0 |  |
| tax_id | Tax Id | Data | 0 | 0 | 0 | 0 |  |
| default_currency | Default Currency | Data | 0 | 0 | 0 | 0 |  |
| company_code | Company Code | Data | 1 | 0 | 0 | 0 |  |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: validate
- `frappe.throw` lines:
  - `frappe.throw("Company Name is required to generate Company Code.")`

## Property Ownership

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `False`
- Autoname: `None`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| section_break_vrys |  | Section Break | 0 | 0 | 0 | 0 |  |
| amended_from | Amended From | Link | 0 | 1 | 0 | 0 | Property Ownership |
| property | Property | Link | 1 | 0 | 0 | 1 | Property |
| ownership_start_date | Ownership Start Date | Date | 0 | 0 | 0 | 0 |  |
| column_break_qirl |  | Column Break | 0 | 0 | 0 | 0 |  |
| owner_client | Owner Client | Link | 0 | 0 | 0 | 0 | Client |
| ownership_status | Ownership Status | Select | 0 | 0 | 0 | 0 |  |
| ownership_end_date | Ownership End Date | Date | 0 | 0 | 0 | 0 |  |
| booking | Booking | Link | 0 | 0 | 0 | 0 | Booking |
| remarks | Remarks | Small Text | 0 | 0 | 0 | 0 |  |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: validate
- `frappe.throw` lines:
  - `frappe.throw("Property is required.", title="Missing Property")`
  - `frappe.throw(f"Ownership already exists for this Property: {existing}", title="Duplicate Ownership")`
  - `frappe.throw("Ownership Status must be Active or Closed.", title="Invalid Ownership Status")`

## Property Price History

- Module: `Rshpm System`
- Table DocType: `True`
- Submittable: `False`
- Autoname: `None`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| base_price | Base Price | Currency | 0 | 0 | 0 | 1 |  |
| discount | Discount | Currency | 0 | 0 | 0 | 1 |  |
| final_price | Final Price | Currency | 0 | 0 | 0 | 1 |  |

### Permissions

- No explicit permissions in DocType JSON.

### Validation/Logic (Python Controller)

- Hooks: None detected
- `frappe.throw` lines: none detected

## Property Unit Type

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `False`
- Autoname: `field:code`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| unit_type_name | Unit Type Name | Data | 0 | 0 | 0 | 0 |  |
| column_break_omdq |  | Column Break | 0 | 0 | 0 | 0 |  |
| code | Code | Data | 0 | 0 | 0 | 0 |  |
| is_active | Active | Check | 0 | 0 | 0 | 0 |  |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: None detected
- `frappe.throw` lines: none detected

## Watchlist

- Module: `Rshpm System`
- Table DocType: `False`
- Submittable: `False`
- Autoname: `None`

### Fields

| Fieldname | Label | Type | Reqd | RO | Hidden | List | Options |
|---|---|---:|---:|---:|---:|---:|---|
| company | Company | Link | 0 | 0 | 0 | 0 | Company |
| cnic_normalized | CNIC Normalized | Data | 0 | 0 | 0 | 0 |  |
| phone_normalized | Phone Normalized | Data | 0 | 0 | 0 | 0 |  |
| reason | Reason | Data | 0 | 0 | 0 | 0 |  |
| flagged_by | Flagged By | Data | 0 | 0 | 0 | 0 |  |
| active | Active | Check | 0 | 0 | 0 | 0 | Company |

### Permissions

| Role | R | W | C | D | Submit | Cancel | Amend | Report | Export |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| System Manager | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |

### Validation/Logic (Python Controller)

- Hooks: None detected
- `frappe.throw` lines: none detected
