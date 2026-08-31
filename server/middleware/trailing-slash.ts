/**
 * /luanda/ и /luanda — для Google это разные URL. Канонизируем 301-м
 * на вариант без слэша (кроме корня); query сохраняется.
 */
export default defineEventHandler((event) => {
  const url = getRequestURL(event);

  if (url.pathname.length > 1 && url.pathname.endsWith('/') && !url.pathname.startsWith('/api/')) {
    return sendRedirect(event, url.pathname.replace(/\/+$/, '') + url.search, 301);
  }
});
