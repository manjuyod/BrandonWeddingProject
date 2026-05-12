# Nicole and Brandon Wedding Site

CLI-first MVP scaffold for a future wedding website. The app is intentionally minimal: placeholder React routes, Supabase Auth wiring, a consolidated `public.users` table, SQL files, and local admin scripts.

## Why CLI-first

Admin workflows start as trusted local/server commands instead of polished dashboard UI. This keeps guest data management, RSVP updates, table assignment, and CSV export repeatable while the visual experience is deferred.

## Stack

- Vite, React, TypeScript
- React Router
- Supabase Auth and Postgres
- Tailwind CSS, minimal only
- Node CLI scripts with `tsx` and `dotenv`
- ESLint and Prettier

## Setup

```bash
npm install
cp .env.example .env
npm run check:env
npm run dev
```

Fill `.env` with values from Supabase:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are frontend-safe. `SUPABASE_SERVICE_ROLE_KEY` is server-side only and must never be exposed in frontend code.

## Supabase Setup

Run SQL in this order:

1. `db/schema.sql`
2. `db/policies.sql`
3. Optional: `db/seed.sql`

`auth.users` remains Supabase-managed identity. `public.users` stores wedding app data and links to auth with nullable `auth_user_id` because some guests may never create accounts.

## Specs

The next documentation layer lives in `spec/`:

- `spec/product-and-content.md`
- `spec/data-and-auth.md`
- `spec/admin-workflows.md`
- `spec/backend-api.md`
- `spec/deployment-and-operations.md`
- `spec/security.md`

## App Commands

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format:check
```

Routes currently exist as placeholders for `/`, `/details`, `/travel`, `/registry`, `/rsvp`, `/login`, `/register`, `/admin`, `/admin/users`, and `*`.

## CLI Commands

```bash
npm run users:list
npm run users:list -- --pending
npm run users:create -- --first "Jane" --last "Doe" --email "jane@example.com" --guest-of "Bride" --tag "family" --invite-code "JANE-DOE"
npm run users:rsvp -- --email "jane@example.com" --yes
npm run users:table -- --invite-code "JANE-DOE" --table 5
npm run users:export
npm run users:export -- --out exports/users.csv --attending
```

These scripts use `SUPABASE_SERVICE_ROLE_KEY` and should only run locally or in trusted server/admin environments.

## Deployment Notes

Build output:

```bash
npm run build
```

The generated output folder is `dist/`. The intended deployment target is AWS Lightsail with Nginx serving `dist/`.

SPA fallback:

```nginx
location / {
  try_files $uri /index.html;
}
```

Do not commit `dist/`.

## Security Notes

- RLS is enabled on `public.users`.
- Do not expose the service role key.
- `auth.users` handles auth identity.
- `public.users` stores wedding app data.
- `public.users.rsvp` is a nullable boolean: `null` pending, `true` attending, `false` not attending.
- `public.users.table_number` is a nullable integer.
- Guests should not receive broad anonymous read access to the users table.
- Guest-owned row updates are restricted from changing admin, role, invite, and table-assignment fields.
- Future invite-code RSVP should happen through a backend endpoint, Supabase Edge Function, or secure RPC that only returns safe fields.
