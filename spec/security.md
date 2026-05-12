# Security Spec

## Goal

Define the security model for the CLI-first wedding site scaffold and identify the decisions required before public launch.

## Current Security Model

- Supabase Auth handles identity.
- `public.users` stores wedding application data.
- RLS is enabled on `public.users`.
- CLI scripts use the service role key only outside frontend code.
- Anonymous invite-code table reads are intentionally not implemented.

## Secret Handling

- `.env`, `.env.local`, and `.env*` local copies are ignored.
- `.env.example` is tracked and contains placeholders only.
- `SUPABASE_SERVICE_ROLE_KEY` must never be referenced under `src/`.
- Service-role scripts must only run locally or in trusted server/admin environments.

## RLS Requirements

- Users can read only their own linked row.
- Guest-owned updates must not modify role, admin notes, invite metadata, or table assignment.
- Admin/couple/planner access is role-gated.
- Future invite-code RSVP must go through backend, Edge Function, or secure RPC.

## Known Advisor Notes

The initial migration may produce non-blocking Supabase advisor notes:

- `is_admin_user()` is executable by authenticated users because policies use it.
- New indexes may be reported as unused until real queries run.
- Separate own/admin select and update policies may be reported as multiple permissive policies.

These should be reviewed before public launch, but they are acceptable for the CLI-first scaffold if no critical RLS issue is present.

## Launch Blockers

- Open self-registration without invite gating.
- Any service role key exposure in frontend hosting.
- Anonymous broad read access to `public.users`.
- Invite-code RSVP implemented as direct client table access.
- Real guest data loaded before backup/export procedure is documented.

## Future Hardening

- Add backend audit logs for admin writes.
- Add rate limiting for invite-code lookup.
- Add generated database types and narrower response DTOs.
- Add a guest-safe view or RPC for RSVP-only data.
- Review Supabase advisors after every migration.
