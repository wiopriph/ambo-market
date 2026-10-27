/**
 * Список статей блога для /llms.txt. Пререндерится при сборке
 * (nitro.prerender.routes): в Workers базы контента нет.
 */
export default defineEventHandler(async (event) => {
  const rows = await queryCollection(event, 'blog')
    .select('path', 'title', 'description')
    .order('date', 'DESC')
    .all();

  return rows;
});
