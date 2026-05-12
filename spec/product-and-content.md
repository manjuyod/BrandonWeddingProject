# Product and Content Spec

## Goal

Define the public wedding site information architecture and content requirements before a UI/UX pass.

## Public Routes

- `/`: landing page with couple names, wedding date, location summary, and RSVP entry point.
- `/details`: ceremony/reception timing, dress code, parking, accessibility, and contact notes.
- `/travel`: hotel blocks, airport guidance, transportation, local recommendations, and timing notes.
- `/registry`: registry links and gifting copy.
- `/rsvp`: invite-code entry and RSVP flow once a secure backend path exists.
- `/login`: authenticated guest/admin sign-in.
- `/register`: scaffold-only registration until invite-gated registration is designed.

## Admin Routes

- `/admin`: admin landing page for operational status.
- `/admin/users`: future user/guest list view.

## Content Requirements

- Keep source-of-truth guest details in `public.users`, not hard-coded page content.
- Avoid publishing private details until the access model is defined.
- Write content in plain language that works without a visual design system.
- Keep placeholders clearly marked until real wedding details are provided.

## Out Of Scope

- Final visual design.
- Photo galleries.
- Music/media uploads.
- Public guest directory.
- Household/group RSVP modeling.
