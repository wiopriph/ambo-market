import type { SitemapUrlInput } from '#sitemap/types';
import { serverSupabaseServiceRole } from '#supabase/server';
import { getListingPages } from '~~/server/utils/listingPages';


/**
 * Листинги (город/категория/подкатегория/бренд) — только реально
 * наполненные комбинации из базы, не декартово произведение справочников.
 */
export default defineSitemapEventHandler(async (event) => {
  const pages = await getListingPages(serverSupabaseServiceRole(event));

  return pages.map(page => ({
    loc: page.path,
    lastmod: page.lastmod,
  })) as SitemapUrlInput[];
});
