create extension if not exists pgcrypto;

create table if not exists public.collections (
  id text primary key,
  name text not null,
  publisher text not null,
  competition text not null,
  year integer not null,
  total_stickers integer not null check (total_stickers >= 0),
  total_pages integer not null check (total_pages >= 0),
  source_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.checklist_variants (
  id text primary key,
  collection_id text not null references public.collections(id) on delete cascade,
  name text not null,
  country text not null,
  language text not null,
  total_stickers integer not null check (total_stickers >= 0),
  source_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.album_editions (
  id text primary key,
  collection_id text not null references public.collections(id) on delete cascade,
  checklist_variant_id text not null references public.checklist_variants(id) on delete restrict,
  country text not null,
  language text not null,
  edition_name text not null,
  cover_type text not null,
  cover_variant text not null,
  product_name text not null,
  product_url text not null,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.album_editions
  add column if not exists is_enabled boolean not null default true;

create table if not exists public.checklist_sections (
  id text primary key,
  checklist_variant_id text not null references public.checklist_variants(id) on delete cascade,
  name text not null,
  code text not null,
  section_type text not null check (section_type in ('intro', 'team', 'special')),
  sort_order integer not null,
  page_start integer not null check (page_start >= 0),
  page_end integer not null check (page_end >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (checklist_variant_id, code)
);

create table if not exists public.official_stickers (
  id text primary key,
  checklist_variant_id text not null references public.checklist_variants(id) on delete cascade,
  section_id text not null references public.checklist_sections(id) on delete cascade,
  official_number integer not null,
  display_code text not null,
  name text not null,
  country_code text,
  team_name text,
  sticker_type text not null check (sticker_type in ('normal', 'special', 'golden-baller')),
  rarity_type text not null check (rarity_type in ('base', 'foil', 'rare')),
  role text,
  page_number integer not null check (page_number >= 0),
  sort_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (checklist_variant_id, official_number)
);

create table if not exists public.user_albums (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  album_edition_id text not null references public.album_editions(id) on delete restrict,
  collection_id text not null references public.collections(id) on delete restrict,
  checklist_variant_id text not null references public.checklist_variants(id) on delete restrict,
  nickname text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_stickers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_album_id uuid not null references public.user_albums(id) on delete cascade,
  official_sticker_id text not null references public.official_stickers(id) on delete restrict,
  quantity integer not null default 0 check (quantity >= 0),
  condition text not null default 'new' check (condition in ('new', 'pasted', 'damaged')),
  notes text not null default '',
  updated_at timestamptz not null default now(),
  unique (user_album_id, official_sticker_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_collections_updated_at on public.collections;
create trigger set_collections_updated_at
  before update on public.collections
  for each row execute function public.set_updated_at();

drop trigger if exists set_checklist_variants_updated_at on public.checklist_variants;
create trigger set_checklist_variants_updated_at
  before update on public.checklist_variants
  for each row execute function public.set_updated_at();

drop trigger if exists set_album_editions_updated_at on public.album_editions;
create trigger set_album_editions_updated_at
  before update on public.album_editions
  for each row execute function public.set_updated_at();

drop trigger if exists set_checklist_sections_updated_at on public.checklist_sections;
create trigger set_checklist_sections_updated_at
  before update on public.checklist_sections
  for each row execute function public.set_updated_at();

drop trigger if exists set_official_stickers_updated_at on public.official_stickers;
create trigger set_official_stickers_updated_at
  before update on public.official_stickers
  for each row execute function public.set_updated_at();

drop trigger if exists set_user_albums_updated_at on public.user_albums;
create trigger set_user_albums_updated_at
  before update on public.user_albums
  for each row execute function public.set_updated_at();

drop trigger if exists set_user_stickers_updated_at on public.user_stickers;
create trigger set_user_stickers_updated_at
  before update on public.user_stickers
  for each row execute function public.set_updated_at();

create index if not exists idx_album_editions_collection_country
  on public.album_editions (collection_id, country, language, cover_type, cover_variant);
create index if not exists idx_album_editions_collection_enabled
  on public.album_editions (collection_id, is_enabled, country);
create index if not exists idx_album_editions_checklist_variant
  on public.album_editions (checklist_variant_id);
create index if not exists idx_checklist_sections_variant_sort
  on public.checklist_sections (checklist_variant_id, sort_order);
create index if not exists idx_official_stickers_variant_sort
  on public.official_stickers (checklist_variant_id, sort_order);
create index if not exists idx_official_stickers_section_sort
  on public.official_stickers (section_id, sort_order);
create index if not exists idx_user_albums_user_updated
  on public.user_albums (user_id, updated_at desc);
create index if not exists idx_user_stickers_album
  on public.user_stickers (user_album_id);
create index if not exists idx_user_stickers_user_album
  on public.user_stickers (user_id, user_album_id);

alter table public.collections enable row level security;
alter table public.album_editions enable row level security;
alter table public.checklist_variants enable row level security;
alter table public.checklist_sections enable row level security;
alter table public.official_stickers enable row level security;
alter table public.user_albums enable row level security;
alter table public.user_stickers enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
      or coalesce((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin', false);
$$;

create policy "authenticated users can read collections"
  on public.collections for select
  to authenticated
  using (true);

create policy "admins can manage collections"
  on public.collections for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "authenticated users can read album editions"
  on public.album_editions for select
  to authenticated
  using (true);

create policy "admins can manage album editions"
  on public.album_editions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "authenticated users can read checklist variants"
  on public.checklist_variants for select
  to authenticated
  using (true);

create policy "admins can manage checklist variants"
  on public.checklist_variants for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "authenticated users can read checklist sections"
  on public.checklist_sections for select
  to authenticated
  using (true);

create policy "admins can manage checklist sections"
  on public.checklist_sections for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "authenticated users can read official stickers"
  on public.official_stickers for select
  to authenticated
  using (true);

create policy "admins can manage official stickers"
  on public.official_stickers for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "users can read own albums"
  on public.user_albums for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users can insert own albums"
  on public.user_albums for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update own albums"
  on public.user_albums for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users can delete own albums"
  on public.user_albums for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "users can read own stickers"
  on public.user_stickers for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users can insert own stickers"
  on public.user_stickers for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.user_albums ua
      where ua.id = user_album_id and ua.user_id = auth.uid()
    )
  );

create policy "users can update own stickers"
  on public.user_stickers for update
  to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.user_albums ua
      where ua.id = user_album_id and ua.user_id = auth.uid()
    )
  );

create policy "users can delete own stickers"
  on public.user_stickers for delete
  to authenticated
  using (auth.uid() = user_id);
