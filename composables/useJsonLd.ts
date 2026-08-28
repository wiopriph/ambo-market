import type { RouteLocationRaw } from 'vue-router';
import { getPostRoute } from '~/utils/getPostRoute';


type BreadcrumbInput = {
  title: string;
  to?: RouteLocationRaw;
};

type ItemListPost = {
  id: string;
  title?: string | null;
  categoryId?: string | null;
  subcategoryId?: string | null;
  brandId?: string | null;
  location?: { cityId?: string | null } | null;
};

/**
 * Хелперы для JSON-LD (schema.org).
 *
 * Каждый хелпер возвращает объект-сущность без @context —
 * его добавляет jsonLdScript, собирая одну <script type="application/ld+json">.
 */
export function useJsonLd() {
  const router = useRouter();
  const config = useRuntimeConfig();

  const base = (config.public.appBaseUrl || 'https://ambo.market').replace(/\/$/, '');

  const absoluteUrl = (to: RouteLocationRaw) => `${base}${router.resolve(to).path}`;

  const organization = () => ({
    '@type': 'Organization',
    '@id': `${base}/#organization`,
    name: 'Ambo Market',
    url: `${base}/`,
    logo: `${base}/icon-logo.svg`,
    description: 'Marketplace de classificados grátis em Angola.',
    areaServed: { '@type': 'Country', name: 'Angola' },
    sameAs: [
      'https://www.facebook.com/ambo.market',
      'https://www.instagram.com/ambo.market',
      'https://www.youtube.com/@ambo.market',
    ],
  });

  const webSite = () => ({
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    name: 'Ambo Market',
    url: `${base}/`,
    inLanguage: 'pt-AO',
    publisher: { '@id': `${base}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${base}/all?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  });

  const breadcrumbList = (items: BreadcrumbInput[]) => ({
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      ...(item.to ? { item: absoluteUrl(item.to) } : {}),
    })),
  });

  const productItemList = (posts: ItemListPost[]) => ({
    '@type': 'ItemList',
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: post.title ?? undefined,
      url: absoluteUrl(getPostRoute({
        productId: post.id,
        categoryId: post.categoryId ?? '',
        subcategoryId: post.subcategoryId ?? undefined,
        brandId: post.brandId ?? undefined,
        cityId: post.location?.cityId ?? 'all',
      })),
    })),
  });

  // key обязателен: без него unhead не дедуплицирует скрипт
  // при повторном выполнении setup (SSR) и обновлении реактивных данных
  const jsonLdScript = (...entities: object[]) => ({
    key: 'jsonld',
    type: 'application/ld+json',
    innerHTML: JSON.stringify(
      entities.length === 1 ?
        { '@context': 'https://schema.org', ...entities[0] } :
        entities.map(entity => ({ '@context': 'https://schema.org', ...entity })),
    ),
  });

  return {
    absoluteUrl,
    organization,
    webSite,
    breadcrumbList,
    productItemList,
    jsonLdScript,
  };
}
