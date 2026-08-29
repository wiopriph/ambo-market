import type { SupabaseClient } from '@supabase/supabase-js';
import { CITIES_IDS, getCityIdByName } from '~/constants/cities';
import { CATEGORIES } from '~/constants/categories';


const MIN_POSTS_TO_INDEX = 3;

export type ListingPage = {
  path: string;
  count: number;
  lastmod?: string;
};

type RpcRow = {
  city: string | null;
  category: string | null;
  subcategory: string | null;
  brand: string | null;
  /** grouping(): бит = колонка агрегирована (city=8, cat=4, sub=2, brand=1). */
  mask: number;
  n: number;
  'last_updated': string | null;
};

// валидные пути по справочнику категорий: старые посты могут ссылаться
// на удалённые подкатегории/бренды — такие комбинации в sitemap не нужны
const VALID_LISTING_KEYS = new Set<string>();

for (const category of CATEGORIES) {
  VALID_LISTING_KEYS.add(category.id);

  for (const subcategory of category.subcategories ?? []) {
    VALID_LISTING_KEYS.add(`${category.id}/${subcategory.id}`);

    for (const brand of subcategory.brands ?? []) {
      VALID_LISTING_KEYS.add(`${category.id}/${subcategory.id}/${brand.id}`);
    }
  }
}

const VALID_CITY_IDS = new Set(CITIES_IDS);

function finalize(
  pages: Map<string, { count: number; lastmod?: string }>,
  minCount: number,
): ListingPage[] {
  return [...pages.entries()]
    .filter(([, page]) => page.count >= minCount)
    .map(([path, page]) => ({ path, count: page.count, lastmod: page.lastmod }))
    .sort((a, b) => a.path.localeCompare(b.path));
}

/** Ключ 'cat/sub/brand' уровня строки; null — строка невалидна для URL. */
function listingKey(row: RpcRow): string | null {
  const withCity = !(row.mask & 8);
  const withCategory = !(row.mask & 4);
  const withSubcategory = !(row.mask & 2);
  const withBrand = !(row.mask & 1);

  // страница города без категории
  if (withCity && !withCategory) {
    return row.city ? '' : null;
  }

  if (!row.category) return null;

  let key = row.category;

  if (withSubcategory) {
    if (!row.subcategory) return null;

    key += `/${row.subcategory}`;

    if (withBrand) {
      if (!row.brand) return null;

      key += `/${row.brand}`;
    }
  }

  return VALID_LISTING_KEYS.has(key) ? key : null;
}

function fromRpc(rows: RpcRow[], minCount: number): ListingPage[] {
  const pages = new Map<string, { count: number; lastmod?: string }>();

  for (const row of rows) {
    const key = listingKey(row);

    if (key === null) continue;

    let base = '/all';

    if (!(row.mask & 8)) {
      const cityId = getCityIdByName(row.city ?? '');

      if (!cityId || cityId === 'all' || !VALID_CITY_IDS.has(cityId)) continue;

      base = `/${cityId}`;
    }

    pages.set(key ? `${base}/${key}` : base, {
      count: Number(row.n),
      lastmod: row.last_updated ?? undefined,
    });
  }

  return finalize(pages, minCount);
}

/**
 * Живые страницы листингов: не декартово произведение справочников,
 * а реальные комбинации из открытых объявлений с порогом наполненности.
 * Агрегация — в базе (get_listing_pages, GROUPING SETS), масштабируется
 * до миллионов постов.
 */
export async function getListingPages(
  client: SupabaseClient,
  minCount: number = MIN_POSTS_TO_INDEX,
): Promise<ListingPage[]> {
  const { data, error } = await client.rpc('get_listing_pages');

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return fromRpc((data ?? []) as RpcRow[], minCount);
}
