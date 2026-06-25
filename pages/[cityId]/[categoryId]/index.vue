<script setup lang="ts">
import { usePosts } from '~/composables/usePosts';
import { MAX_POSTS_PER_PAGE } from '~/composables/usePosts/constants';
import { getCityById } from '~/constants/cities';
import { CATEGORIES, getCategoryName } from '~/constants/categories';


definePageMeta({
  middleware: [
    'validate-city',
    'validate-category',
    'set-city-middleware',
    'set-filters-middleware',
  ],
});

type SeoEntry = { h1: string; title: string; description: string };

const SEARCH_SEO = {
  city: {
    h1: 'Anúncios para «{q}» em {city}',
    title: '{q} em {city} com os Melhores Preços | Ambo Market',
    description: 'Veja anúncios para {q} em {city}. Compre ou venda com fotos, avaliações e preços acessíveis 💸 em toda Angola. Publique grátis no Ambo Market.',
  },
  everywhere: {
    h1: 'Anúncios para «{q}»',
    title: '{q} com os Melhores Preços | Ambo Market',
    description: 'Encontre ofertas para {q} em todo o país. Produtos novos e usados 🤩 com avaliações 💬 e vendedores confiáveis. Anuncie gratuitamente.',
  },
};

const CATEGORY_SEO: Record<string, { city: SeoEntry; everywhere: SeoEntry }> = {
  vehicles: {
    city: {
      h1: 'Veículos à venda em {city}',
      title: 'Comprar e vender carros, motos e caminhões em {city} | Ambo Market',
      description: 'Encontre veículos novos e usados, incluindo carros, motos e caminhões. Compare preços e conecte-se com vendedores verificados. Veja anúncios em {city}, entre em contato ou publique seu anúncio grátis.',
    },
    everywhere: {
      h1: 'Veículos à venda',
      title: 'Comprar e vender carros, motos e caminhões em Angola | Ambo Market',
      description: 'Encontre veículos novos e usados, incluindo carros, motos e caminhões. Compare preços e conecte-se com vendedores verificados. Veja anúncios em Angola, entre em contato ou publique seu anúncio grátis.',
    },
  },
  'real-estate': {
    city: {
      h1: 'Imóveis para venda ou aluguel em {city}',
      title: 'Encontre casas, apartamentos e terrenos em {city} | Ambo Market',
      description: 'Explore ofertas de imóveis – casas, apartamentos, terrenos e imóveis comerciais. Veja anúncios em {city} ou publique sua oferta gratuitamente.',
    },
    everywhere: {
      h1: 'Imóveis para venda ou aluguel',
      title: 'Encontre casas, apartamentos e terrenos em Angola | Ambo Market',
      description: 'Explore ofertas de imóveis – casas, apartamentos, terrenos e imóveis comerciais. Veja anúncios em Angola ou publique sua oferta gratuitamente.',
    },
  },
  electronics: {
    city: {
      h1: 'Eletrônicos em {city}',
      title: 'Comprar e vender celulares, laptops, TVs e mais em {city} | Ambo Market',
      description: 'Encontre os melhores eletrônicos – celulares, laptops, TVs e áudio com ótimos preços. Veja anúncios em {city} ou publique sua oferta grátis.',
    },
    everywhere: {
      h1: 'Eletrônicos',
      title: 'Comprar e vender celulares, laptops, TVs e mais em Angola | Ambo Market',
      description: 'Encontre os melhores eletrônicos – celulares, laptops, TVs e áudio com ótimos preços. Veja anúncios em Angola ou publique sua oferta grátis.',
    },
  },
  fashion: {
    city: {
      h1: 'Roupas e moda em {city}',
      title: 'Compre e venda roupas, calçados e acessórios em {city} | Ambo Market',
      description: 'Descubra moda masculina, feminina e infantil. Roupas, calçados, bolsas e mais. Veja anúncios em {city} ou publique sua oferta gratuita.',
    },
    everywhere: {
      h1: 'Roupas e moda',
      title: 'Compre e venda roupas, calçados e acessórios em Angola | Ambo Market',
      description: 'Descubra moda masculina, feminina e infantil. Roupas, calçados, bolsas e mais. Veja anúncios em Angola ou publique sua oferta gratuita.',
    },
  },
  jobs: {
    city: {
      h1: 'Encontre um emprego em {city}',
      title: 'Vagas de trabalho e oportunidades em {city} | Ambo Market',
      description: 'Pesquise vagas ou publique oportunidades. Tempo integral, meio período ou freelance. Veja anúncios em {city} ou publique sua oferta gratuitamente.',
    },
    everywhere: {
      h1: 'Encontre um emprego',
      title: 'Vagas de trabalho e oportunidades em Angola | Ambo Market',
      description: 'Pesquise vagas ou publique oportunidades. Tempo integral, meio período ou freelance. Veja anúncios em Angola ou publique sua oferta gratuitamente.',
    },
  },
  services: {
    city: {
      h1: 'Serviços locais em {city}',
      title: 'Contrate ou ofereça serviços: Limpeza, consertos, beleza e mais em {city} | Ambo Market',
      description: 'Ofereça ou contrate serviços como construção, beleza, aulas, entregas e mais. Veja anúncios em {city} ou publique sua oferta grátis.',
    },
    everywhere: {
      h1: 'Serviços locais',
      title: 'Contrate ou ofereça serviços: Limpeza, consertos, beleza e mais em Angola | Ambo Market',
      description: 'Ofereça ou contrate serviços como construção, beleza, aulas, entregas e mais. Veja anúncios em Angola ou publique sua oferta grátis.',
    },
  },
  animals: {
    city: {
      h1: 'Animais e pets em {city}',
      title: 'Compre ou venda pets, gado e suprimentos em {city} | Ambo Market',
      description: 'Veja anúncios de pets, animais de fazenda e acessórios. Comida, gaiolas, produtos e mais. Veja anúncios em {city} ou publique o seu gratuitamente.',
    },
    everywhere: {
      h1: 'Animais e pets',
      title: 'Compre ou venda pets, gado e suprimentos em Angola | Ambo Market',
      description: 'Veja anúncios de pets, animais de fazenda e acessórios. Comida, gaiolas, produtos e mais. Veja anúncios em Angola ou publique o seu gratuitamente.',
    },
  },
  hobby: {
    city: {
      h1: 'Hobbies e lazer em {city}',
      title: 'Compre ou venda esportes, música e colecionáveis em {city} | Ambo Market',
      description: 'Instrumentos musicais, jogos, equipamentos esportivos e itens colecionáveis. Veja anúncios em {city} ou publique sua oferta grátis.',
    },
    everywhere: {
      h1: 'Hobbies e lazer',
      title: 'Compre ou venda esportes, música e colecionáveis em Angola | Ambo Market',
      description: 'Instrumentos musicais, jogos, equipamentos esportivos e itens colecionáveis. Veja anúncios em Angola ou publique sua oferta grátis.',
    },
  },
  kids: {
    city: {
      h1: 'Itens infantis em {city}',
      title: 'Compre ou venda brinquedos, roupas e móveis infantis em {city} | Ambo Market',
      description: 'Aproveite ofertas em brinquedos, roupas infantis, carrinhos e berços. Ideal para famílias. Veja anúncios em {city} ou publique sua oferta gratuitamente.',
    },
    everywhere: {
      h1: 'Itens infantis',
      title: 'Compre ou venda brinquedos, roupas e móveis infantis em Angola | Ambo Market',
      description: 'Aproveite ofertas em brinquedos, roupas infantis, carrinhos e berços. Ideal para famílias. Veja anúncios em Angola ou publique sua oferta gratuitamente.',
    },
  },
  home: {
    city: {
      h1: 'Casa e jardim em {city}',
      title: 'Compre ou venda móveis, ferramentas e decoração em {city} | Ambo Market',
      description: 'Renove sua casa com móveis, eletrodomésticos, ferramentas e decoração. Veja anúncios em {city} ou publique sua oferta gratuita.',
    },
    everywhere: {
      h1: 'Casa e jardim',
      title: 'Compre ou venda móveis, ferramentas e decoração em Angola | Ambo Market',
      description: 'Renove sua casa com móveis, eletrodomésticos, ferramentas e decoração. Veja anúncios em Angola ou publique sua oferta gratuita.',
    },
  },
};

