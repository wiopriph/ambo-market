import type { H3Event } from 'h3';


export type BlogArticle = {
  path: string;
  title: string;
  description?: string | null;
};

type AssetsBinding = { fetch(request: Request): Promise<Response> };

type CloudflareContext = { cloudflare?: { env?: { ASSETS?: AssetsBinding } } };

/**
 * Статьи блога для серверных маршрутов (llms.txt).
 *
 * В Workers у @nuxt/content нет базы (queryCollection падает с ошибкой
 * в логах), поэтому там список читается из пререндеренного
 * /__llms__/blog.json через binding статики (ASSETS в wrangler.jsonc).
 * Локально и в node - напрямую из коллекции. При любом сбое - пустой список.
 */
export async function getBlogArticles(event: H3Event): Promise<BlogArticle[]> {
  const assets = (event.context as CloudflareContext).cloudflare?.env?.ASSETS;

  try {
    if (!assets) {
      return await queryCollection(event, 'blog')
        .select('path', 'title', 'description')
        .order('date', 'DESC')
        .all();
    }

    const url = new URL('/__llms__/blog.json', getRequestURL(event).origin);
    const response = await assets.fetch(new Request(url.toString()));

    if (!response.ok) {
      return [];
    }

    const rows = await response.json() as BlogArticle[];

    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}
