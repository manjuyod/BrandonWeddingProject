alter table public.users enable row level security;

create or replace function public.is_admin_user()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where auth_user_id = auth.uid()
      and role in ('admin', 'couple', 'planner')
  );
$$;

revoke all on function public.is_admin_user() from public;
revoke all on function public.is_admin_user() from anon;
grant execute on function public.is_admin_user() to authenticated;

create or replace function public.prevent_guest_restricted_user_updates()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null
    and old.auth_user_id = auth.uid()
    and not public.is_admin_user()
  then
    if new.auth_user_id is distinct from old.auth_user_id
      or new.guest_of is distinct from old.guest_of
      or new.guest_tag is distinct from old.guest_tag
      or new.invited is distinct from old.invited
      or new.is_child is distinct from old.is_child
      or new.is_plus_one is distinct from old.is_plus_one
      or new.plus_one_allowed is distinct from old.plus_one_allowed
      or new.invite_code is distinct from old.invite_code
      or new.table_number is distinct from old.table_number
      or new.role is distinct from old.role
      or new.notes is distinct from old.notes
      or new.admin_notes is distinct from old.admin_notes
      or new.created_at is distinct from old.created_at
    then
      raise exception 'Guests cannot update restricted user fields.';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.prevent_guest_restricted_user_updates() from public;
revoke all on function public.prevent_guest_restricted_user_updates() from anon;
revoke all on function public.prevent_guest_restricted_user_updates() from authenticated;

drop trigger if exists prevent_guest_restricted_user_updates on public.users;
create trigger prevent_guest_restricted_user_updates
before update on public.users
for each row
execute function public.prevent_guest_restricted_user_updates();

drop policy if exists "Users can read own row" on public.users;
create policy "Users can read own row"
on public.users
for select
to authenticated
using (auth_user_id = auth.uid());

drop policy if exists "Users can update own row" on public.users;
create policy "Users can update own row"
on public.users
for update
to authenticated
using (auth_user_id = auth.uid())
with check (auth_user_id = auth.uid());

drop policy if exists "Admins can read all users" on public.users;
create policy "Admins can read all users"
on public.users
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Admins can insert users" on public.users;
create policy "Admins can insert users"
on public.users
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admins can update all users" on public.users;
create policy "Admins can update all users"
on public.users
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admins can delete users" on public.users;
create policy "Admins can delete users"
on public.users
for delete
to authenticated
using (public.is_admin_user());
