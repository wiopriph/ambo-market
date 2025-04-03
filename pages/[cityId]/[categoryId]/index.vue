<script setup lang="ts">
import { usePosts } from '~/composables/usePosts';
import { MAX_POSTS_PER_PAGE } from '~/composables/usePosts/constants';
import { getCityById } from '~/constants/cities';


definePageMeta({
  middleware: [
    'city-routes-guard',
    'category-routes-guard',
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

  if (searchQuery) {
    const categoryId = route.params.categoryId;

    breadcrumbs.push({
      title: t(`${categoryId}`),
      to: {
        name: 'cityId-categoryId',
        params: {
          categoryId,
          cityId: cityId.value,
        },
      },
    });
  }

  breadcrumbs.push({ title: seo.value.h1 });

  return breadcrumbs;
});

const seo = computed(() => {
  const searchQuery = getFilter('q');

  let translationKey;

  if (searchQuery) {
    translationKey = isPriorityCity.value ? 'search.withCity' : 'search.withoutCity';
  } else {
    const categoryId = route.params.categoryId;
    const cityKey = isPriorityCity.value ? 'withCity' : 'withoutCity';

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
      "withCity": {
        "h1": "Listings for «{q}» in {city}",
        "title": "{q} - Buy in {city} at the best prices {'|'} Ambo Market",
        "description": "Find all listings for «{q}» in {city}: a wide selection of goods 🤩 with photos and reviews at affordable prices 💸 across all provinces of Angola on Ambo Market."
      },
      "withoutCity": {
        "h1": "Listings for «{q}»",
        "title": "{q} - Buy at the best prices {'|'} Ambo Market",
        "description": "Find all listings for «{q}»: a wide selection of goods 🤩 with photos and reviews at affordable prices 💸 across all provinces of Angola on Ambo Market."
      }
    },
    "electronics": {
      "withCity": {
        "h1": "Electronics in {city}",
        "title": "Electronics in {city}: phones, computers, TVs, and more {'|'} Ambo Market",
        "description": "Ads for new and used electronics in {city}. Find phones 📱, laptops 💻, TVs 📺, and other gadgets at great prices."
      },
      "withoutCity": {
        "h1": "Electronics",
        "title": "Electronics: phones, computers, TVs, and more {'|'} Ambo Market",
        "description": "Ads for new and used electronics. Find phones 📱, laptops 💻, TVs 📺, and other gadgets at great prices."
      }
    },
    "clothing": {
      "withCity": {
        "h1": "Clothing and accessories in {city}",
        "title": "Fashion in {city}: clothes, shoes, and accessories for everyone {'|'} Ambo Market",
        "description": "Ads for clothing and accessories in {city}. Discover men's, women's, and children's fashion 👗👕🕞 at amazing prices."
      },
      "withoutCity": {
        "h1": "Clothing and accessories",
        "title": "Fashion: clothes, shoes, and accessories for everyone {'|'} Ambo Market",
        "description": "Ads for clothing and accessories. Discover men's, women's, and children's fashion 👗👕🕞 at amazing prices."
      }
    },
    "transport": {
      "withCity": {
        "h1": "Transport in {city}",
        "title": "Transport in {city}: cars, motorcycles, and more {'|'} Ambo Market",
        "description": "Find cars 🚗, motorcycles 🏍️, and other vehicles, new and used, in {city}. Great deals from private sellers and dealers."
      },
      "withoutCity": {
        "h1": "Transport",
        "title": "Transport: cars, motorcycles, and more {'|'} Ambo Market",
        "description": "Find cars 🚗, motorcycles 🏍️, and other vehicles, new and used. Great deals from private sellers and dealers."
      }
    },
    "auto-parts": {
      "withCity": {
        "h1": "Car parts in {city}",
        "title": "Car parts in {city}: engines, tires, and more {'|'} Ambo Market",
        "description": "Buy new and used car parts 🚗 in {city}. Find engines, tires, batteries, and much more."
      },
      "withoutCity": {
        "h1": "Car parts",
        "title": "Car parts: engines, tires, and more {'|'} Ambo Market",
        "description": "Buy new and used car parts 🚗. Find engines, tires, batteries, and much more."
      }
    },
    "beauty-health": {
      "withCity": {
        "h1": "Beauty and health in {city}",
        "title": "Beauty and health in {city}: cosmetics, devices, and more {'|'} Ambo Market",
        "description": "Ads for beauty and health in {city}. Discover cosmetics 💄, medical equipment, and personal care products."
      },
      "withoutCity": {
        "h1": "Beauty and health",
        "title": "Beauty and health: cosmetics, devices, and more {'|'} Ambo Market",
        "description": "Ads for beauty and health. Discover cosmetics 💄, medical equipment, and personal care products."
      }
    },
    "real-estate": {
      "withCity": {
        "h1": "Real Estate in {city}",
        "title": "Real Estate in {city}: houses, apartments, and more {'|'} Ambo Market",
        "description": "Find houses 🏠, apartments 🏢, and other real estate for sale or rent in {city}. Browse listings from private sellers and realtors."
      },
      "withoutCity": {
        "h1": "Real Estate",
        "title": "Real Estate: houses, apartments, and more {'|'} Ambo Market",
        "description": "Find houses 🏠, apartments 🏢, and other real estate for sale or rent. Browse listings from private sellers and realtors."
      }
    },
    "childrens-goods": {
      "withCity": {
        "h1": "Children's Goods in {city}",
        "title": "Children's Goods in {city}: toys, clothes, and more {'|'} Ambo Market",
        "description": "Browse a wide range of new and used children's goods in {city}. Find toys 🧸, clothes 👕, and more at great prices."
      },
      "withoutCity": {
        "h1": "Children's Goods",
        "title": "Children's Goods: toys, clothes, and more {'|'} Ambo Market",
        "description": "Browse a wide range of new and used children's goods. Find toys 🧸, clothes 👕, and more at great prices."
      }
    },
    "job": {
      "withCity": {
        "h1": "Jobs in {city}",
        "title": "Jobs in {city}: find your next job opportunity {'|'} Ambo Market",
        "description": "Search for job listings in {city}. Find full-time, part-time, and freelance positions across various industries."
      },
      "withoutCity": {
        "h1": "Jobs",
        "title": "Jobs: find your next job opportunity {'|'} Ambo Market",
        "description": "Search for job listings. Find full-time, part-time, and freelance positions across various industries."
      }
    },
    "services": {
      "withCity": {
        "h1": "Services in {city}",
        "title": "Services in {city}: repairs, cleaning, and more {'|'} Ambo Market",
        "description": "Find a wide range of services in {city}. Whether you need repairs 🛠️, cleaning 🧼, or other services, you'll find great offers."
      },
      "withoutCity": {
        "h1": "Services",
        "title": "Services: repairs, cleaning, and more {'|'} Ambo Market",
        "description": "Find a wide range of services. Whether you need repairs 🛠️, cleaning 🧼, or other services, you'll find great offers."
      }
    },
    "building-materials": {
      "withCity": {
        "h1": "Building Materials in {city}",
        "title": "Building Materials in {city}: cement, bricks, tools, and more {'|'} Ambo Market",
        "description": "Browse building materials in {city}. Find cement 🏗️, bricks, tools 🧰, and other supplies for construction and renovation."
      },
      "withoutCity": {
        "h1": "Building Materials",
        "title": "Building Materials: cement, bricks, tools, and more {'|'} Ambo Market",
        "description": "Browse building materials. Find cement 🏗️, bricks, tools 🧰, and other supplies for construction and renovation."
      }
    },
    "animals": {
      "withCity": {
        "h1": "Animals in {city}",
        "title": "Animals in {city}: pets, livestock, and more {'|'} Ambo Market",
        "description": "Find pets 🐶🐱, livestock 🐄🐓, and other animals in {city}. Browse ads from private sellers and breeders."
      },
      "withoutCity": {
        "h1": "Animals",
        "title": "Animals: pets, livestock, and more {'|'} Ambo Market",
        "description": "Find pets 🐶🐱, livestock 🐄🐓, and other animals. Browse ads from private sellers and breeders."
      }
    },
    "for-business": {
      "withCity": {
        "h1": "For Business in {city}",
        "title": "For Business in {city}: office equipment, supplies, and more {'|'} Ambo Market",
        "description": "Find office equipment 🖨️, supplies 📦, and other business products in {city}. Perfect for startups and established businesses."
      },
      "withoutCity": {
        "h1": "For Business",
        "title": "For Business: office equipment, supplies, and more {'|'} Ambo Market",
        "description": "Find office equipment 🖨️, supplies 📦, and other business products. Perfect for startups and established businesses."
      }
    },
    "for-home": {
      "withCity": {
        "h1": "For Home in {city}",
        "title": "For Home in {city}: furniture, appliances, and more {'|'} Ambo Market",
        "description": "Discover a wide range of products for your home 🏡 in {city}. Find furniture 🛋️, appliances 🏠, and more at great prices."
      },
      "withoutCity": {
        "h1": "For Home",
        "title": "For Home: furniture, appliances, and more {'|'} Ambo Market",
        "description": "Discover a wide range of products for your home 🏡. Find furniture 🛋️, appliances 🏠, and more at great prices."
      }
    },
    "other": {
      "withCity": {
        "h1": "Other in {city}",
        "title": "Other in {city}: unique items and more {'|'} Ambo Market",
        "description": "Browse a variety of unique items in {city}. From rare collectibles 🏆 to special offers, you'll find something interesting."
      },
      "withoutCity": {
        "h1": "Other",
        "title": "Other: unique items and more {'|'} Ambo Market",
        "description": "Browse a variety of unique items. From rare collectibles 🏆 to special offers, you'll find something interesting."
      }
    }
  },
  "pt": {
    "main_page": "Página inicial",
    "search": {
      "withCity": {
        "h1": "Anúncios para «{q}» em {city}",
        "title": "{q} - Comprar em {city} com os melhores preços {'|'} Ambo Market",
        "description": "Encontre todos os anúncios para «{q}» em {city}: uma grande variedade de produtos 🤩 com fotos e avaliações a preços acessíveis 💸 em todas as províncias de Angola no Ambo Market."
      },
      "withoutCity": {
        "h1": "Anúncios para «{q}»",
        "title": "{q} - Comprar com os melhores preços {'|'} Ambo Market",
        "description": "Encontre todos os anúncios para «{q}»: uma grande variedade de produtos 🤩 com fotos e avaliações a preços acessíveis 💸 em todas as províncias de Angola no Ambo Market."
      }
    },
    "electronics": {
      "withCity": {
        "h1": "Eletrônicos em {city}",
        "title": "Eletrônicos em {city}: celulares, computadores, TVs e mais {'|'} Ambo Market",
        "description": "Anúncios de venda de eletrônicos novos e usados em {city}. Encontre celulares 📱, laptops 💻, TVs 📺 e outros gadgets com ótimos preços."
      },
      "withoutCity": {
        "h1": "Eletrônicos",
        "title": "Eletrônicos: celulares, computadores, TVs e mais {'|'} Ambo Market",
        "description": "Anúncios de venda de eletrônicos novos e usados. Encontre celulares 📱, laptops 💻, TVs 📺 e outros gadgets com ótimos preços."
      }
    },
    "clothing": {
      "withCity": {
        "h1": "Roupas e acessórios em {city}",
        "title": "Moda em {city}: roupas, sapatos e acessórios para todos {'|'} Ambo Market",
        "description": "Anúncios de roupas e acessórios em {city}. Encontre moda masculina, feminina e infantil 👗👕🕞 a preços incríveis."
      },
      "withoutCity": {
        "h1": "Roupas e acessórios",
        "title": "Moda: roupas, sapatos e acessórios para todos {'|'} Ambo Market",
        "description": "Anúncios de roupas e acessórios. Encontre moda masculina, feminina e infantil 👗👕🕞 a preços incríveis."
      }
    },
    "transport": {
      "withCity": {
        "h1": "Transporte em {city}",
        "title": "Transporte em {city}: carros, motos e mais {'|'} Ambo Market",
        "description": "Encontre carros 🚗, motos 🏍️ e outros veículos novos e usados em {city}. Ótimas ofertas de vendedores particulares e revendedores."
      },
      "withoutCity": {
        "h1": "Transporte",
        "title": "Transporte: carros, motos e mais {'|'} Ambo Market",
        "description": "Encontre carros 🚗, motos 🏍️ e outros veículos novos e usados. Ótimas ofertas de vendedores particulares e revendedores."
      }
    },
    "auto-parts": {
      "withCity": {
        "h1": "Peças de automóveis em {city}",
        "title": "Peças para carros em {city}: motores, pneus e mais {'|'} Ambo Market",
        "description": "Compre peças de automóveis novas e usadas 🚗 em {city}. Encontre motores, pneus, baterias e muito mais."
      },
      "withoutCity": {
        "h1": "Peças de automóveis",
        "title": "Peças para carros: motores, pneus e mais {'|'} Ambo Market",
        "description": "Compre peças de automóveis novas e usadas 🚗. Encontre motores, pneus, baterias e muito mais."
      }
    },
    "beauty-health": {
      "withCity": {
        "h1": "Beleza e saúde em {city}",
        "title": "Beleza e saúde em {city}: cosméticos, aparelhos e mais {'|'} Ambo Market",
        "description": "Anúncios de beleza e saúde em {city}. Encontre cosméticos 💄, equipamentos médicos e produtos de cuidado pessoal."
      },
      "withoutCity": {
        "h1": "Beleza e saúde",
        "title": "Beleza e saúde: cosméticos, aparelhos e mais {'|'} Ambo Market",
        "description": "Anúncios de beleza e saúde. Encontre cosméticos 💄, equipamentos médicos e produtos de cuidado pessoal."
      }
    },
    "real-estate": {
      "withCity": {
        "h1": "Imóveis em {city}",
        "title": "Imóveis em {city}: casas, apartamentos e mais {'|'} Ambo Market",
        "description": "Encontre casas 🏠, apartamentos 🏢 e outros imóveis para venda ou aluguel em {city}. Navegue por anúncios de vendedores particulares e imobiliárias."
      },
      "withoutCity": {
        "h1": "Imóveis",
        "title": "Imóveis: casas, apartamentos e mais {'|'} Ambo Market",
        "description": "Encontre casas 🏠, apartamentos 🏢 e outros imóveis para venda ou aluguel. Navegue por anúncios de vendedores particulares e imobiliárias."
      }
    },
    "childrens-goods": {
      "withCity": {
        "h1": "Produtos infantis em {city}",
        "title": "Produtos infantis em {city}: brinquedos, roupas e mais {'|'} Ambo Market",
        "description": "Encontre uma grande variedade de produtos infantis novos e usados em {city}. Brinquedos 🧸, roupas 👕 e muito mais a preços acessíveis."
      },
      "withoutCity": {
        "h1": "Produtos infantis",
        "title": "Produtos infantis: brinquedos, roupas e mais {'|'} Ambo Market",
        "description": "Encontre uma grande variedade de produtos infantis novos e usados. Brinquedos 🧸, roupas 👕 e muito mais a preços acessíveis."
      }
    },
    "job": {
      "withCity": {
        "h1": "Empregos em {city}",
        "title": "Empregos em {city}: encontre a sua próxima oportunidade de trabalho {'|'} Ambo Market",
        "description": "Pesquise por vagas de emprego em {city}. Encontre posições de tempo integral, meio período e freelance em diversos setores."
      },
      "withoutCity": {
        "h1": "Empregos",
        "title": "Empregos: encontre a sua próxima oportunidade de trabalho {'|'} Ambo Market",
        "description": "Pesquise por vagas de emprego. Encontre posições de tempo integral, meio período e freelance em diversos setores."
      }
    },
    "services": {
      "withCity": {
        "h1": "Serviços em {city}",
        "title": "Serviços em {city}: reparos, limpeza e mais {'|'} Ambo Market",
        "description": "Encontre uma ampla gama de serviços em {city}. Precisa de reparos 🛠️, limpeza 🧼 ou outros serviços? Encontre ofertas incríveis."
      },
      "withoutCity": {
        "h1": "Serviços",
        "title": "Serviços: reparos, limpeza e mais {'|'} Ambo Market",
        "description": "Encontre uma ampla gama de serviços. Precisa de reparos 🛠️, limpeza 🧼 ou outros serviços? Encontre ofertas incríveis."
      }
    },
    "building-materials": {
      "withCity": {
        "h1": "Materiais de construção em {city}",
        "title": "Materiais de construção em {city}: cimento, tijolos, ferramentas e mais {'|'} Ambo Market",
        "description": "Encontre materiais de construção em {city}. Compre cimento 🏗️, tijolos, ferramentas 🧰 e outros materiais para reforma e construção."
      },
      "withoutCity": {
        "h1": "Materiais de construção",
        "title": "Materiais de construção: cimento, tijolos, ferramentas e mais {'|'} Ambo Market",
        "description": "Encontre materiais de construção. Compre cimento 🏗️, tijolos, ferramentas 🧰 e outros materiais para reforma e construção."
      }
    },
    "animals": {
      "withCity": {
        "h1": "Animais em {city}",
        "title": "Animais em {city}: pets, gado e mais {'|'} Ambo Market",
        "description": "Encontre pets 🐶🐱, gado 🐄🐓 e outros animais em {city}. Veja anúncios de vendedores particulares e criadores."
      },
      "withoutCity": {
        "h1": "Animais",
        "title": "Animais: pets, gado e mais {'|'} Ambo Market",
        "description": "Encontre pets 🐶🐱, gado 🐄🐓 e outros animais. Veja anúncios de vendedores particulares e criadores."
      }
    },
    "for-business": {
      "withCity": {
        "h1": "Para negócios em {city}",
        "title": "Para negócios em {city}: equipamentos de escritório, suprimentos e mais {'|'} Ambo Market",
        "description": "Encontre equipamentos de escritório 🖨️, suprimentos 📦 e outros produtos empresariais em {city}. Perfeito para novos negócios e empresas estabelecidas."
      },
      "withoutCity": {
        "h1": "Para negócios",
        "title": "Para negócios: equipamentos de escritório, suprimentos e mais {'|'} Ambo Market",
        "description": "Encontre equipamentos de escritório 🖨️, suprimentos 📦 e outros produtos empresariais. Perfeito para novos negócios e empresas estabelecidas."
      }
    },
    "for-home": {
      "withCity": {
        "h1": "Para casa em {city}",
        "title": "Para casa em {city}: móveis, eletrodomésticos e mais {'|'} Ambo Market",
        "description": "Descubra uma ampla gama de produtos para sua casa 🏡 em {city}. Móveis 🛋️, eletrodomésticos 🏠 e muito mais a ótimos preços."
      },
      "withoutCity": {
        "h1": "Para casa",
        "title": "Para casa: móveis, eletrodomésticos e mais {'|'} Ambo Market",
        "description": "Descubra uma ampla gama de produtos para sua casa 🏡. Móveis 🛋️, eletrodomésticos 🏠 e muito mais a ótimos preços."
      }
    },
    "other": {
      "withCity": {
        "h1": "Outros em {city}",
        "title": "Outros em {city}: itens únicos e mais {'|'} Ambo Market",
        "description": "Browse uma variedade de itens únicos em {city}. De colecionáveis raros 🏆 a ofertas especiais, você encontrará algo interessante."
      },
      "withoutCity": {
        "h1": "Outros",
        "title": "Outros: itens únicos e mais {'|'} Ambo Market",
        "description": "Browse uma variedade de itens únicos. De colecionáveis raros 🏆 a ofertas especiais, você encontrará algo interessante."
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
