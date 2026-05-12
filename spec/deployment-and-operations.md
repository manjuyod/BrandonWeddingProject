# Deployment and Operations Spec

## Goal

Define the operational documentation needed to deploy and maintain the wedding site.

## Build Output

Build command:

```bash
npm run build
```

Output folder:

```text
dist/
```

`dist/` must not be committed.

## Intended Hosting

Initial target:

- AWS Lightsail
- Nginx
- static `dist/` hosting
- SPA fallback to `index.html`

Nginx fallback:

```nginx
location / {
  try_files $uri /index.html;
}
```

## Environment Management

Frontend hosting needs:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Trusted admin/server environments additionally need:

- `SUPABASE_SERVICE_ROLE_KEY`

Do not place the service role key in public hosting dashboards unless it is required for trusted server-side scripts only.

## Release Checklist

- Run `npm run build`.
- Run `npm run lint`.
- Run `npm run format:check`.
- Confirm `.env` and generated exports are not staged.
- Confirm Supabase migrations have been applied to the intended project.
- Confirm RLS advisors have no critical issues.

## Monitoring And Recovery

Future operations docs should cover:

- where logs live
- how to rotate Supabase keys
- how to export and back up guest data
- how to restore from CSV/database backup
- who can run service-role scripts
