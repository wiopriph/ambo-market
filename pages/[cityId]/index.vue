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
        title: `Comprar ou Vender ${searchQuery} em ${city} com Bons Preços | Ambo Market`,
        description: `Veja anúncios de ${searchQuery} em ${city}: produtos novos e usados, com fotos e bons preços. O Ambo Market conecta compradores e vendedores em Angola.`,
      };
    }

    return {
      h1: `Resultados para «${searchQuery}» – Compre ou Venda Agora`,
      title: `Comprar ou Vender ${searchQuery} Online com Bons Preços | Ambo Market`,
      description: `Busque anúncios de ${searchQuery} em toda Angola. Encontre ofertas incríveis e publique seu anúncio grátis. Ambo Market é o jeito mais fácil e seguro de negociar online.`,
    };
  }

  if (isPriorityCity.value) {
    return {
      h1: `Compre e Venda em ${city} – Todos os Anúncios`,
      title: `Comprar, Vender e Anunciar Grátis em ${city} | Ambo Market`,
      description: `Compre e venda produtos em ${city} – eletrônicos, veículos, roupas, serviços e muito mais. Anúncios grátis para todos. Publique o seu no Ambo Market agora!`,
    };
  }

  return {
    h1: 'Compre e Venda Online – Todos os Classificados',
    title: 'Comprar, Vender e Anunciar Grátis em Angola | Ambo Market',
    description: 'Veja milhares de anúncios gratuitos para vender ou comprar qualquer coisa em Angola. Publique grátis. Encontre ótimos negócios com segurança no Ambo Market.',
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
  </div>
</template>
