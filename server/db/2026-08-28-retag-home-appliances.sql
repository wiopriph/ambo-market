-- Подкатегория home/appliances удалена из кода (дубль electronics/appliances).
-- Применить в Supabase Dashboard → SQL Editor вместе с деплоем этого кода:
-- middleware validate-subcategory отдаёт 404 на неизвестную подкатегорию,
-- поэтому объявления, оставшиеся в home/appliances, стали бы недоступны.
--
-- Переносим их в electronics/appliances — ту же «Eletrodomésticos»,
-- которая осталась в списке. На момент миграции таких объявлений два,
-- оба закрытые (фильтры для воды).

-- Сначала посмотреть, что попадёт под обновление:
select id, title, status
from posts
where category_id = 'home'
  and subcategory_id = 'appliances';

-- Затем обновить:
update posts
set category_id = 'electronics'
where category_id = 'home'
  and subcategory_id = 'appliances';
