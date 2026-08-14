-- Run this once in your Supabase project's SQL Editor (Supabase dashboard > SQL Editor > New query)

create table if not exists store_data (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

alter table store_data enable row level security;

-- Anyone visiting your site can READ the catalog (needed so buyers see listings).
create policy "public read" on store_data
  for select using (true);

-- Only a signed-in user (you) can add, edit, or delete listings.
create policy "authenticated write" on store_data
  for insert to authenticated with check (true);

create policy "authenticated update" on store_data
  for update to authenticated using (true);

create policy "authenticated delete" on store_data
  for delete to authenticated using (true);
