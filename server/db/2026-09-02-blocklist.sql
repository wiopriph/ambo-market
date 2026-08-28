-- Блоклист против спама (казино-номера в описаниях и т.п.).
-- Применить в Supabase Dashboard → SQL Editor.
--
-- kind='phone': value — только цифры (напр. '944123456'). Матчится и как
--   телефон профиля, и как вхождение в цифровые последовательности
--   title/description (любые форматы: 944 123 456, 944-123-456, +244…).
-- kind='text': value — подстрока в lowercase (напр. название казино).
--
-- Срабатывание на создании поста — шэдоу-hold: спамеру «опубликовано»,
-- пост в hold, вам уведомление в Telegram. На привязке номера — явный 403.
--
-- Пополнение: руками (insert ниже) или автоматически кнопкой «Banir» в боте.

create table if not exists blocklist (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null check (kind in ('phone', 'text')),
  value      text not null,
  note       text,
  created_at timestamptz not null default now(),
  unique (kind, value)
);

alter table blocklist enable row level security;
-- политик нет: только service-role (серверные API и бот)

-- Примеры добавления:
-- insert into blocklist (kind, value, note) values ('phone', '944123456', 'казино-спамер');
-- insert into blocklist (kind, value, note) values ('text', 'nome do casino', 'казино');
