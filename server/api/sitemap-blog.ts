import type { SitemapUrlInput } from '#sitemap/types';


export default defineSitemapEventHandler(async (event) => {
  const articles = await queryCollection(event, 'blog').all();

  return articles.map(article => ({
    loc: article.path,
    // lastmod: article.updatedAt,
    changefreq: 'weekly',
    priority: 0.7,
  })) as SitemapUrlInput[];
});
