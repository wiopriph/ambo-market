<script setup lang="ts">
import { usePosts } from '~/composables/usePosts';
import { MAX_POSTS_PER_PAGE } from '~/composables/usePosts/constants';
import { getCityById } from '~/constants/cities';


definePageMeta({
  middleware: [
    'validate-city',
    'validate-category',
    'set-city-middleware',
    'set-filters-middleware',
  ],
});

const {
  cityId,
  categoryId,
  coords,
  locationName,
  isPriorityCity,
  page,
  isLoading,
  fetchPosts,
  getFilter,
} = usePosts();

const { t } = useI18n();
const route = useRoute();

const breadcrumbs = computed(() => {
  const breadcrumbs = [];

  if (isPriorityCity.value) {
    const city = getCityById(cityId.value);

    breadcrumbs.push({
      title: city?.name || t('main_page'),
      to: {
        name: 'cityId',
        params: {
          cityId: cityId.value,
        },
      },
    });
  } else {
    breadcrumbs.push({
      title: t('main_page'),
      to: { name: 'index' },
    });
  }

  const searchQuery = getFilter('q');
  const categoryId = route.params.categoryId;

  if (searchQuery) {
    breadcrumbs.push({
      title: t(`categories.${categoryId}`),
      to: {
        name: 'cityId-categoryId',
        params: {
          categoryId,
          cityId: cityId.value,
        },
      },
    });

    breadcrumbs.push({ title: searchQuery });
  } else {
    breadcrumbs.push({ title: t(`categories.${categoryId}`) });
  }

  return breadcrumbs;
});

const seo = computed(() => {
  const searchQuery = getFilter('q');

  let translationKey;

  if (searchQuery) {
    translationKey = isPriorityCity.value ? 'search.city' : 'search.everywhere';
  } else {
    const categoryId = route.params.categoryId;
    const cityKey = isPriorityCity.value ? 'city' : 'everywhere';

    translationKey = `${categoryId}.${cityKey}`;
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

useHead({ title: title.value, meta: meta.value });


const { data: posts } = await useAsyncData('posts', () => fetchPosts(), {
  watch: [() => [coords, route.query, route.params]],
});


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
    return posts.value?.posts.slice(0, 3).map(item => item.title);
  }

  return [];
});
</script>

