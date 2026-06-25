<script setup lang="ts">
import { CATEGORIES } from '~/constants/categories';
import { usePosts } from '~/composables/usePosts';
import { MAX_POSTS_PER_PAGE } from '~/composables/usePosts/constants';


definePageMeta({
  middleware: 'set-filters-middleware',
});

const {
  cityId,
  isPriorityCity,
  locationName,
  page,
  getFilter,
  fetchPosts,
  isLoading,
} = usePosts();

const seo = computed(() => {
  const searchQuery = getFilter('q');
  const city = locationName.value;

  if (searchQuery) {
    if (isPriorityCity.value) {
      return {
        h1: `Resultados para «${searchQuery}» em ${city}`,
        title: `${searchQuery} em ${city} – Compre com os melhores preços | Ambo Market`,
        description: `Veja anúncios para «${searchQuery}» em ${city} – ofertas com fotos e avaliações. Compre e venda com praticidade no Ambo Market.`,
      };
    }

    return {
      h1: `Resultados para «${searchQuery}»`,
      title: `${searchQuery} à venda – Melhores ofertas em Angola | Ambo Market`,
      description: `Encontre anúncios de «${searchQuery}» em toda Angola. Compre com confiança – com fotos e avaliações de vendedores. Ambo Market é fácil e seguro.`,
    };
  }

  if (isPriorityCity.value) {
    return {
      h1: `Compra e venda em ${city}`,
      title: `Classificados em ${city} – Anúncios Grátis de Compra e Venda | Ambo Market`,
      description: `Veja anúncios em ${city} – produtos diversos para comprar ou vender. Publique seu anúncio grátis e negocie localmente no Ambo Market.`,
    };
  }

  return {
    h1: 'Compra e venda em toda Angola',
    title: 'Classificados em Angola – Anuncie Grátis | Ambo Market',
    description: 'Classificados gratuitos em Angola – compre, venda e negocie com facilidade em todo o país. Encontre ofertas e publique anúncios grátis no Ambo Market.',
  };
});

useHead({
  title: seo.value.title,
  meta: [
    { key: 'og:title', property: 'og:title', content: seo.value.title },
    { key: 'twitter:title', property: 'twitter:title', content: seo.value.title },
    { key: 'description', name: 'description', content: seo.value.description },
    { key: 'og:description', property: 'og:description', content: seo.value.description },
    { key: 'twitter:description', property: 'twitter:description', content: seo.value.description },
  ],
});

const categories = computed(() => CATEGORIES.map(category => ({
  title: category.name,
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
  { watch: [() => route.query] },
);


const totalPages = computed(() => {
  const postsCount = posts.value?.resultsCount ?? 0;

  return Math.ceil(postsCount / MAX_POSTS_PER_PAGE);
});

const hasPagination = computed(() => totalPages.value > 1);

const setPage = (pageNumber: number) => {
  navigateTo({ query: { ...route.query, page: pageNumber } });
};
</script>

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
      <UPagination
        :page="page"
        :total="totalPages * MAX_POSTS_PER_PAGE"
        :itemsPerPage="MAX_POSTS_PER_PAGE"
        @update:page="setPage"
      />
    </div>
  </div>
</template>
