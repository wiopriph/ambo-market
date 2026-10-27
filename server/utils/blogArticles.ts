import type { H3Event } from 'h3';


export type BlogArticle = {
  path: string;
  title: string;
  description?: string | null;
  date: string;
  tags?: string[] | null;
};

/** Статьи блога от новых к старым для серверных маршрутов; при сбое базы - пустой список. */
export async function getBlogArticles(event: H3Event): Promise<BlogArticle[]> {
  try {
    return await queryCollection(event, 'blog')
      .select('path', 'title', 'description', 'date', 'tags')
      .order('date', 'DESC')
      .all() as BlogArticle[];
  } catch {
    return [];
  }
}
