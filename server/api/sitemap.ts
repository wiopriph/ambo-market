import type { SitemapUrlInput } from '#sitemap/types';
import { CITIES_IDS } from '~/constants/cities';
import { TYPES } from '~/constants/categories';


export default defineSitemapEventHandler(() => {
  const routes = [] as SitemapUrlInput[];

  CITIES_IDS.forEach((cityId) => {
    TYPES.forEach((categoryId) => {
      routes.push({
        _sitemap: cityId,
        loc: `/${cityId}/${categoryId}`,
        changefreq: 'daily',
        priority: 1,
        lastmod: new Date().toISOString(),
      });
    });
  });

  return routes;
});
