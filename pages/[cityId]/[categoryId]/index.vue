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
    title: '{q} em {city} – Anúncios de Particulares e Empresas | Ambo Market',
    description: 'Veja anúncios de {q} em {city}: novos e segunda mão, com fotos, preços e avaliações. Compre ou venda com segurança. Publique grátis no Ambo Market.',
  },
  everywhere: {
    h1: 'Anúncios para «{q}»',
    title: '{q} à Venda em Angola – Classificados Grátis | Ambo Market',
    description: 'Encontre {q} em toda Angola – Luanda, Benguela, Huambo e mais. Produtos novos e usados de particulares e empresas. Anuncie gratuitamente no Ambo Market.',
  },
};

const CATEGORY_SEO: Record<string, { city: SeoEntry; everywhere: SeoEntry }> = {
  vehicles: {
    city: {
      h1: 'Veículos à venda em {city}',
      title: 'Carros, Motos e Caminhões em {city} – Novos e Usados | Ambo Market',
      description: 'Compre ou venda veículos em {city}: carros, motos, caminhões, barcos e peças. Anúncios de particulares e concessionárias. Compare preços e negocie grátis.',
    },
    everywhere: {
      h1: 'Veículos à venda',
      title: 'Carros, Motos e Caminhões em Angola – Classificados de Veículos | Ambo Market',
      description: 'Marketplace de veículos em Angola: carros novos e usados, motos, caminhões, barcos e peças. Vendedores verificados, fotos reais e preços competitivos. Anuncie grátis.',
    },
  },
  'real-estate': {
    city: {
      h1: 'Imóveis para venda ou aluguel em {city}',
      title: 'Casas, Apartamentos e Terrenos para Venda ou Aluguel em {city} | Ambo Market',
      description: 'Encontre imóveis em {city}: casas, apartamentos, quartos, terrenos e espaços comerciais para comprar ou alugar. Anúncios de proprietários e agências. Publique grátis.',
    },
    everywhere: {
      h1: 'Imóveis para venda ou aluguel',
      title: 'Casas, Apartamentos e Terrenos em Angola – Compra e Aluguel | Ambo Market',
      description: 'Imóveis em Angola: casas para comprar ou alugar, apartamentos, terrenos e escritórios comerciais. Veja anúncios em Luanda, Benguela, Huambo e todo o país. Publique grátis.',
    },
  },
  electronics: {
    city: {
      h1: 'Electrónicos em {city}',
      title: 'Telemóveis, Laptops, TVs e Electrónicos em {city} | Ambo Market',
      description: 'Compre ou venda electrónicos em {city}: smartphones, laptops, TVs, consolas, eletrodomésticos e acessórios. Novos e segunda mão com garantia. Anuncie grátis.',
    },
    everywhere: {
      h1: 'Electrónicos',
      title: 'Telemóveis, Laptops, TVs e Electrónicos em Angola | Ambo Market',
      description: 'Electrónicos em Angola: smartphones iPhone, Samsung, Xiaomi, laptops, TVs, eletrodomésticos e muito mais. Produtos novos e usados. Compare preços e anuncie grátis.',
    },
  },
  fashion: {
    city: {
      h1: 'Roupas e moda em {city}',
      title: 'Roupas, Calçados e Acessórios de Moda em {city} | Ambo Market',
      description: 'Compre ou venda moda em {city}: roupas masculinas, femininas e infantis, calçados, bolsas, perfumes e acessórios. Novos e segunda mão. Anuncie grátis no Ambo Market.',
    },
    everywhere: {
      h1: 'Roupas e moda',
      title: 'Roupas, Calçados e Acessórios de Moda em Angola | Ambo Market',
      description: 'Moda em Angola: vestuário masculino e feminino, calçados, bolsas, relógios e acessórios. Marcas originais e preços acessíveis. Compre ou venda com facilidade. Anuncie grátis.',
    },
  },
  jobs: {
    city: {
      h1: 'Encontre um emprego em {city}',
      title: 'Vagas de Emprego e Trabalho em {city} – Oferta e Procura | Ambo Market',
      description: 'Vagas de emprego em {city}: tempo inteiro, meio período, freelance e estágio. Encontre trabalho ou recrute talentos. Publique ou candidate-se gratuitamente.',
    },
    everywhere: {
      h1: 'Encontre um emprego',
      title: 'Vagas de Emprego em Angola – Trabalho para Todos os Perfis | Ambo Market',
      description: 'Emprego em Angola: vagas de tempo inteiro, meio período, remoto e freelance em Luanda, Benguela e todo o país. Encontre trabalho ou recrute. Anuncie grátis no Ambo Market.',
    },
  },
  services: {
    city: {
      h1: 'Serviços locais em {city}',
      title: 'Serviços em {city}: Construção, Limpeza, Beleza, Reparações | Ambo Market',
      description: 'Contrate ou ofereça serviços em {city}: construção, electricidade, canalização, limpeza, beleza, transportes, aulas, informática e mais. Anuncie gratuitamente.',
    },
    everywhere: {
      h1: 'Serviços locais',
      title: 'Serviços em Angola: Construção, Limpeza, Beleza, Reparações | Ambo Market',
      description: 'Serviços em Angola: construção e remodelação, electricidade, canalização, limpeza doméstica, beleza e estética, transportes, aulas e formação. Contrate ou anuncie grátis.',
    },
  },
  animals: {
    city: {
      h1: 'Animais e pets em {city}',
      title: 'Animais de Estimação, Gado e Acessórios em {city} | Ambo Market',
      description: 'Compre ou venda animais em {city}: cães, gatos, aves, peixe, gado e aves de capoeira. Ração, gaiolas, coleiras e acessórios pet. Anuncie grátis no Ambo Market.',
    },
    everywhere: {
      h1: 'Animais e pets',
      title: 'Animais de Estimação, Gado e Acessórios em Angola | Ambo Market',
      description: 'Animais em Angola: cães, gatos, aves exóticas, gado bovino e caprino, aves de capoeira. Ração, vacinas e acessórios. Particulares e criadores. Anuncie gratuitamente.',
    },
  },
  hobby: {
    city: {
      h1: 'Hobbies e lazer em {city}',
      title: 'Desporto, Música, Jogos e Colecionáveis em {city} | Ambo Market',
      description: 'Compre ou venda artigos de lazer em {city}: instrumentos musicais, material desportivo, jogos de tabuleiro, colecionáveis e equipamento de camping. Anuncie grátis.',
    },
    everywhere: {
      h1: 'Hobbies e lazer',
      title: 'Desporto, Música, Jogos e Colecionáveis em Angola | Ambo Market',
      description: 'Artigos de lazer em Angola: instrumentos musicais, bicicletas, material de ginásio, jogos de vídeo, livros e colecionáveis. Compre ou venda com facilidade. Anuncie grátis.',
    },
  },
  kids: {
    city: {
      h1: 'Itens infantis em {city}',
      title: 'Brinquedos, Roupas e Móveis para Bebés e Crianças em {city} | Ambo Market',
      description: 'Produtos infantis em {city}: brinquedos, roupas para bebés e crianças, carrinhos, berços, cadeiras e artigos escolares. Novos e segunda mão. Anuncie grátis.',
    },
    everywhere: {
      h1: 'Itens infantis',
      title: 'Brinquedos, Roupas e Móveis Infantis em Angola | Ambo Market',
      description: 'Artigos infantis em Angola: brinquedos educativos, roupa de bebé e criança, carrinhos, berços, bicicletas infantis e material escolar. Poupe nas compras. Anuncie grátis.',
    },
  },
  home: {
    city: {
      h1: 'Casa e jardim em {city}',
      title: 'Móveis, Eletrodomésticos e Decoração em {city} | Ambo Market',
      description: 'Renove a sua casa em {city}: sofás, camas, mesas, frigoríficos, fogões, ar condicionado, ferramentas e decoração. Novos e usados de particulares. Anuncie grátis.',
    },
    everywhere: {
      h1: 'Casa e jardim',
      title: 'Móveis, Eletrodomésticos e Decoração para Casa em Angola | Ambo Market',
      description: 'Artigos para casa em Angola: móveis novos e usados, eletrodomésticos, ferramentas, materiais de construção e decoração. Compre barato ou venda o que não usa. Anuncie grátis.',
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
  <div class="space-y-4">
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
