import { serverSupabaseClient } from '#supabase/server';


const isNum = (v: any): v is number => typeof v === 'number' && !Number.isNaN(v);

function metersToKilometers(m: number | string) {
  const n = parseFloat(String(m));

  return !Number.isNaN(n) && n >= 0 ? n / 1000 : null;
}

function calculateBoundingBox(latitude?: number, longitude?: number, radius?: number) {
  if (!isNum(latitude) || !isNum(longitude)) {
    return null;
  }

  const EARTH_RADIUS = 6371;
  const DEFAULT_RADIUS = 60;
  const rKm = radius ? metersToKilometers(radius) ?? DEFAULT_RADIUS : DEFAULT_RADIUS;
  const radLat = (Math.PI / 180) * latitude;
  const deg = (rKm / EARTH_RADIUS) * (180 / Math.PI);

  return {
    minLat: latitude - deg,
    maxLat: latitude + deg,
    minLon: longitude - deg / Math.cos(radLat),
    maxLon: longitude + deg / Math.cos(radLat),
  };
}

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
      lat: isNum(row.location_lat) ? row.location_lat : null,
      lon: isNum(row.location_lon) ? row.location_lon : null,
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
  const search = (q.search as string) || '';
  const minPrice = q.minPrice ? Number(q.minPrice) : undefined;
  const maxPrice = q.maxPrice ? Number(q.maxPrice) : undefined;
  const lat = q.lat ? Number(q.lat) : undefined;
  const lon = q.lon ? Number(q.lon) : undefined;
  const radius = q.radius ? Number(q.radius) : undefined;
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

  const box = calculateBoundingBox(lat, lon, radius);

  if (box) {
    s = s
      .gte('location_lat', box.minLat)
      .lte('location_lat', box.maxLat)
      .gte('location_lon', box.minLon)
      .lte('location_lon', box.maxLon);
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
