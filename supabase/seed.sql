insert into public.venues (id, name, category, address, latitude, longitude)
values (
  '5f45f7be-0f0b-4bb1-83f2-56e67bf48231',
  'McGill University',
  'campus',
  '845 Sherbrooke St W, Montreal, QC',
  45.5048,
  -73.5772
)
on conflict (id) do nothing;
