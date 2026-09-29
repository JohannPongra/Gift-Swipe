create extension if not exists pgcrypto;

create table public.gift_ideas (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    price text not null,
    description text not null,
    image_url text,
    product_url text,
    is_published boolean not null default true,
    created_at timestamptz not null default now()
);

create table public.swipe_sessions (
    id uuid primary key default gen_random_uuid(),
    access_token text not null unique default encode(gen_random_bytes(32), 'hex'),
    created_at timestamptz not null default now()
);

create table public.decisions (
    id uuid primary key default gen_random_uuid(),
    session_id uuid not null references public.swipe_sessions(id) on delete cascade,
    gift_idea_id uuid not null references public.gift_ideas(id) on delete cascade,
    choice text not null check (choice in ('Ja', 'Nein')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (session_id, gift_idea_id)
);

alter table public.gift_ideas enable row level security;
alter table public.swipe_sessions enable row level security;
alter table public.decisions enable row level security;

create policy "published gifts are public"
on public.gift_ideas
for select
to anon, authenticated
using (is_published = true or auth.role() = 'authenticated');

create policy "admins can read sessions"
on public.swipe_sessions
for select
to authenticated
using (true);

create policy "admins can read decisions"
on public.decisions
for select
to authenticated
using (true);

create or replace function public.submit_decision(
    p_access_token text,
    p_gift_idea_id uuid,
    p_choice text
)
returns public.decisions
language plpgsql
security definer
set search_path = public
as $$
declare
    saved_decision public.decisions;
begin
    if p_choice not in ('Ja', 'Nein') then
        raise exception 'Ungültige Entscheidung';
    end if;

    insert into public.decisions (session_id, gift_idea_id, choice)
    select sessions.id, gifts.id, p_choice
    from public.swipe_sessions as sessions
    cross join public.gift_ideas as gifts
    where sessions.access_token = p_access_token
      and gifts.id = p_gift_idea_id
      and gifts.is_published = true
    on conflict (session_id, gift_idea_id)
    do update set
        choice = excluded.choice,
        updated_at = now()
    returning * into saved_decision;

    if saved_decision.id is null then
        raise exception 'Session oder Geschenkidee nicht gefunden';
    end if;

    return saved_decision;
end;
$$;

grant execute on function public.submit_decision(text, uuid, text) to anon, authenticated;

-- Example seed data. Run this separately after creating the tables.
-- insert into public.gift_ideas (title, price, description)
-- values
--     ('Gemütliche Leselampe', '24,99 EUR', 'Eine stilvolle Leselampe für gemütliche Abende.'),
--     ('Isolierflasche', '19,99 EUR', 'Eine wiederverwendbare Flasche für warme oder kalte Getränke.');
