/**
 * Self-canonical на каждой странице.
 *
 * Из query в canonical попадает только page (и только при page > 1):
 * страницы с фильтрами и поиском канонизируются на чистый URL листинга.
 * `/all` — дубль главной, канонизируется на `/`.
 */
export default defineNuxtPlugin(() => {
  const route = useRoute();
  const config = useRuntimeConfig();

  const href = computed(() => {
    const base = (config.public.appBaseUrl || 'https://ambo.market').replace(/\/$/, '');

    let path = route.path !== '/' ? route.path.replace(/\/$/, '') : '/';

    if (path === '/all') {
      path = '/';
    }

    const page = Number(route.query.page);
    const pageSuffix = Number.isInteger(page) && page > 1 ? `?page=${page}` : '';

    return `${base}${path}${pageSuffix}`;
  });

  useHead({
    link: [{ rel: 'canonical', href }],
  });
});
