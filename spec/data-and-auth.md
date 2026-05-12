# Data and Auth Spec

## Goal

Document how Supabase Auth and wedding guest data relate, and define the safe path for future RSVP/auth work.

## Data Model

`auth.users` remains Supabase-managed identity.

`public.users` stores wedding app data:

- guest identity and contact information
- invite metadata
- RSVP status
- meal and dietary notes
- table assignment
- app role
- admin notes

`public.users.auth_user_id` is nullable because invited guests may never create accounts.

## RSVP Semantics

`rsvp` is a nullable boolean:

- `null`: no response yet
- `true`: attending
- `false`: not attending

`rsvp_submitted_at` should be set when RSVP becomes `true` or `false`, and cleared when RSVP is reset to `null`.

## Auth Semantics

- Email/password and Google auth are frontend helpers only.
- Passwords are never stored in `public.users`.
- User registration should not be treated as guest verification.
- Linking an auth identity to a wedding guest row should happen through a trusted admin/server flow.

## RLS Requirements

- RLS stays enabled on `public.users`.
- Authenticated users may read their own linked row.
- Authenticated users may update their own row, but role/admin/invite/table fields are protected by trigger.
- Admin/couple/planner access is determined by `public.is_admin_user()`.
- Anonymous invite-code reads are not allowed.

## Future Work

- Add a secure invite-code lookup endpoint, Edge Function, or RPC.
- Define a safe subset of fields returned to invite-code guests.
- Add generated Supabase TypeScript types once the schema stabilizes.
- Add migration files if the project moves from SQL snapshots to Supabase CLI migrations.
