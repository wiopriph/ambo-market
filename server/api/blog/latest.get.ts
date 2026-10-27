import { getBlogArticles } from '~~/server/utils/blogArticles';


const MAX_ARTICLES = 3;

/** Свежие статьи для тизера на главной; ответ кэшируется, чтобы не ходить в D1 на каждый рендер. */
export default defineCachedEventHandler(async (event) => {
  const articles = await getBlogArticles(event);
  const news = articles.find(article => article.tags?.includes('Novidades'));
  const rest = articles.filter(article => article !== news).slice(0, MAX_ARTICLES - (news ? 1 : 0));

  return (news ? [news, ...rest] : rest).map(({ path, title, date, tags }) => ({
    path,
    title,
    date,
    isNews: Boolean(tags?.includes('Novidades')),
  }));
}, {
  maxAge: 60 * 60,
  swr: true,
  name: 'blog-latest',
  getKey: () => 'latest',
});
