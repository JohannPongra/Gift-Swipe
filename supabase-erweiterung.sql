-- GiftSwipe-Erweiterung: Kategorien, Admin-Verwaltung und Kategorie-Sessions

alter table public.gift_ideas
    alter column price drop not null;

alter table public.swipe_sessions
    add column if not exists mode text not null default 'normal';

alter table public.swipe_sessions
    drop constraint if exists swipe_sessions_mode_check;

alter table public.swipe_sessions
    add constraint swipe_sessions_mode_check check (mode in ('normal', 'categories'));

create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),
    title text not null unique,
    description text,
    image_url text,
    is_published boolean not null default true,
    created_at timestamptz not null default now()
);

create table if not exists public.gift_idea_categories (
    gift_idea_id uuid not null references public.gift_ideas(id) on delete cascade,
    category_id uuid not null references public.categories(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (gift_idea_id, category_id)
);

create table if not exists public.category_decisions (
    id uuid primary key default gen_random_uuid(),
    session_id uuid not null references public.swipe_sessions(id) on delete cascade,
    category_id uuid not null references public.categories(id) on delete cascade,
    choice text not null check (choice in ('Ja', 'Nein')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (session_id, category_id)
);

alter table public.categories enable row level security;
alter table public.gift_idea_categories enable row level security;
alter table public.category_decisions enable row level security;

-- Admins manage content; participants read only published content through normal queries.
drop policy if exists "admins can manage gift ideas" on public.gift_ideas;
create policy "admins can manage gift ideas"
on public.gift_ideas
for all
to authenticated
using (true)
with check (true);

drop policy if exists "published categories are public" on public.categories;
create policy "published categories are public"
on public.categories
for select
to anon, authenticated
using (is_published = true or auth.role() = 'authenticated');

drop policy if exists "admins can manage categories" on public.categories;
create policy "admins can manage categories"
on public.categories
for all
to authenticated
using (true)
with check (true);

drop policy if exists "admins can manage gift category links" on public.gift_idea_categories;
create policy "admins can manage gift category links"
on public.gift_idea_categories
for all
to authenticated
using (true)
with check (true);

drop policy if exists "admins can read category decisions" on public.category_decisions;
create policy "admins can read category decisions"
on public.category_decisions
for select
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('gift-images', 'gift-images', true)
on conflict (id) do update set public = true;

drop policy if exists "public can view gift images" on storage.objects;
create policy "public can view gift images"
on storage.objects
for select
to public
using (bucket_id = 'gift-images');

drop policy if exists "admins can upload gift images" on storage.objects;
create policy "admins can upload gift images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'gift-images');

drop policy if exists "admins can change gift images" on storage.objects;
create policy "admins can change gift images"
on storage.objects
for update
to authenticated
using (bucket_id = 'gift-images')
with check (bucket_id = 'gift-images');

drop policy if exists "admins can delete gift images" on storage.objects;
create policy "admins can delete gift images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'gift-images');

create or replace function public.get_session_config(p_access_token text)
returns table (session_id uuid, session_mode text)
language sql
security definer
set search_path = public
as $$
    select id, mode
    from public.swipe_sessions
    where access_token = p_access_token;
$$;

grant execute on function public.get_session_config(text) to anon, authenticated;

create or replace function public.get_categories_for_session(p_access_token text)
returns setof public.categories
language sql
security definer
set search_path = public
as $$
    select categories.*
    from public.categories
    where categories.is_published = true
      and exists (
          select 1
          from public.swipe_sessions
          where swipe_sessions.access_token = p_access_token
      )
    order by categories.created_at;
$$;

grant execute on function public.get_categories_for_session(text) to anon, authenticated;

create or replace function public.submit_category_decision(
    p_access_token text,
    p_category_id uuid,
    p_choice text
)
returns public.category_decisions
language plpgsql
security definer
set search_path = public
as $$
declare
    saved_decision public.category_decisions;
begin
    if p_choice not in ('Ja', 'Nein') then
        raise exception 'Ungueltige Entscheidung';
    end if;

    insert into public.category_decisions (session_id, category_id, choice)
    select sessions.id, categories.id, p_choice
    from public.swipe_sessions as sessions
    cross join public.categories as categories
    where sessions.access_token = p_access_token
      and sessions.mode = 'categories'
      and categories.id = p_category_id
      and categories.is_published = true
    on conflict (session_id, category_id)
    do update set
        choice = excluded.choice,
        updated_at = now()
    returning * into saved_decision;

    if saved_decision.id is null then
        raise exception 'Session oder Kategorie nicht gefunden';
    end if;

    return saved_decision;
end;
$$;

grant execute on function public.submit_category_decision(text, uuid, text) to anon, authenticated;

create or replace function public.get_gifts_for_session(p_access_token text)
returns table (
    id uuid,
    title text,
    description text,
    image_url text,
    product_url text
)
language sql
security definer
set search_path = public
as $$
    select gifts.id, gifts.title, gifts.description, gifts.image_url, gifts.product_url
    from public.gift_ideas as gifts
    join public.swipe_sessions as sessions on sessions.access_token = p_access_token
    where gifts.is_published = true
      and (
          sessions.mode = 'normal'
          or exists (
              select 1
              from public.gift_idea_categories as links
              join public.category_decisions as decisions
                on decisions.category_id = links.category_id
               and decisions.session_id = sessions.id
              where links.gift_idea_id = gifts.id
                and decisions.choice = 'Ja'
          )
      )
    order by random();
$$;

grant execute on function public.get_gifts_for_session(text) to anon, authenticated;

create or replace function public.create_swipe_session(p_mode text default 'normal')
returns table (session_id uuid, access_token text, session_mode text)
language plpgsql
security definer
set search_path = public
as $$
declare
    new_session public.swipe_sessions;
begin
    if auth.role() <> 'authenticated' then
        raise exception 'Admin-Login erforderlich';
    end if;

    if p_mode not in ('normal', 'categories') then
        raise exception 'Ungueltiger Session-Modus';
    end if;

    insert into public.swipe_sessions (mode)
    values (p_mode)
    returning * into new_session;

    return query select new_session.id, new_session.access_token, new_session.mode;
end;
$$;

grant execute on function public.create_swipe_session(text) to authenticated;
