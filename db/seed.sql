insert into public.users (
  first_name,
  last_name,
  email,
  guest_of,
  guest_tag,
  invited,
  is_child,
  invite_code,
  rsvp,
  table_number,
  role,
  notes
)
values
  ('Brandon', 'Admin', 'admin@example.com', 'Couple', 'admin', true, false, 'ADMIN-DEMO', true, null, 'admin', 'Demo admin row. Link auth_user_id manually after signup.'),
  ('Jane', 'Guest', 'jane@example.com', 'Bride', 'family', true, false, 'JANE-DEMO', null, null, 'guest', 'Demo guest.'),
  ('Timmy', 'Guest', null, 'Bride', 'family', true, true, 'TIMMY-DEMO', null, null, 'guest', 'Demo child guest.')
on conflict do nothing;
