# Wedding Site Specs

This folder captures the next documentation layer for the wedding site after the CLI-first scaffold.

The current app is intentionally minimal. These specs define what future documentation should cover before UI polish, backend endpoints, or admin dashboards are built.

## Spec Index

- [Product and Content Spec](./product-and-content.md)
- [Data and Auth Spec](./data-and-auth.md)
- [Admin Workflow Spec](./admin-workflows.md)
- [Backend API Spec](./backend-api.md)
- [Deployment and Operations Spec](./deployment-and-operations.md)
- [Security Spec](./security.md)

## Current Baseline

- Frontend: Vite, React, TypeScript, React Router.
- Database: Supabase `public.users` table with RLS.
- Auth: Supabase Auth from the frontend.
- Admin workflows: local trusted CLI scripts using the service role key.
- Backend: placeholder only.

## Documentation Rules

- Keep implementation docs accurate to the current scaffold.
- Do not document invite-code RSVP as client-side direct table reads.
- Treat service role operations as trusted local/server-only workflows.
- Keep UI copy/content specs separate from future visual design work.
