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

const seo = computed(() => {
  const searchQuery = getFilter('q');
  const city = locationName.value;

  if (searchQuery) {
    if (isPriorityCity.value) {
      return {
        h1: `Resultados para «${searchQuery}» em ${city} – Compre ou Venda`,
        title: `${searchQuery} em ${city} – Anúncios de Particulares e Empresas | Ambo Market`,
        description: `Veja anúncios de ${searchQuery} em ${city}: produtos novos e segunda mão, com fotos, preços e avaliações. Compre ou venda com segurança no Ambo Market.`,
      };
    }

    return {
      h1: `Resultados para «${searchQuery}» – Compre ou Venda Agora`,
      title: `${searchQuery} à Venda em Angola – Melhores Ofertas | Ambo Market`,
      description: `Anúncios de ${searchQuery} em toda Angola – Luanda, Benguela, Huambo e mais. Produtos novos e usados de particulares e empresas. Publique grátis no Ambo Market.`,
    };
  }

  if (isPriorityCity.value) {
    return {
      h1: `Compre e Venda em ${city} – Todos os Anúncios`,
      title: `Classificados em ${city} – Carros, Imóveis, Emprego, Electrónicos | Ambo Market`,
      description: `Encontre ou publique anúncios em ${city}: carros novos e usados, imóveis para alugar ou comprar, emprego, electrónicos, serviços e roupas. Grátis no Ambo Market!`,
    };
  }

  return {
    h1: 'Compre e Venda Online – Todos os Classificados',
    title: 'Classificados Grátis em Angola – Carros, Imóveis, Emprego | Ambo Market',
    description: 'Compre e venda em Angola: carros, motos, imóveis, smartphones, emprego, roupas e serviços. Milhares de anúncios grátis de particulares e empresas. Negocie com segurança.',
  };
});

const config = useRuntimeConfig();

const canonicalLink = computed(() =>
  cityId.value === 'all' ?
    [{ rel: 'canonical', href: config?.public?.appBaseUrl }] :
    [],
);

useHead({
  title: seo.value.title,
  meta: [
    { key: 'og:title', property: 'og:title', content: seo.value.title },
    { key: 'twitter:title', property: 'twitter:title', content: seo.value.title },
    { key: 'description', name: 'description', content: seo.value.description },
    { key: 'og:description', property: 'og:description', content: seo.value.description },
    { key: 'twitter:description', property: 'twitter:description', content: seo.value.description },
  ],
  link: canonicalLink.value,
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

    <UITextRoll v-if="page === 1">
      <SeoHomeText :cityId="cityId" />
    </UITextRoll>
  </div>
</template>
