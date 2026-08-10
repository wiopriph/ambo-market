import type { SitemapUrlInput } from '#sitemap/types';
import { CITIES_IDS } from '~/constants/cities';
import { CATEGORIES } from '~/constants/categories';


export default defineSitemapEventHandler(() => {
  const routes: SitemapUrlInput[] = [];

  CITIES_IDS.forEach((cityId) => {
    routes.push({
      loc: cityId === 'all' ? '/' : `/${cityId}`,
      changefreq: 'daily',
      priority: 1,
    });

    CATEGORIES.forEach((category) => {
      routes.push({
        loc: `/${cityId}/${category.id}`,
        changefreq: 'daily',
        priority: 0.9,
      });

      category.subcategories?.forEach((subcategory) => {
        routes.push({
          loc: `/${cityId}/${category.id}/${subcategory.id}`,
          changefreq: 'daily',
          priority: 0.8,
        });

        subcategory.brands?.forEach((brand) => {
          routes.push({
            loc: `/${cityId}/${category.id}/${subcategory.id}/${brand.id}`,
            changefreq: 'weekly',
            priority: 0.7,
          });
        });
      });
    });
  });

  return routes;
});
