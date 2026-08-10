/**
 * Глобальные SEO-теги: canonical, og:url и дефолты Open Graph.
 *
 * Canonical — self-canonical на каждой странице. Из query сохраняется
 * только page (и только при page > 1): страницы с фильтрами и поиском
 * канонизируются на чистый URL листинга. `/all` — дубль главной,
 * канонизируется на `/`.
 *
 * Og-дефолты заданы с теми же key, что используют страницы, — страница,
 * объявившая свой тег (og:image товара, og:type статьи), переопределяет
 * дефолт за счёт дедупликации unhead.
 */
export default defineNuxtPlugin(() => {
  const route = useRoute();
  const config = useRuntimeConfig();

  const base = computed(() => (config.public.appBaseUrl || 'https://ambo.market').replace(/\/$/, ''));

  const href = computed(() => {
    let path = route.path !== '/' ? route.path.replace(/\/$/, '') : '/';

    if (path === '/all') {
      path = '/';
    }

    const page = Number(route.query.page);
    const pageSuffix = Number.isInteger(page) && page > 1 ? `?page=${page}` : '';

    return `${base.value}${path}${pageSuffix}`;
  });

  const defaultImage = computed(() => `${base.value}/og-image.png`);

  useHead({
    link: [{ rel: 'canonical', href }],
    meta: [
      { key: 'og:url', property: 'og:url', content: href },
      { key: 'og:site_name', property: 'og:site_name', content: 'Ambo Market' },
      { key: 'og:locale', property: 'og:locale', content: 'pt_AO' },
      { key: 'og:type', property: 'og:type', content: 'website' },
      { key: 'og:image', property: 'og:image', content: defaultImage },
      { key: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
    ],
  });
});