const fill = (str: string, vars: Record<string, string>) =>
  str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? _);

const {
  cityId,
  categoryId,
  locationName,
  isPriorityCity,
  page,
  isLoading,
  fetchPosts,
  getFilter,
} = usePosts();

const route = useRoute();

const subcategories = computed(() => {
  const list = CATEGORIES.find(category => category.id === categoryId.value)?.subcategories || [];

  return list.map(sub => ({
    title: sub.name,
    icon: sub.icon,
    route: {
      name: 'cityId-categoryId-subcategoryId',
      params: {
        categoryId: categoryId.value,
        subcategoryId: sub.id,
        cityId: cityId.value,
      },
    },
  }));
});

const breadcrumbs = computed(() => {
  const items = [];

  if (isPriorityCity.value) {
    const city = getCityById(cityId.value);

    items.push({
      title: city?.name || 'Página inicial',
      to: { name: 'cityId', params: { cityId: cityId.value } },
    });
  } else {
    items.push({ title: 'Página inicial', to: { name: 'index' } });
  }

  const catId = route.params.categoryId as string;
  const searchQuery = getFilter('q');

  if (searchQuery) {
    items.push({
      title: getCategoryName(catId),
      to: { name: 'cityId-categoryId', params: { categoryId: catId, cityId: cityId.value } },
    });

    items.push({ title: searchQuery });
  } else {
    items.push({ title: getCategoryName(catId) });
  }

  return items;
});

const seo = computed(() => {
  const searchQuery = getFilter('q');
  const city = locationName.value;
  const catId = route.params.categoryId as string;

  if (searchQuery) {
    const entry = isPriorityCity.value ? SEARCH_SEO.city : SEARCH_SEO.everywhere;

    return {
      h1: fill(entry.h1, { q: searchQuery, city }),
      title: fill(entry.title, { q: searchQuery, city }),
      description: fill(entry.description, { q: searchQuery, city }),
    };
  }

  const catSeo = CATEGORY_SEO[catId];
  const entry = isPriorityCity.value ? catSeo?.city : catSeo?.everywhere;
  const text = entry ?? { h1: getCategoryName(catId), title: getCategoryName(catId), description: '' };

  return {
    h1: fill(text.h1, { city }),
    title: fill(text.title, { city }),
    description: fill(text.description, { city }),
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

useHead({ title: title.value, meta: meta.value });


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

const top3Post = computed(() => {
  if (posts.value?.posts) {
    return posts.value?.posts.slice(0, 3)
      .map(item => item.title);
  }

  return [];
});
</script>

<template>
  <div class="mx-auto px-4 sm:px-5 py-4 sm:py-6 space-y-4">
    <UIBreadcrumbs
      :items="breadcrumbs"
      class="hidden sm:flex"
    />

    <h1
      class="text-lg font-bold text-highlighted"
      v-text="seo.h1"
    />


    <CategoryPills :list="subcategories" />

    <div class="space-y-4">
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
        <SeoCategoryText
          :title="seo.h1"
          :cityId="cityId"
          :categoryId="categoryId"
          :productList="top3Post"
        />
      </UITextRoll>
    </div>
  </div>
</template>
