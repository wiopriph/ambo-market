import { serverSupabaseClient } from '#supabase/server';


const POST_STATUSES = ['open', 'hold', 'closed'] as const;

type PostStatus = typeof POST_STATUSES[number]

const isStatus = (v: any): v is PostStatus => POST_STATUSES.includes(v);

const mapRowToPost = (row: any) => ({
  id: row.id,
  fsId: row.fs_id ?? null, // можно удалить позже
  createdAt: row.created_at ?? null,
  preview: row.preview ?? (Array.isArray(row.images) ? row.images[0] : null),
  price: typeof row.price === 'number' ? row.price : null,
  description: row.description ?? null,
  location: {
    lat: row.location_lat ?? null,
    lon: row.location_lon ?? null,
    city: row.location_city ?? null,
    displayName: row.location_display_name ?? null,
  },
  isSafeDeal: typeof row.is_safe_deal === 'boolean' ? row.is_safe_deal : null,
  title: row.title ?? null,
  userId: row.user_id ?? null, // для совместимости
  authorId: row.author_id ?? null, // Supabase UUID автора
  categoryId: row.category_id ?? null,
  subcategoryId: row.subcategory_id ?? null,
  brandId: row.brand_id ?? null,
  status: row.status ?? null,
});

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const userId = event.context.params!.userId as string;
  const q = getQuery(event);
  const status = typeof q.status === 'string' ? q.status : undefined;

  // Базовый запрос к таблице posts (если используешь view — замени на 'post_with_author')
  let s = client.from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  // Поддержка обоих вариантов идентификатора владельца:
  // 1) новый автор (author_id = Supabase UUID)
  // 2) старое поле из Firebase (user_id = строка)
  s = s.or(`author_id.eq.${userId},user_id.eq.${userId}`);

  if (status && isStatus(status)) {
    s = s.eq('status', status);
  }

  const { data, error } = await s;

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return (data ?? []).map(mapRowToPost);
});
