create table public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  address text not null,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  created_at timestamptz not null default now()
);

alter table public.venues enable row level security;

create policy "Venues are publicly readable"
on public.venues for select to anon, authenticated
using (true);

grant select on public.venues to anon, authenticated;
revoke insert, update, delete on public.venues from anon, authenticated;
