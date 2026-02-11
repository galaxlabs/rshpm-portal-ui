# RSHPM Portal UI (Clean Build)

React + Vite frontend for Frappe with:

- Categorized sidebar navigation for all DocTypes.
- Complete CRUD operations (`list`, `create`, `edit`, `delete`) using `/api/resource`.
- Dashboard + Analytics views (Recharts).
- Print Center:
  - Open default Frappe print view.
  - Open browser print dialog (`trigger_print=1`).
  - Load HTML print preview from Frappe print API.
- Backend validation surface: server-side Frappe errors are shown in the UI during save operations.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

## Environment

```env
VITE_FRAPPE_BASE_URL=https://dev.galaxylabs.online
VITE_FRAPPE_API_PREFIX=/api
VITE_AUTH_MODE=session
```

Optional token mode (for local proxy/header auth):

```env
VITE_AUTH_MODE=token
FRAPPE_API_KEY=your_api_key
FRAPPE_API_SECRET=your_api_secret
```

## Routes

- `/` Dashboard
- `/analytics` Analytics charts
- `/print-center` Print Center
- `/d/:slug` CRUD page for each DocType
- `/login` Login page

## Metadata refresh

```bash
npm run meta:extract
```
