import { serverSupabaseClient } from '#supabase/server';
import { getCityById, getCityIdByName } from '~/constants/cities';
import { getFilterableAttributeFields } from '~/constants/productAttributes';


const isNum = (v: any): v is number => typeof v === 'number' && !Number.isNaN(v);

// маппим snake_case из БД -> camelCase API + вложенность
function mapRowToPost(row: any) {
  return {
    id: row.id, // uuid (новый)
    fsId: row.fs_id ?? null, // если ещё не убрали
    categoryId: row.category_id ?? null,
    subcategoryId: row.subcategory_id ?? null,
    brandId: row.brand_id ?? null,

    title: row.title ?? null,
    description: row.description ?? null,
    price: isNum(row.price) ? row.price : null,
    status: row.status ?? null,

    preview: row.preview ?? null,
    images: Array.isArray(row.images) ? row.images : [],

    location: {
      cityId: getCityIdByName(row.location_city ?? ''),
      cityName: row.location_city ?? row.location_display_name ?? null,
    },

    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,

    author: {
      id: row.author_id ?? null,
      name: row.author_name ?? null,
      avatar: row.author_avatar ?? null,
      email: row.author_email ?? null,
    },
  };
}

export default defineEventHandler(async (event) => {
  const q = getQuery(event);
  const client = await serverSupabaseClient(event);

  const categoryId = q.categoryId as string | undefined;
  const subcategoryId = q.subcategoryId as string | undefined;
  const brandId = q.brandId as string | undefined;
  const cityId = q.cityId as string | undefined;
  const search = (q.search as string) || '';
  const minPrice = q.minPrice ? Number(q.minPrice) : undefined;
  const maxPrice = q.maxPrice ? Number(q.maxPrice) : undefined;
  const page = Number(q.page || 1);
  const limit = Math.min(Number(q.limit || 10), 100);
  const offset = (page - 1) * limit;

  let s = client.from('post_with_author')
    .select('*', { count: 'exact' })
    .eq('status', 'open');

  if (categoryId) {
    s = s.eq('category_id', categoryId);
  }

  if (subcategoryId) {
    s = s.eq('subcategory_id', subcategoryId);
  }

  if (brandId) {
    s = s.eq('brand_id', brandId);
  }

  if (isNum(minPrice)) {
    s = s.gte('price', minPrice);
  }

  if (isNum(maxPrice)) {
    s = s.lte('price', maxPrice);
  }

  const city = cityId ? getCityById(cityId) : undefined;

  if (city?.id && city.id !== 'all') {
    s = s.eq('location_city', city.name);
  }

  if (search) {
    // ищем по title/description без учёта регистра
    s = s.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // Фильтры по атрибутам (attr_fuel=diesel,gasoline / attr_year_min=2015 / attr_furnished=1).
  // Ключи берём только из схемы категории — значения из URL никогда не попадают в путь колонки.
  if (categoryId && subcategoryId) {
    for (const field of getFilterableAttributeFields(categoryId, subcategoryId)) {
      if (field.type === 'select') {
        const raw = q[`attr_${field.key}`] as string | undefined;

        if (raw) {
          const allowed = new Set((field.options ?? []).map(option => option.value));
          const values = raw.split(',').filter(value => allowed.has(value));

          if (values.length) {
            s = s.in(`attributes->>${field.key}`, values);
          }
        }
      }

      if (field.type === 'number') {
        const min = Number(q[`attr_${field.key}_min`]);
        const max = Number(q[`attr_${field.key}_max`]);

        // attributes->key — сравнение как jsonb-число (значения нормализуются при создании поста)
        if (isNum(min)) {
          s = s.gte(`attributes->${field.key}`, min);
        }

        if (isNum(max)) {
          s = s.lte(`attributes->${field.key}`, max);
        }
      }

      if (field.type === 'boolean' && q[`attr_${field.key}`] === '1') {
        s = s.eq(`attributes->${field.key}`, true);
      }
    }
  }

  s = s.order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await s;

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  // маппинг под camelCase и вложенность
  const posts = (data ?? []).map(mapRowToPost);

  return {
    posts,
    resultsCount: count ?? posts.length,
    page,
  };
});
