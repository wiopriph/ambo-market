import { serverSupabaseClient } from '#supabase/server';


const isFirestoreId = (s: string) => /^[A-Za-z0-9]{20}$/.test(s);

const mapRowToPost = (row: any) => ({
  id: row.id,
  fsId: row.fs_id ?? null,
  categoryId: row.category_id ?? null,
  subcategoryId: row.subcategory_id ?? null,
  brandId: row.brand_id ?? null,
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
  userId: row.user_id ?? null,
  authorId: row.author_id ?? null,
  status: row.status ?? null,
});

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const id = event.context.params!.id as string;
  const q = getQuery(event);
  const limit = Math.min(Number(q.limit || 5), 20);

  // 1) получаем текущий пост
  const idColumn = isFirestoreId(id) ? 'fs_id' : 'id';
  const { data: current, error: curErr } = await client
    .from('posts') // можно заменить на 'post_with_author', если нужно
    .select('id, fs_id, category_id, subcategory_id, brand_id, status, created_at')
    .eq(idColumn, id)
    .maybeSingle();

  if (curErr) {
    throw createError({ statusCode: 500, statusMessage: curErr.message });
  }

  if (!current) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' });
  }

  const curId = current.id;
  const sub = current.subcategory_id;
  const cat = current.category_id;
  const brand = current.brand_id;

  const seen = new Set<string>();

  const pushUnique = (rows: any[], bucket: any[]) => {
    for (const r of rows) {
      if (r.id === curId) {
        continue;
      }

      if (seen.has(r.id)) {
        continue;
      }

      seen.add(r.id);
      bucket.push(mapRowToPost(r));
    }
  };

  async function fetchBatch(filters: Record<string, string | null>, need = limit) {
    let s = client
      .from('posts')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(Math.min(need * 2, 40));

    for (const [col, val] of Object.entries(filters)) {
      if (val) {
        s = s.eq(col, val);
      }
    }

    const { data, error } = await s;

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message });
    }

    return data ?? [];
  }

  const out: any[] = [];

  // 2) та же подкатегория + тот же бренд
  if (sub && brand && out.length < limit) {
    const rows = await fetchBatch({ subcategory_id: sub, brand_id: brand }, limit - out.length);

    pushUnique(rows, out);
  }

  // 3) та же подкатегория (без бренда / или докинуть если не хватило)
  if (sub && out.length < limit) {
    const rows = await fetchBatch({ subcategory_id: sub }, limit - out.length);

    pushUnique(rows, out);
  }

  // 4) та же категория
  if (cat && out.length < limit) {
    const rows = await fetchBatch({ category_id: cat }, limit - out.length);

    pushUnique(rows, out);
  }

  // 5) докинуть просто свежих открытых
  if (out.length < limit) {
    const rows = await fetchBatch({}, limit - out.length);

    pushUnique(rows, out);
  }

  return { posts: out.slice(0, limit) };
});
