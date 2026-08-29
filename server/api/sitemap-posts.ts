import type { SitemapUrlInput } from '#sitemap/types';
import { serverSupabaseClient } from '#supabase/server';
import { getCityIdByName } from '~/constants/cities';


// Лимит протокола sitemap — 50 000 URL на файл; берём с запасом.
const MAX_URLS = 45000;

type PostRow = {
  id: string;
  category_id: string | null;
  subcategory_id: string | null;
  brand_id: string | null;
  location_city: string | null;
  updated_at: string | null;
};

// Путь обязан совпадать с логикой utils/getPostRoute.ts:
// бренд попадает в URL только вместе с подкатегорией.
function postPath(row: PostRow): string | null {
  if (!row.category_id) {
    return null;
  }

  const cityId = getCityIdByName(row.location_city ?? '') || 'all';
  const segments = [cityId, row.category_id];

  if (row.subcategory_id) {
    segments.push(row.subcategory_id);

    if (row.brand_id) {
      segments.push(row.brand_id);
    }
  }

  segments.push(row.id);

  return `/${segments.join('/')}`;
}

export default defineSitemapEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const { data, error } = await client
    .from('posts')
    .select('id, category_id, subcategory_id, brand_id, location_city, updated_at')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(MAX_URLS);

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return ((data ?? []) as PostRow[])
    .map((row) => {
      const loc = postPath(row);

      if (!loc) {
        return null;
      }

      return {
        loc,
        lastmod: row.updated_at ?? undefined,
      };
    })
    .filter(Boolean) as SitemapUrlInput[];
});
