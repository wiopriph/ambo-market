import type { SitemapUrlInput } from '#sitemap/types';
import { CITIES_IDS } from '~/constants/cities';
import { CATEGORIES } from '~/constants/categories';


export default defineSitemapEventHandler(() => {
  const routes: SitemapUrlInput[] = [];

  CITIES_IDS.forEach((cityId) => {
    CATEGORIES.forEach((category) => {
      routes.push({
        _sitemap: cityId,
        loc: `/${cityId}/${category.id}`,
        changefreq: 'daily',
        priority: 1,
        lastmod: new Date().toISOString(),
      });

      category.subcategories?.forEach((subcategory) => {
        routes.push({
          _sitemap: cityId,
          loc: `/${cityId}/${category.id}/${subcategory.id}`,
          changefreq: 'daily',
          priority: 0.9,
          lastmod: new Date().toISOString(),
        });

        subcategory.brands?.forEach((brand) => {
          routes.push({
            _sitemap: cityId,
            loc: `/${cityId}/${category.id}/${subcategory.id}/${brand.id}`,
            changefreq: 'weekly',
            priority: 0.8,
            lastmod: new Date().toISOString(),
          });
        });
      });
    });
  });

  return routes;
});
