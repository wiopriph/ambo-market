import type { H3Event } from 'h3';


export type BlogArticle = {
  path: string;
  title: string;
  description?: string | null;
};

/** Статьи блога для серверных маршрутов (llms.txt); при сбое базы - пустой список. */
export async function getBlogArticles(event: H3Event): Promise<BlogArticle[]> {
  try {
    return await queryCollection(event, 'blog')
      .select('path', 'title', 'description')
      .order('date', 'DESC')
      .all();
  } catch {
    return [];
  }
}
