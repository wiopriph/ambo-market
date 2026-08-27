-- Защита телефона продавца. Применить в Supabase Dashboard → SQL Editor.
--
-- Причина: PATCH /api/users/[id] раньше ходил под токеном пользователя (RLS),
-- значит существует политика «authenticated обновляет свою строку profiles».
-- Та же политика открыта браузерному supabase-клиенту — любой залогиненный
-- пользователь мог из DevTools обнулить phone в обход серверной валидации,
-- оставив свои объявления без контакта.
--
-- Теперь запись профиля идёт только через service-role в API. Здесь:
--   1) убираем прямой UPDATE profiles для клиентов;
--   2) триггер-предохранитель на случай любого другого писателя.

-- ── 1. Клиент больше не пишет profiles напрямую ──────────────────────────
-- Снимаем клиентские UPDATE-политики (имя может отличаться — проверьте
-- select * from pg_policies where tablename = 'profiles'; и снимите нужную).
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Enable update for users based on id" on profiles;
-- SELECT-политику для чтения профиля НЕ трогаем — она нужна.

-- ── 2. Предохранитель на уровне БД ───────────────────────────────────────
-- Заданный телефон нельзя стереть: только заменить на другой непустой.
-- Ловит API, прямой REST, ручные UPDATE в SQL-редакторе.
create or replace function profiles_protect_phone()
returns trigger
language plpgsql
as $$
begin
  if (new.phone is null or new.phone = '')
     and (old.phone is not null and old.phone <> '') then
    raise exception 'phone cannot be cleared once set';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_protect_phone on profiles;

create trigger profiles_protect_phone
  before update on profiles
  for each row
  execute function profiles_protect_phone();
