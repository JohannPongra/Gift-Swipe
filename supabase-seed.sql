insert into public.gift_ideas (title, price, description)
select seed.title, seed.price, seed.description
from (
    values
        ('Gemütliche Leselampe', '24,99 EUR', 'Eine stilvolle Leselampe für gemütliche Abende mit einem guten Buch.'),
        ('Isolierflasche', '19,99 EUR', 'Eine wiederverwendbare Flasche, die Getränke unterwegs warm oder kalt hält.')
) as seed(title, price, description)
where not exists (
    select 1
    from public.gift_ideas as existing
    where existing.title = seed.title
);

insert into public.swipe_sessions default values
returning id, access_token;
