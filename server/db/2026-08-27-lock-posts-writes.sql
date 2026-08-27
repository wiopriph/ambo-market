-- Закрытие прямой клиентской записи в posts. Применить в Supabase
-- Dashboard → SQL Editor ПОСЛЕ деплоя кода (create/close на service-role).
--
-- posts имела клиентские политики INSERT/UPDATE/DELETE — через авто-REST
-- Supabase можно было вставить объявление напрямую, минуя create-API и его
-- проверку телефона (источник безномерных постов), задать любой status,
-- обойти обработку фото и нормализацию атрибутов.
--
-- Все записи в posts идут через серверные API на service-role. Клиенту
-- оставляем только SELECT (объявления публичны).

-- Снимаем все клиентские политики записи, оставляя SELECT.
-- Имена не хардкодим — снимаем по типу команды.
do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'posts'
      and cmd in ('INSERT', 'UPDATE', 'DELETE')
  loop
    execute format('drop policy %I on posts', pol.policyname);
  end loop;
end $$;

-- Проверка: должна остаться только SELECT-политика.
-- select policyname, cmd from pg_policies where tablename = 'posts';
