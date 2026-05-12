
-- Lock down SECURITY DEFINER helpers
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.has_role(uuid, public.app_role) from public, anon;
-- has_role is needed inside RLS policies, which run as the table owner; authenticated callers
-- don't need to call it directly, but RLS still works because policies execute it server-side.
revoke execute on function public.has_role(uuid, public.app_role) from authenticated;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

-- Ensure touch_updated_at has fixed search_path
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin new.updated_at = now(); return new; end;
$$;
