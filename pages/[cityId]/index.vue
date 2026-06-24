<script setup lang="ts">
import { CATEGORIES } from '~/constants/categories';
import { usePosts } from '~/composables/usePosts';
import { MAX_POSTS_PER_PAGE } from '~/composables/usePosts/constants';


definePageMeta({
  middleware: [
    'validate-city',
    'set-city-middleware',
    'set-filters-middleware',
  ],
});


const {
  cityId,
  locationName,
  isPriorityCity,
  page,
  getFilter,
  fetchPosts,
  isLoading,
} = usePosts();

const { t } = useI18n();

const seo = computed(() => {
  const searchQuery = getFilter('q');

  let translationKey;

  if (searchQuery) {
    translationKey = isPriorityCity.value ? 'search.withCity' : 'search.withoutCity';
  } else {
    translationKey = isPriorityCity.value ? 'default.withCity' : 'default.withoutCity';
  }

  return {
    h1: t(`${translationKey}.h1`, { city: locationName.value, q: searchQuery }),
    title: t(`${translationKey}.title`, { city: locationName.value, q: searchQuery }),
    description: t(`${translationKey}.description`, { city: locationName.value, q: searchQuery }),
  };
});

const title = computed(() => seo.value.title);

const meta = computed(() => [
  { key: 'og:title', property: 'og:title', content: seo.value.title },
  { key: 'twitter:title', property: 'twitter:title', content: seo.value.title },
  { key: 'description', name: 'description', content: seo.value.description },
  { key: 'og:description', property: 'og:description', content: seo.value.description },
  { key: 'twitter:description', property: 'twitter:description', content: seo.value.description },
]);

const config = useRuntimeConfig();

const canonicalLink = computed(() =>
  cityId.value === 'all' ?
    [{ rel: 'canonical', href: config?.public?.appBaseUrl }] :
    [],
);

useHead({
  title: title.value,
  meta: meta.value,
  link: canonicalLink.value,
});

const categories = computed(() => CATEGORIES.map(category => ({
  title: t(category.key),
  icon: category.icon,
  route: {
    name: 'cityId-categoryId',
    params: {
      categoryId: category.id,
      cityId: cityId.value,
    },
  },
})));

const route = useRoute();

const { data: posts } = await useAsyncData(
  () => `posts:${route.fullPath}`,
  () => fetchPosts(),
  { watch: [() => [route.query, route.params]] },
);


const totalPages = computed(() => {
  const postsCount = posts.value?.resultsCount || 0;

  return Math.ceil(postsCount / MAX_POSTS_PER_PAGE);
});

const hasPagination = computed(() => totalPages.value > 1);


const setPage = (pageNumber: number) => {
  navigateTo({ query: { ...route.query, page: pageNumber } });
};
</script>

<i18n lang="json">
{
  "en": {
    "default": {
      "withCity": {
        "h1": "Buy and Sell in {city} – All Classified Ads",
        "title": "Buy, Sell & Post Free Ads in {city} {'|'} Ambo Market",
        "description": "Buy and sell everything in {city} – from electronics and vehicles to clothing and services. Free classifieds for private sellers. Post your ad now on Ambo Market!"
      },
      "search_placeholder": "Search ads...",
      "withoutCity": {
        "h1": "Buy and Sell Online – All Classifieds",
        "title": "Buy, Sell & Post Free Ads {'|'} Ambo Market Angola",
        "description": "Browse thousands of classified ads – post your ad for free and sell anything fast! Ambo Market connects buyers and sellers across Angola with ease."
      }
    },
    "search": {
      "withCity": {
        "h1": "Results for «{q}» in {city} – Buy or Sell",
        "title": "Buy or Sell {q} in {city} at the Best Prices {'|'} Ambo Market",
        "description": "Looking for {q} in {city}? Explore new and used items with photos and trusted sellers. Ambo Market – Angola’s classifieds for safe and easy buying and selling."
      },
      "withoutCity": {
        "h1": "Results for «{q}» – Buy or Sell Now",
        "title": "Buy or Sell {q} Online at Great Prices {'|'} Ambo Market Angola",
        "description": "Search listings for {q} across Angola. Find great deals, used and new items, and post your own ads free. Ambo Market makes buying and selling simple and safe."
      }
    }
  },
  "pt": {
    "default": {
      "withCity": {
        "h1": "Compre e Venda em {city} – Todos os Anúncios",
        "title": "Comprar, Vender e Anunciar Grátis em {city} {'|'} Ambo Market",
        "description": "Compre e venda produtos em {city} – eletrônicos, veículos, roupas, serviços e muito mais. Anúncios grátis para todos. Publique o seu no Ambo Market agora!"
      },
      "search_placeholder": "Buscar anúncios...",
      "withoutCity": {
        "h1": "Compre e Venda Online – Todos os Classificados",
        "title": "Comprar, Vender e Anunciar Grátis em Angola {'|'} Ambo Market",
        "description": "Veja milhares de anúncios gratuitos para vender ou comprar qualquer coisa em Angola. Publique grátis. Encontre ótimos negócios com segurança no Ambo Market."
      }
    },
    "search": {
      "withCity": {
        "h1": "Resultados para «{q}» em {city} – Compre ou Venda",
        "title": "Comprar ou Vender {q} em {city} com Bons Preços {'|'} Ambo Market",
        "description": "Veja anúncios de {q} em {city}: produtos novos e usados, com fotos, avaliações e bons preços 💸. O Ambo Market conecta compradores e vendedores em Angola."
      },
      "withoutCity": {
        "h1": "Resultados para «{q}» – Compre ou Venda Agora",
        "title": "Comprar ou Vender {q} Online com Bons Preços {'|'} Ambo Market",
        "description": "Busque anúncios de {q} em toda Angola. Encontre ofertas incríveis e publique seu anúncio grátis. Ambo Market é o jeito mais fácil e seguro de negociar online."
      }
    }
  }
}
</i18n>

<template>
  <div class="mx-auto px-4 sm:px-5 py-4 sm:py-6 space-y-4">
    <h1
      class="text-lg font-bold text-highlighted"
      v-text="seo.h1"
    />

    <CategoryPills
      :list="categories"
      class="mb-6"
    />

    <ProductList
      :list="posts?.posts"
      :isLoading="isLoading"
    />

    <div
      v-if="hasPagination"
      class="flex justify-center"
    >
      <UIPagination
        :value="page"
        :max="totalPages"
        @input="setPage"
      />
    </div>
  </div>
</template>
