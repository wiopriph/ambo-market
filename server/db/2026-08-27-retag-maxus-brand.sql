-- Перепривязка существующих объявлений Maxus к новой марке. Применить в
-- Supabase Dashboard → SQL Editor ПОСЛЕ деплоя кода с маркой maxus
-- (constants/categories.ts), иначе карточки будут показывать пустую марку.
--
-- Марки Maxus не было в списке, поэтому продавцы публиковали такие
-- объявления с brand_id = 'other' (или без марки), а модель писали в
-- заголовок: «Maxus T70 2025» и т.п. Находим их по слову maxus в заголовке
-- и переносим на brand_id = 'maxus'.

-- Сначала посмотреть, что попадёт под обновление:
select id, title, brand_id, status
from posts
where category_id = 'vehicles'
  and subcategory_id = 'cars'
  and (brand_id = 'other' or brand_id is null)
  and title ~* '\mmaxus\M';

-- Затем обновить:
update posts
set brand_id = 'maxus'
where category_id = 'vehicles'
  and subcategory_id = 'cars'
  and (brand_id = 'other' or brand_id is null)
  and title ~* '\mmaxus\M';
