import type { SitemapUrlInput } from '#sitemap/types';


/** Статические страницы. */
export default defineSitemapEventHandler(() => [
  '/',
  '/cities',
  '/blog',
  '/about',
  '/terms',
  '/privacy',
].map(loc => ({ loc })) as SitemapUrlInput[]);
