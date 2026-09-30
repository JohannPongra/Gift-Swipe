-- GiftSwipe-Bilderweiterung: mehrere Bilder pro Geschenkidee

create table if not exists public.gift_idea_images (
    id uuid primary key default gen_random_uuid(),
    gift_idea_id uuid not null references public.gift_ideas(id) on delete cascade,
    image_url text not null,
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    unique (gift_idea_id, image_url)
);

alter table public.gift_idea_images enable row level security;

drop policy if exists "published gift images are public" on public.gift_idea_images;
create policy "published gift images are public"
on public.gift_idea_images
for select
to anon, authenticated
using (
    exists (
        select 1
        from public.gift_ideas
        where gift_ideas.id = gift_idea_images.gift_idea_id
          and (gift_ideas.is_published = true or auth.role() = 'authenticated')
    )
);

drop policy if exists "admins can manage gift images" on public.gift_idea_images;
create policy "admins can manage gift images"
on public.gift_idea_images
for all
to authenticated
using (true)
with check (true);

drop function if exists public.get_gifts_for_session(text);

create or replace function public.get_gifts_for_session(p_access_token text)
returns table (
    id uuid,
    title text,
    description text,
    image_url text,
    image_urls text[],
    product_url text
)
language sql
security definer
set search_path = public
as $$
    select
        gifts.id,
        gifts.title,
        gifts.description,
        gifts.image_url,
        case
            when count(images.id) > 0 then array_agg(images.image_url order by images.sort_order, images.created_at)
            when gifts.image_url is not null then array[gifts.image_url]
            else array[]::text[]
        end as image_urls,
        gifts.product_url
    from public.gift_ideas as gifts
    join public.swipe_sessions as sessions on sessions.access_token = p_access_token
    left join public.gift_idea_images as images on images.gift_idea_id = gifts.id
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
    group by gifts.id, gifts.title, gifts.description, gifts.image_url, gifts.product_url, gifts.created_at
    order by random();
$$;

grant execute on function public.get_gifts_for_session(text) to anon, authenticated;
