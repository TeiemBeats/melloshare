-- Paste into Supabase SQL Editor and run once.
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null check (char_length(display_name) between 2 and 80),
 role text not null check (role in ('artist','listener','advertiser')),
 created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "Members read own profile" on public.profiles;
create policy "Members read own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create or replace function public.create_meloshare_profile()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare chosen_role text; chosen_name text;
begin
 chosen_role := coalesce(new.raw_user_meta_data ->> 'role', 'listener');
 if chosen_role not in ('artist','listener','advertiser') then chosen_role := 'listener'; end if;
 chosen_name := left(trim(coalesce(new.raw_user_meta_data ->> 'display_name','')),80);
 if char_length(chosen_name) < 2 then chosen_name := 'Meloshare member'; end if;
 insert into public.profiles(id,display_name,role) values(new.id,chosen_name,chosen_role);
 return new;
end; $$;
drop trigger if exists on_meloshare_user_created on auth.users;
create trigger on_meloshare_user_created after insert on auth.users
for each row execute function public.create_meloshare_profile();
