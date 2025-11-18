import { serverSupabaseClient } from '#supabase/server';


const isFirestoreId = (s: string) => /^[A-Za-z0-9_-]{20}$/.test(s);

const mapRowToPost = (row: any) => ({
  id: row.id,
  fsId: row.fs_id ?? null, // можно удалить позже
  categoryId: row.category_id ?? null,
  subcategoryId: row.subcategory_id ?? null,
  brandId: row.brand_id ?? null,
  createdAt: row.created_at ?? null,
  images: row.images || [],
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
  status: row.status ?? null,
  userId: row.user_id ?? null, // старое поле для совместимости
  authorId: row.author_id ?? null,
});

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id as string;
  const client = await serverSupabaseClient(event);

  // 1) пост (можно 'posts' если нет view)
  const column = isFirestoreId(id) ? 'fs_id' : 'id';
  const { data: postRow, error: postErr } = await client
    .from('post_with_author') // или 'posts'
    .select('*')
    .eq(column, id)
    .maybeSingle();

  if (postErr) {
    throw createError({ statusCode: 500, statusMessage: postErr.message });
  }

  if (!postRow) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' });
  }

  const post = mapRowToPost(postRow);

  // 2) автор из profiles (без доступа к auth.users)
  const user = {
    id: post.authorId,
    creationTime: null as string | null, // не трогаем (нет в profiles)
    emailVerified: null as boolean | null, // не трогаем
    name: null as string | null,
    photoURL: null as string | null,
    disabled: null as boolean | null, // нет аналога — оставим null
    email: null as string | null,
    phone: null as string | null,
  };

  if (post.authorId) {
    const { data: profile, error: profErr } = await client
      .from('profiles')
      .select('display_name, avatar_url, phone, email, created_at')
      .eq('id', post.authorId)
      .maybeSingle();

    if (profErr) {
      throw createError({ statusCode: 500, statusMessage: profErr.message });
    }

    if (profile) {
      user.name = profile.display_name ?? null;
      user.photoURL = profile.avatar_url ?? null;
      user.email = profile.email ?? null;
      user.phone = profile.phone ?? null;
      user.creationTime = profile.created_at ?? null;
    }
  }

  return { post, user };
});
