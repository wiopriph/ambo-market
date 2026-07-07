import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import { getCityIdByName } from '~/constants/cities';


const isNum = (v: any): v is number => typeof v === 'number' && !Number.isNaN(v);

function mapRowToPost(row: any) {
  return {
    id: row.id,
    fsId: row.fs_id ?? null,
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
    },
  };
}

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You must be logged in',
    });
  }

  const client = await serverSupabaseClient(event);

  const { data: favorites, error: favoritesError } = await client
    .from('favorites')
    .select('post_id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (favoritesError) {
    throw createError({ statusCode: 500, statusMessage: favoritesError.message });
  }

  const ids = (favorites ?? []).map(row => row.post_id as string);

  if (!ids.length) {
    return { posts: [], resultsCount: 0 };
  }

  const { data: rows, error: postsError } = await client
    .from('post_with_author')
    .select('*')
    .in('id', ids);

  if (postsError) {
    throw createError({ statusCode: 500, statusMessage: postsError.message });
  }

  // сохраняем порядок «последнее добавленное — первым»
  const byId = new Map((rows ?? []).map(row => [row.id, row]));
  const posts = ids
    .map(id => byId.get(id))
    .filter(Boolean)
    .map(mapRowToPost);

  return {
    posts,
    resultsCount: posts.length,
  };
});
