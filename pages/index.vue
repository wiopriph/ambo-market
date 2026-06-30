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
        title: `${searchQuery} em ${city} – Compre Novo e Usado com os Melhores Preços | Ambo Market`,
        description: `Encontre «${searchQuery}» em ${city}: anúncios de particulares e empresas com fotos, preços e avaliações. Compre, venda e negocie com segurança no Ambo Market.`,
      };
    }

    return {
      h1: `Resultados para «${searchQuery}»`,
      title: `${searchQuery} à venda em Angola – Classificados Grátis | Ambo Market`,
      description: `Veja anúncios de «${searchQuery}» em toda Angola: Luanda, Benguela, Huambo e mais. Compre novo ou usado com segurança. Publique o seu anúncio grátis no Ambo Market.`,
    };
  }

  if (isPriorityCity.value) {
    return {
      h1: `Compra e venda em ${city}`,
      title: `Classificados em ${city} – Carros, Imóveis, Emprego e Mais | Ambo Market`,
      description: `Compre e venda em ${city}: carros, imóveis, electrónicos, roupas, emprego e serviços. Anúncios grátis de particulares e empresas. Publique o seu no Ambo Market!`,
    };
  }

  return {
    h1: 'Compra e venda em toda Angola',
    title: 'Classificados em Angola – Carros, Imóveis, Emprego | Anuncie Grátis | Ambo Market',
    description: 'Marketplace de classificados grátis em Angola: carros novos e usados, imóveis, electrónicos, emprego, serviços e muito mais. Compre, venda e negocie online com segurança.',
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
  <div class="space-y-4">
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

    <UITextRoll v-if="page === 1">
      <SeoHomeText :cityId="cityId" />
    </UITextRoll>
  </div>
</template>
