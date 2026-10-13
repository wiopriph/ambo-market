-- Чат между покупателем и продавцом, привязанный к объявлению.
-- Применить в Supabase Dashboard -> SQL Editor.
--
-- Запись только через серверные API (service role): валидация, rate-limit,
-- блоклист на каждое сообщение. Чтение - клиентским select по RLS: это
-- нужно для Supabase Realtime (подписка на новые сообщения уважает RLS).
--
-- seller_id денормализован: чат должен переживать удаление поста,
-- а RLS-политики не должны джойнить posts на каждое realtime-событие.

create table if not exists chats (
  id              uuid primary key default gen_random_uuid(),
  post_id         uuid references posts (id) on delete set null,
  buyer_id        uuid not null references auth.users (id) on delete cascade,
  seller_id       uuid not null references auth.users (id) on delete cascade,
  created_at      timestamptz not null default now(),
  last_message_at timestamptz,
  unique (post_id, buyer_id)
);

create table if not exists messages (
  id         uuid primary key default gen_random_uuid(),
  chat_id    uuid not null references chats (id) on delete cascade,
  sender_id  uuid not null references auth.users (id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  read_at    timestamptz
);

create index if not exists chats_buyer_idx on chats (buyer_id, last_message_at desc);
create index if not exists chats_seller_idx on chats (seller_id, last_message_at desc);
create index if not exists messages_chat_idx on messages (chat_id, created_at);
create index if not exists messages_unread_idx on messages (chat_id) where read_at is null;

alter table chats enable row level security;
alter table messages enable row level security;

-- участники читают, писать клиентам нельзя (только серверные API)
create policy "chats.select.participants" on chats
  for select to authenticated
  using (auth.uid() in (buyer_id, seller_id));

create policy "messages.select.participants" on messages
  for select to authenticated
  using (exists (
    select 1 from chats
    where chats.id = messages.chat_id
      and auth.uid() in (chats.buyer_id, chats.seller_id)
  ));

revoke all on chats, messages from anon, authenticated;
grant select on chats, messages to authenticated;

-- realtime: события INSERT по messages уходят подписчикам (фильтрует RLS)
alter publication supabase_realtime add table messages;
