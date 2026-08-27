-- Закрытие прямого клиентского доступа к profiles. Применить в Supabase
-- Dashboard → SQL Editor. Имена политик взяты из pg_policies (см. скриншот).
--
-- Две дыры, обе через авто-REST Supabase в обход серверного API:
--
--   1. profiles.read.all  (SELECT, roles={public}, qual=true)
--      Любой аноним мог выкачать phone и email ВСЕХ продавцов одним
--      запросом supabase.from('profiles').select('phone,email').
--      Обходит /contact с rate-limit и всю защиту номера.
--
--   2. profiles.update.self  (UPDATE, roles={authenticated}, auth.uid()=id)
--      Залогиненный мог обнулить свой phone из DevTools, минуя валидацию
--      API — отсюда продавцы без контакта.
--
-- Приложение к profiles с клиента не обращается: чтение профиля идёт через
-- серверные API на service-role, запись — через PATCH (тоже service-role).
-- Поэтому прямой клиентский доступ к таблице закрываем целиком.

-- ── 1. Снять клиентские политики ─────────────────────────────────────────
drop policy if exists "profiles.read.all" on profiles;
drop policy if exists "profiles.update.self" on profiles;

-- ── 2. Отозвать табличные привилегии у клиентских ролей ──────────────────
-- Service role ходит мимо RLS и грантов — серверные API не затрагиваются.
revoke all on profiles from anon, authenticated;

-- ── 3. Предохранитель на уровне БД ───────────────────────────────────────
-- Заданный телефон нельзя стереть никаким писателем (API, REST, ручной SQL).
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
