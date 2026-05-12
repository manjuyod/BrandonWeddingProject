# Admin Workflow Spec

## Goal

Define the trusted admin workflows currently handled by CLI scripts and the expected future dashboard equivalents.

## CLI-First Baseline

All admin scripts:

- run with `tsx`
- load `.env` using `dotenv`
- use `SUPABASE_SERVICE_ROLE_KEY`
- run only in trusted local/server environments
- must never be imported by frontend code

## Guest List Management

Current command:

```bash
npm run users:list
```

Required filters:

- pending RSVP
- attending
- declined
- children

The output should remain readable for quick terminal use.

## Guest Creation

Current command:

```bash
npm run users:create -- --first "Jane" --last "Doe"
```

Required fields:

- first name
- last name

Optional fields should map directly to `public.users` columns where possible.

## RSVP Updates

Current command:

```bash
npm run users:rsvp -- --email "jane@example.com" --yes
```

Each update must identify exactly one user by `id`, `email`, or `invite_code`, and exactly one action: yes, no, or clear.

## Table Assignment

Current command:

```bash
npm run users:table -- --invite-code "JANE-DOE" --table 5
```

Table assignment is admin-only and should not be guest-editable.

## CSV Export

Current command:

```bash
npm run users:export
```

Exports are generated under `exports/` and must not be committed.

## Future Dashboard Requirements

- Dashboard operations should use backend/service-role actions, not direct frontend service-role access.
- CSV export should remain available from CLI even after dashboard support exists.
- Dashboard user edits should share validation rules with CLI scripts.
- Audit logging should be considered before real guest data is loaded.
