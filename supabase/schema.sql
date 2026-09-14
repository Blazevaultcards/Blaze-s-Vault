-- Blaze's Vault Cards — Supabase schema
-- Run this in Supabase Dashboard -> SQL Editor -> New Query -> Run.

-- ========== profiles ==========
-- One row per signed-up user. role decides customer vs admin access.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create a profile row (role='customer') whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper used by policies below to check "is the current user an admin".
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ========== cards (inventory) ==========
create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  game text not null check (game in ('pokemon', 'yugioh', 'onepiece', 'riftbound')),
  category text not null check (category in ('singles', 'sealed', 'graded')),
  name text not null,
  set_name text not null,
  rarity text,
  price numeric(10,2) not null default 0,
  condition text not null default 'Near Mint',
  image_url text,
  badge text,
  badge_color text,
  foil boolean not null default false,
  stock int not null default 0,
  description text,
  created_at timestamptz not null default now()
);

alter table public.cards enable row level security;

-- Anyone (including signed-out visitors) can browse the catalog.
create policy "Cards are publicly viewable"
  on public.cards for select
  using (true);

-- Only admins can add, edit, or remove listings.
create policy "Only admins can insert cards"
  on public.cards for insert
  with check (public.is_admin());

create policy "Only admins can update cards"
  on public.cards for update
  using (public.is_admin());

create policy "Only admins can delete cards"
  on public.cards for delete
  using (public.is_admin());

-- ========== orders ==========
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  total numeric(10,2) not null default 0,
  stripe_session_id text,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id or public.is_admin());

-- Orders are only ever written by the backend (Stripe webhook) using the
-- service role key, which bypasses RLS entirely — no insert/update policy
-- is needed for regular users.

-- ========== order_items ==========
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  card_id uuid references public.cards(id),
  quantity int not null default 1,
  price numeric(10,2) not null default 0
);

alter table public.order_items enable row level security;

create policy "Users can view items on their own orders"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
    )
  );

-- ========== sell_submissions (the "Sell Your Cards" form) ==========
create table if not exists public.sell_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  details text not null,
  created_at timestamptz not null default now()
);

alter table public.sell_submissions enable row level security;

create policy "Anyone can submit a sell request"
  on public.sell_submissions for insert
  with check (true);

create policy "Only admins can view sell requests"
  on public.sell_submissions for select
  using (public.is_admin());

-- ========== storage bucket for card images ==========
insert into storage.buckets (id, name, public)
values ('card-images', 'card-images', true)
on conflict (id) do nothing;

create policy "Card images are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'card-images');

create policy "Only admins can upload card images"
  on storage.objects for insert
  with check (bucket_id = 'card-images' and public.is_admin());

create policy "Only admins can update card images"
  on storage.objects for update
  using (bucket_id = 'card-images' and public.is_admin());

create policy "Only admins can delete card images"
  on storage.objects for delete
  using (bucket_id = 'card-images' and public.is_admin());

-- ========== after running this file ==========
-- 1. Sign up for a normal account on your live site (this makes you a 'customer').
-- 2. Come back here and run, with YOUR email:
--      update public.profiles set role = 'admin' where email = 'you@example.com';
-- 3. That account can now see the "Admin" nav link and manage cards/orders.

-- ========== optional: seed a few sample cards ==========
insert into public.cards (game, category, name, set_name, rarity, price, condition, image_url, badge, badge_color, foil, stock, description)
values
  ('pokemon', 'singles', 'Charizard ex', 'Obsidian Flames', 'Special Illustration Rare', 189.99, 'Near Mint', 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&h=1120&fit=crop&auto=format', 'HOT', '#c41a1a', true, 3, 'Pulled fresh from a sealed booster box, sleeved and top-loaded since day one.'),
  ('yugioh', 'singles', 'Blue-Eyes White Dragon', 'LOB 1st Edition', 'Ultra Rare', 320.00, 'Light Play', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1120&fit=crop&auto=format', 'VINTAGE', '#c9882a', false, 1, null),
  ('onepiece', 'singles', 'Monkey D. Luffy', 'Romance Dawn OP-01', 'Secret Rare', 74.50, 'Near Mint', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&h=1120&fit=crop&auto=format', 'NEW', '#1d4ed8', true, 5, null),
  ('riftbound', 'singles', 'Nexus Titan', 'Core Set Alpha', 'Mythic', 42.00, 'Near Mint', 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=1120&fit=crop&auto=format', 'EXCLUSIVE', '#7c3aed', true, 4, null)
on conflict do nothing;