<i18n lang="json">
{
  "en": {
    "main_page": "Main page",
    "search": {
      "city": {
        "h1": "Listings for «{q}» in {city}",
        "title": "{q} for Sale in {city} at the Best Prices {'|'} Ambo Market",
        "description": "Find and buy {q} in {city} – fresh listings 🤩 with photos, prices, and seller reviews 💬. Sell your items fast on Ambo Market – Angola’s trusted marketplace."
      },
      "everywhere": {
        "h1": "Listings for «{q}» in {city}",
        "title": "{q} for Sale at the Best Prices {'|'} Ambo Market",
        "description": "Explore listings for {q} across Angola. Buy or sell with confidence 💸 – with reviews, photos and trusted sellers on Ambo Market."
      }
    },
    "vehicles": {
      "city": {
        "h1": "Vehicles for Sale in {city}",
        "title": "Buy and Sell Cars, Motorcycles, and Trucks in {city} {'|'} Ambo Market",
        "description": "Find new and used vehicles, including cars, bikes, and trucks. Compare prices and connect with verified sellers. Browse listings in {city}, contact sellers, or post your own offer for free."
      },
      "everywhere": {
        "h1": "Vehicles for Sale",
        "title": "Buy and Sell Cars, Motorcycles, and Trucks in Angola {'|'} Ambo Market",
        "description": "Find new and used vehicles, including cars, bikes, and trucks. Compare prices and connect with verified sellers. Discover offers from across Angola or post your own listing today for free."
      }
    },
    "real-estate": {
      "city": {
        "h1": "Property for Sale or Rent in {city}",
        "title": "Find Houses, Apartments and Land in {city} {'|'} Ambo Market",
        "description": "Explore real estate offers – from homes and apartments to commercial properties and land plots. Browse listings in {city}, contact sellers, or post your own offer for free."
      },
      "everywhere": {
        "h1": "Property for Sale or Rent",
        "title": "Find Houses, Apartments and Land in Angola {'|'} Ambo Market",
        "description": "Explore real estate offers – from homes and apartments to commercial properties and land plots. Discover offers from across Angola or post your own listing today for free."
      }
    },
    "electronics": {
      "city": {
        "h1": "Electronics Marketplace in {city}",
        "title": "Buy and Sell Phones, Laptops, TVs and More in {city} {'|'} Ambo Market",
        "description": "Find the latest electronics including smartphones, laptops, TVs, and audio equipment at great prices. Browse listings in {city}, contact sellers, or post your own offer for free."
      },
      "everywhere": {
        "h1": "Electronics Marketplace",
        "title": "Buy and Sell Phones, Laptops, TVs and More in Angola {'|'} Ambo Market",
        "description": "Find the latest electronics including smartphones, laptops, TVs, and audio equipment at great prices. Discover offers from across Angola or post your own listing today for free."
      }
    },
    "fashion": {
      "city": {
        "h1": "Clothing and Fashion in {city}",
        "title": "Shop and Sell Clothes, Shoes and Accessories in {city} {'|'} Ambo Market",
        "description": "Discover men’s, women’s, and kids’ fashion. Buy or sell stylish clothes, shoes, bags and accessories. Browse listings in {city}, contact sellers, or post your own offer for free."
      },
      "everywhere": {
        "h1": "Clothing and Fashion",
        "title": "Shop and Sell Clothes, Shoes and Accessories in Angola {'|'} Ambo Market",
        "description": "Discover men’s, women’s, and kids’ fashion. Buy or sell stylish clothes, shoes, bags and accessories. Discover offers from across Angola or post your own listing today for free."
      }
    },
    "jobs": {
      "city": {
        "h1": "Find a Job in {city}",
        "title": "Job Vacancies and Employment Opportunities in {city} {'|'} Ambo Market",
        "description": "Search job listings or post a vacancy. Full-time, part-time, freelance or remote – find work that fits you. Browse listings in {city}, contact sellers, or post your own offer for free."
      },
      "everywhere": {
        "h1": "Find a Job",
        "title": "Job Vacancies and Employment Opportunities in Angola {'|'} Ambo Market",
        "description": "Search job listings or post a vacancy. Full-time, part-time, freelance or remote – find work that fits you. Discover offers from across Angola or post your own listing today for free."
      }
    },
    "services": {
      "city": {
        "h1": "Local Services in {city}",
        "title": "Hire or Offer Services: Cleaning, Repairs, Beauty and More in {city} {'|'} Ambo Market",
        "description": "Offer or hire services like construction, beauty, tutoring, delivery, and more across Angola. Browse listings in {city}, contact sellers, or post your own offer for free."
      },
      "everywhere": {
        "h1": "Local Services",
        "title": "Hire or Offer Services: Cleaning, Repairs, Beauty and More in Angola {'|'} Ambo Market",
        "description": "Offer or hire services like construction, beauty, tutoring, delivery, and more across Angola. Discover offers from across Angola or post your own listing today for free."
      }
    },
    "animals": {
      "city": {
        "h1": "Pets and Animals in {city}",
        "title": "Buy or Sell Pets, Livestock and Animal Supplies in {city} {'|'} Ambo Market",
        "description": "Browse pet listings, livestock offers, and find food, cages, and accessories for all kinds of animals. Browse listings in {city}, contact sellers, or post your own offer for free."
      },
      "everywhere": {
        "h1": "Pets and Animals",
        "title": "Buy or Sell Pets, Livestock and Animal Supplies in Angola {'|'} Ambo Market",
        "description": "Browse pet listings, livestock offers, and find food, cages, and accessories for all kinds of animals. Discover offers from across Angola or post your own listing today for free."
      }
    },
    "hobby": {
      "city": {
        "h1": "Hobbies and Leisure in {city}",
        "title": "Buy or Sell Sports, Music and Collectibles in {city} {'|'} Ambo Market",
        "description": "Find musical instruments, games, collectibles, and sports equipment. Post your hobby gear for sale. Browse listings in {city}, contact sellers, or post your own offer for free."
      },
      "everywhere": {
        "h1": "Hobbies and Leisure",
        "title": "Buy or Sell Sports, Music and Collectibles in Angola {'|'} Ambo Market",
        "description": "Find musical instruments, games, collectibles, and sports equipment. Post your hobby gear for sale. Discover offers from across Angola or post your own listing today for free."
      }
    },
    "kids": {
      "city": {
        "h1": "Kids' Items in {city}",
        "title": "Buy or Sell Toys, Baby Gear and Kids’ Furniture in {city} {'|'} Ambo Market",
        "description": "Get deals on toys, baby essentials, kids’ clothes, cribs, strollers and more. Great for families and parents. Browse listings in {city}, contact sellers, or post your own offer for free."
      },
      "everywhere": {
        "h1": "Kids' Items",
        "title": "Buy or Sell Toys, Baby Gear and Kids’ Furniture in Angola {'|'} Ambo Market",
        "description": "Get deals on toys, baby essentials, kids’ clothes, cribs, strollers and more. Great for families and parents. Discover offers from across Angola or post your own listing today for free."
      }
    },
    "home": {
      "city": {
        "h1": "Home and Garden in {city}",
        "title": "Buy or Sell Furniture, Tools, and Home Décor in {city} {'|'} Ambo Market",
        "description": "Upgrade your space with furniture, appliances, tools and decorations. Sell unused home goods easily. Browse listings in {city}, contact sellers, or post your own offer for free."
      },
      "everywhere": {
        "h1": "Home and Garden",
        "title": "Buy or Sell Furniture, Tools, and Home Décor in Angola {'|'} Ambo Market",
        "description": "Upgrade your space with furniture, appliances, tools and decorations. Sell unused home goods easily. Discover offers from across Angola or post your own listing today for free."
      }
    }
  },
  "pt": {
    "main_page": "Página inicial",
    "search": {
      "city": {
        "h1": "Anúncios para «{q}» em {city}",
        "title": "{q} em {city} com os Melhores Preços {'|'} Ambo Market",
        "description": "Veja anúncios para {q} em {city}. Compre ou venda com fotos, avaliações e preços acessíveis 💸 em toda Angola. Publique grátis no Ambo Market."
      },
      "everywhere": {
        "h1": "Anúncios para «{q}»",
        "title": "{q} com os Melhores Preços {'|'} Ambo Market",
        "description": "Encontre ofertas para {q} em todo o país. Produtos novos e usados 🤩 com avaliações 💬 e vendedores confiáveis. Anuncie gratuitamente."
      }
    },
    "vehicles": {
      "city": {
        "h1": "Veículos à venda em {city}",
        "title": "Comprar e vender carros, motos e caminhões em {city} {'|'} Ambo Market",
        "description": "Encontre veículos novos e usados, incluindo carros, motos e caminhões. Compare preços e conecte-se com vendedores verificados. Veja anúncios em {city}, entre em contato ou publique seu anúncio grátis."
      },
      "everywhere": {
        "h1": "Veículos à venda",
        "title": "Comprar e vender carros, motos e caminhões em Angola {'|'} Ambo Market",
        "description": "Encontre veículos novos e usados, incluindo carros, motos e caminhões. Compare preços e conecte-se com vendedores verificados. Veja anúncios em Angola, entre em contato ou publique seu anúncio grátis."
      }
    },
    "real-estate": {
      "city": {
        "h1": "Imóveis para venda ou aluguel em {city}",
        "title": "Encontre casas, apartamentos e terrenos em {city} {'|'} Ambo Market",
        "description": "Explore ofertas de imóveis – casas, apartamentos, terrenos e imóveis comerciais. Veja anúncios em {city} ou publique sua oferta gratuitamente."
      },
      "everywhere": {
        "h1": "Imóveis para venda ou aluguel",
        "title": "Encontre casas, apartamentos e terrenos em Angola {'|'} Ambo Market",
        "description": "Explore ofertas de imóveis – casas, apartamentos, terrenos e imóveis comerciais. Veja anúncios em Angola ou publique sua oferta gratuitamente."
      }
    },
    "electronics": {
      "city": {
        "h1": "Eletrônicos em {city}",
        "title": "Comprar e vender celulares, laptops, TVs e mais em {city} {'|'} Ambo Market",
        "description": "Encontre os melhores eletrônicos – celulares, laptops, TVs e áudio com ótimos preços. Veja anúncios em {city} ou publique sua oferta grátis."
      },
      "everywhere": {
        "h1": "Eletrônicos",
        "title": "Comprar e vender celulares, laptops, TVs e mais em Angola {'|'} Ambo Market",
        "description": "Encontre os melhores eletrônicos – celulares, laptops, TVs e áudio com ótimos preços. Veja anúncios em Angola ou publique sua oferta grátis."
      }
    },
    "fashion": {
      "city": {
        "h1": "Roupas e moda em {city}",
        "title": "Compre e venda roupas, calçados e acessórios em {city} {'|'} Ambo Market",
        "description": "Descubra moda masculina, feminina e infantil. Roupas, calçados, bolsas e mais. Veja anúncios em {city} ou publique sua oferta gratuita."
      },
      "everywhere": {
        "h1": "Roupas e moda",
        "title": "Compre e venda roupas, calçados e acessórios em Angola {'|'} Ambo Market",
        "description": "Descubra moda masculina, feminina e infantil. Roupas, calçados, bolsas e mais. Veja anúncios em Angola ou publique sua oferta gratuita."
      }
    },
    "jobs": {
      "city": {
        "h1": "Encontre um emprego em {city}",
        "title": "Vagas de trabalho e oportunidades em {city} {'|'} Ambo Market",
        "description": "Pesquise vagas ou publique oportunidades. Tempo integral, meio período ou freelance. Veja anúncios em {city} ou publique sua oferta gratuitamente."
      },
      "everywhere": {
        "h1": "Encontre um emprego",
        "title": "Vagas de trabalho e oportunidades em Angola {'|'} Ambo Market",
        "description": "Pesquise vagas ou publique oportunidades. Tempo integral, meio período ou freelance. Veja anúncios em Angola ou publique sua oferta gratuitamente."
      }
    },
    "services": {
      "city": {
        "h1": "Serviços locais em {city}",
        "title": "Contrate ou ofereça serviços: Limpeza, consertos, beleza e mais em {city} {'|'} Ambo Market",
        "description": "Ofereça ou contrate serviços como construção, beleza, aulas, entregas e mais. Veja anúncios em {city} ou publique sua oferta grátis."
      },
      "everywhere": {
        "h1": "Serviços locais",
        "title": "Contrate ou ofereça serviços: Limpeza, consertos, beleza e mais em Angola {'|'} Ambo Market",
        "description": "Ofereça ou contrate serviços como construção, beleza, aulas, entregas e mais. Veja anúncios em Angola ou publique sua oferta grátis."
      }
    },
    "animals": {
      "city": {
        "h1": "Animais e pets em {city}",
        "title": "Compre ou venda pets, gado e suprimentos em {city} {'|'} Ambo Market",
        "description": "Veja anúncios de pets, animais de fazenda e acessórios. Comida, gaiolas, produtos e mais. Veja anúncios em {city} ou publique o seu gratuitamente."
      },
      "everywhere": {
        "h1": "Animais e pets",
        "title": "Compre ou venda pets, gado e suprimentos em Angola {'|'} Ambo Market",
        "description": "Veja anúncios de pets, animais de fazenda e acessórios. Comida, gaiolas, produtos e mais. Veja anúncios em Angola ou publique o seu gratuitamente."
      }
    },
    "hobby": {
      "city": {
        "h1": "Hobbies e lazer em {city}",
        "title": "Compre ou venda esportes, música e colecionáveis em {city} {'|'} Ambo Market",
        "description": "Instrumentos musicais, jogos, equipamentos esportivos e itens colecionáveis. Veja anúncios em {city} ou publique sua oferta grátis."
      },
      "everywhere": {
        "h1": "Hobbies e lazer",
        "title": "Compre ou venda esportes, música e colecionáveis em Angola {'|'} Ambo Market",
        "description": "Instrumentos musicais, jogos, equipamentos esportivos e itens colecionáveis. Veja anúncios em Angola ou publique sua oferta grátis."
      }
    },
    "kids": {
      "city": {
        "h1": "Itens infantis em {city}",
        "title": "Compre ou venda brinquedos, roupas e móveis infantis em {city} {'|'} Ambo Market",
        "description": "Aproveite ofertas em brinquedos, roupas infantis, carrinhos e berços. Ideal para famílias. Veja anúncios em {city} ou publique sua oferta gratuitamente."
      },
      "everywhere": {
        "h1": "Itens infantis",
        "title": "Compre ou venda brinquedos, roupas e móveis infantis em Angola {'|'} Ambo Market",
        "description": "Aproveite ofertas em brinquedos, roupas infantis, carrinhos e berços. Ideal para famílias. Veja anúncios em Angola ou publique sua oferta gratuitamente."
      }
    },
    "home": {
      "city": {
        "h1": "Casa e jardim em {city}",
        "title": "Compre ou venda móveis, ferramentas e decoração em {city} {'|'} Ambo Market",
        "description": "Renove sua casa com móveis, eletrodomésticos, ferramentas e decoração. Veja anúncios em {city} ou publique sua oferta gratuita."
      },
      "everywhere": {
        "h1": "Casa e jardim",
        "title": "Compre ou venda móveis, ferramentas e decoração em Angola {'|'} Ambo Market",
        "description": "Renove sua casa com móveis, eletrodomésticos, ferramentas e decoração. Veja anúncios em Angola ou publique sua oferta gratuita."
      }
    }
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <UIBreadcrumbs :items="breadcrumbs" />

    <h1
      :class="$style.title"
      v-text="seo.h1"
    />

    <div :class="$style.content">
      <div :class="$style.left">
        <FilterBlock :class="$style.filter" />
      </div>

      <div :class="$style.main">
        <ProductList
          :list="posts?.posts"
          :isLoading="isLoading"
        />

        <UIPagination
          v-if="hasPagination"
          :view="3"
          :value="page"
          :max="totalPages"
          :class="$style.pagination"
          @input="setPage"
        />

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
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-simple-container;

  padding: 10px 20px;
}

.title {
  @include ui-typo-32-bold;

  margin-top: 10px;
}

.content {
  margin-top: 14px; // 20 - 6
  display: flex;
}

.left {
  position: relative;
  flex: 280px 0;
  max-width: 280px;
  margin-right: 20px;

  @include md {
    display: none;
  }
}

.filter {
  position: sticky;
  top: (64px + 10px);
  margin: 6px 0;
}

.main {
  flex: 1 1;
  min-width: 0;
}

.pagination {
  margin-top: 20px;
}
</style>
