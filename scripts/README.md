# CLI Scripts

These TypeScript scripts run with `tsx`, load `.env` with `dotenv`, and use the Supabase service role key. Run them only locally or in trusted server/admin environments.

## Required Environment Variables

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Check them with:

```bash
npm run check:env
```

## List Users

```bash
npm run users:list
npm run users:list -- --pending
npm run users:list -- --attending
npm run users:list -- --declined
npm run users:list -- --children
```

Output columns: `Name | Email | RSVP | Child | Table | Tag | Role`.

## Create A User

```bash
npm run users:create -- \
  --first "Jane" \
  --last "Doe" \
  --email "jane@example.com" \
  --phone "555-555-5555" \
  --guest-of "Bride" \
  --tag "family" \
  --child false \
  --invite-code "JANE-DOE"
```

`--first` and `--last` are required. Optional flags include address fields, `--plus-one`, `--plus-one-allowed`, `--invited`, `--role`, `--notes`, and `--admin-notes`.

## Update RSVP

```bash
npm run users:rsvp -- --email "jane@example.com" --yes
npm run users:rsvp -- --invite-code "JANE-DOE" --no
npm run users:rsvp -- --id "1" --clear
```

Use exactly one identifier: `--id`, `--email`, or `--invite-code`. Use exactly one action: `--yes`, `--no`, or `--clear`.

## Assign A Table

```bash
npm run users:table -- --email "jane@example.com" --table 5
npm run users:table -- --invite-code "JANE-DOE" --table 5
npm run users:table -- --id "1" --clear
```

Use exactly one identifier and exactly one table action.

## Export Users

```bash
npm run users:export
npm run users:export -- --out exports/users.csv
npm run users:export -- --attending
npm run users:export -- --pending
npm run users:export -- --declined
```

Default output path is `exports/users.csv`. The script creates `exports/` if needed, and generated CSV files are not committed.
