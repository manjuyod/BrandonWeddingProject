# Backend API Spec

## Goal

Define future backend responsibilities without adding backend runtime code to the MVP scaffold.

## Current State

The MVP uses:

- Supabase directly from the frontend with RLS.
- CLI scripts for trusted admin operations.
- `backend/` as a placeholder only.

## Required Future Backend Responsibilities

- Secure invite-code RSVP lookup.
- RSVP submission without broad anonymous table access.
- Admin CSV exports through a web dashboard.
- Email invitation sending.
- Service-role operations.
- Webhook handling.
- Private server-side actions.

## Invite-Code RSVP Endpoint

The future invite-code flow should:

- accept an invite code
- validate it server-side
- return only safe guest-facing fields
- allow RSVP mutation for the matching invite only
- avoid exposing `admin_notes`, broad guest lists, roles, or table assignment unless intentionally public

## Admin Endpoints

Admin endpoints should:

- require authenticated admin/couple/planner authorization
- use service-role credentials only server-side
- validate request bodies before writes
- keep response payloads narrow
- avoid leaking service-role errors directly to users

## Implementation Options

- Supabase Edge Functions.
- A small Node backend.
- Server-side actions in a future framework if the app stack changes.

## Non-Goals

- Next.js migration for the MVP.
- Household normalization.
- Payment or gift processing.
- Public anonymous `public.users` reads.
