import { serverSupabaseClient } from '#supabase/server';
import { getCityById, getCityIdByName } from '~/constants/cities';


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

    isSafeDeal: typeof row.is_safe_deal === 'boolean' ? row.is_safe_deal : null,
    preview: row.preview ?? null,
    images: Array.isArray(row.images) ? row.images : [],

    location: {
      cityId: getCityIdByName(row.location_city ?? ''),
      city: row.location_city ?? null,
      displayName: row.location_display_name ?? null,
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
