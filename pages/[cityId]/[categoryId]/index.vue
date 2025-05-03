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
  const categoryId = route.params.categoryId;

  if (searchQuery) {
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

    breadcrumbs.push({ title: searchQuery });
  } else {
    breadcrumbs.push({ title: t(`${categoryId}`) });
  }

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
        "h1": "Buy and Sell «{q}» in {city}",
        "title": "{q} for Sale in {city} at the Best Prices {'|'} Ambo Market",
        "description": "Find and buy {q} in {city} – fresh listings 🤩 with photos, prices, and seller reviews 💬. Sell your items fast on Ambo Market – Angola’s trusted marketplace."
      },
      "withoutCity": {
        "h1": "Buy and Sell «{q}»",
        "title": "{q} for Sale at the Best Prices {'|'} Ambo Market",
        "description": "Explore listings for {q} across Angola. Buy or sell with confidence 💸 – with reviews, photos and trusted sellers on Ambo Market."
      }
    },
    "electronics": {
      "withCity": {
        "h1": "Buy and Sell Electronics in {city}",
        "title": "Electronics in {city}: Phones, Computers, TVs and More {'|'} Ambo Market",
        "description": "Buy or sell new and used electronics in {city}. Find phones 📱, laptops 💻, TVs 📺, tablets and more at great prices. Post your ad free!"
      },
      "withoutCity": {
        "h1": "Buy and Sell Electronics",
        "title": "Electronics: Phones, Computers, TVs and More {'|'} Ambo Market",
        "description": "Discover top deals on electronics. Buy or sell phones 📱, laptops 💻, TVs 📺 and more across Angola. Post your ad free!"
      }
    },
    "clothing": {
      "withCity": {
        "h1": "Buy and Sell Clothing & Accessories in {city}",
        "title": "Fashion in {city}: Clothes, Shoes & Accessories for Everyone {'|'} Ambo Market",
        "description": "Browse clothing ads in {city}. Shop or sell men’s, women’s, and kids’ fashion 👗👕 at amazing prices. Post your fashion ad free!"
      },
      "withoutCity": {
        "h1": "Buy and Sell Clothing & Accessories",
        "title": "Fashion: Clothes, Shoes & Accessories for Everyone {'|'} Ambo Market",
        "description": "Find great fashion deals for men, women, and children. Buy or sell clothes 👗, shoes 👟, and more on Ambo Market."
      }
    },
    "transport": {
      "withCity": {
        "h1": "Buy and Sell Vehicles in {city}",
        "title": "Vehicles in {city}: Cars, Motorcycles & More {'|'} Ambo Market",
        "description": "Browse ads for cars 🚗, motorcycles 🏍️, and other vehicles in {city}. Buy or sell easily with trusted sellers and real offers."
      },
      "withoutCity": {
        "h1": "Buy and Sell Vehicles",
        "title": "Vehicles: Cars, Motorcycles & More {'|'} Ambo Market",
        "description": "Find new and used vehicles across Angola. Buy or sell cars 🚗, motorcycles 🏍️, trucks and more on Ambo Market."
      }
    },
    "auto-parts": {
      "withCity": {
        "h1": "Buy and Sell Car Parts in {city}",
        "title": "Car Parts in {city}: Engines, Tires & More {'|'} Ambo Market",
        "description": "Find or sell car parts 🚗 in {city}. Engines, tires, batteries and accessories – new or used. Post your ad now free."
      },
      "withoutCity": {
        "h1": "Buy and Sell Car Parts",
        "title": "Car Parts: Engines, Tires & More {'|'} Ambo Market",
        "description": "Search or post car parts 🚗 listings. Buy or sell engines, tires, batteries and auto accessories across Angola."
      }
    },
    "beauty-health": {
      "withCity": {
        "h1": "Beauty & Health Products in {city}",
        "title": "Beauty & Health in {city}: Cosmetics, Devices & More {'|'} Ambo Market",
        "description": "Buy and sell beauty 💄 and health products in {city}. Find cosmetics, skincare, wellness items and medical equipment."
      },
      "withoutCity": {
        "h1": "Beauty & Health Products",
        "title": "Beauty & Health: Cosmetics, Devices & More {'|'} Ambo Market",
        "description": "Browse ads for cosmetics 💄, personal care and medical products. Post or find beauty and health listings on Ambo Market."
      }
    },
    "real-estate": {
      "withCity": {
        "h1": "Buy or Rent Property in {city}",
        "title": "Real Estate in {city}: Houses, Apartments & More {'|'} Ambo Market",
        "description": "Search for houses 🏠, apartments 🏢, land and rentals in {city}. Buy or sell real estate with trusted contacts."
      },
      "withoutCity": {
        "h1": "Buy or Rent Real Estate",
        "title": "Real Estate: Houses, Apartments & More {'|'} Ambo Market",
        "description": "Find property for sale or rent across Angola. Post or browse listings for houses, land, apartments 🏠🏢 and more."
      }
    },
    "childrens-goods": {
      "withCity": {
        "h1": "Children’s Goods in {city}",
        "title": "Kids' Items in {city}: Toys, Clothes & More {'|'} Ambo Market",
        "description": "Buy or sell children’s goods in {city}. Find toys 🧸, clothes 👕, baby products and more. Post your ad for free."
      },
      "withoutCity": {
        "h1": "Children’s Goods",
        "title": "Kids' Items: Toys, Clothes & More {'|'} Ambo Market",
        "description": "Explore listings for toys 🧸, clothing 👕, baby gear and more. Sell or shop kids’ items on Ambo Market."
      }
    },
    "job": {
      "withCity": {
        "h1": "Job Listings in {city}",
        "title": "Jobs in {city}: Apply for Local Work {'|'} Ambo Market",
        "description": "Find and post job opportunities in {city}. Full-time, part-time and freelance work in multiple industries."
      },
      "withoutCity": {
        "h1": "Job Listings",
        "title": "Jobs: Apply for Work Across Angola {'|'} Ambo Market",
        "description": "Explore job ads and post your vacancies. Find work or hire staff with Ambo Market in all industries."
      }
    },
    "services": {
      "withCity": {
        "h1": "Services Offered in {city}",
        "title": "Services in {city}: Hire Cleaning, Repairs & More {'|'} Ambo Market",
        "description": "Browse service ads in {city}. Find or offer cleaning 🧼, repairs 🛠️, delivery, beauty and more. Post your service for free."
      },
      "withoutCity": {
        "h1": "Find or Offer Services",
        "title": "Services: Cleaning, Repairs & More {'|'} Ambo Market",
        "description": "Explore a wide range of services. From cleaning 🧼 and repairs 🛠️ to tutoring and delivery. Hire or advertise easily on Ambo Market."
      }
    },
    "building-materials": {
      "withCity": {
        "h1": "Building Materials for Sale in {city}",
        "title": "Construction Materials in {city}: Cement, Bricks & Tools {'|'} Ambo Market",
        "description": "Buy or sell building materials 🏗️ in {city}. Find cement, bricks, tools 🧰 and more for construction or renovation."
      },
      "withoutCity": {
        "h1": "Buy and Sell Building Materials",
        "title": "Construction Materials: Cement, Bricks & Tools {'|'} Ambo Market",
        "description": "Browse ads for building supplies across Angola. Find or sell cement 🏗️, bricks, tools 🧰 and renovation equipment."
      }
    },
    "animals": {
      "withCity": {
        "h1": "Buy and Sell Animals in {city}",
        "title": "Animals in {city}: Pets, Livestock & More {'|'} Ambo Market",
        "description": "Find or sell pets 🐶🐱, livestock 🐄🐓, and farm animals in {city}. Browse trusted ads from breeders and individuals."
      },
      "withoutCity": {
        "h1": "Animals for Sale",
        "title": "Animals: Pets, Livestock & More {'|'} Ambo Market",
        "description": "Discover animal listings 🐾 across Angola. Buy or sell pets, livestock and rare breeds easily on Ambo Market."
      }
    },
    "for-business": {
      "withCity": {
        "h1": "Business Supplies in {city}",
        "title": "Business Equipment in {city}: Office Tools & More {'|'} Ambo Market",
        "description": "Buy or sell office equipment 🖨️, packaging supplies 📦, and tools for business in {city}. Ideal for entrepreneurs and companies."
      },
      "withoutCity": {
        "h1": "Business Equipment & Supplies",
        "title": "For Business: Buy & Sell Office Supplies, Equipment {'|'} Ambo Market",
        "description": "Find or offer tools for business. Office printers 🖨️, storage items 📦, POS systems and more. Post your business ad free."
      }
    },
    "for-home": {
      "withCity": {
        "h1": "Home Essentials in {city}",
        "title": "Home Products in {city}: Furniture, Appliances & More {'|'} Ambo Market",
        "description": "Buy or sell home items 🏡 in {city}. Find furniture 🛋️, kitchen tools, appliances 🏠, and home décor at great prices."
      },
      "withoutCity": {
        "h1": "Buy and Sell Home Items",
        "title": "Home Products: Furniture, Appliances & More {'|'} Ambo Market",
        "description": "Browse listings for home goods 🏡. Find and sell furniture, appliances, and tools to upgrade your living space."
      }
    },
    "other": {
      "withCity": {
        "h1": "Unique Items in {city}",
        "title": "Other in {city}: Rare Finds, Collectibles & More {'|'} Ambo Market",
        "description": "Browse rare items 🏆, collectibles, and one-of-a-kind offers in {city}. Post or discover something special."
      },
      "withoutCity": {
        "h1": "Discover Unique Offers",
        "title": "Other: Rare Finds, Collectibles & More {'|'} Ambo Market",
        "description": "Explore a variety of unusual listings 🏆. From vintage goods to custom items — find or sell easily on Ambo Market."
      }
    }
  },
  "pt": {
    "main_page": "Página inicial",
    "search": {
      "withCity": {
        "h1": "Compre e Venda «{q}» em {city}",
        "title": "{q} em {city} com os Melhores Preços {'|'} Ambo Market",
        "description": "Veja anúncios para {q} em {city}. Compre ou venda com fotos, avaliações e preços acessíveis 💸 em toda Angola. Publique grátis no Ambo Market."
      },
      "withoutCity": {
        "h1": "Compre e Venda «{q}»",
        "title": "{q} com os Melhores Preços {'|'} Ambo Market",
        "description": "Encontre ofertas para {q} em todo o país. Produtos novos e usados 🤩 com avaliações 💬 e vendedores confiáveis. Anuncie gratuitamente."
      }
    },
    "electronics": {
      "withCity": {
        "h1": "Compre e Venda Eletrônicos em {city}",
        "title": "Eletrônicos em {city}: Celulares, Computadores, TVs e Mais {'|'} Ambo Market",
        "description": "Venda ou compre eletrônicos novos e usados em {city}. Celulares 📱, laptops 💻, TVs 📺 e muito mais com ótimos preços. Anuncie grátis!"
      },
      "withoutCity": {
        "h1": "Compre e Venda Eletrônicos",
        "title": "Eletrônicos: Celulares, Computadores, TVs e Mais {'|'} Ambo Market",
        "description": "Ofertas em eletrônicos em todo o país. Compre ou venda celulares 📱, laptops 💻, TVs 📺 e outros gadgets. Publique grátis."
      }
    },
    "clothing": {
      "withCity": {
        "h1": "Roupas e Acessórios à Venda em {city}",
        "title": "Moda em {city}: Compre e Venda Roupas, Calçados e Acessórios {'|'} Ambo Market",
        "description": "Moda masculina, feminina e infantil em {city}. Compre ou venda roupas 👗👕, calçados 👟 e acessórios. Anuncie grátis."
      },
      "withoutCity": {
        "h1": "Compre e Venda Roupas e Acessórios",
        "title": "Moda: Roupas, Calçados e Acessórios para Todos {'|'} Ambo Market",
        "description": "Ofertas em roupas 👗, calçados 👟 e mais. Moda masculina, feminina e infantil em todo o país. Anuncie gratuitamente."
      }
    },
    "transport": {
      "withCity": {
        "h1": "Transporte em {city}",
        "title": "Veículos em {city}: Carros, Motos e Mais {'|'} Ambo Market",
        "description": "Compre ou venda veículos 🚗🏍️ novos e usados em {city}. Anúncios confiáveis de vendedores e revendedores. Publique grátis."
      },
      "withoutCity": {
        "h1": "Veículos à Venda",
        "title": "Veículos: Carros, Motos e Mais {'|'} Ambo Market",
        "description": "Veja anúncios de carros 🚗, motos 🏍️ e outros veículos em toda Angola. Compre ou venda com segurança."
      }
    },
    "auto-parts": {
      "withCity": {
        "h1": "Peças de Carro em {city}",
        "title": "Autopeças em {city}: Motores, Pneus e Mais {'|'} Ambo Market",
        "description": "Compre ou venda peças de carro 🚗 em {city}. Motores, pneus, baterias e muito mais. Anuncie gratuitamente."
      },
      "withoutCity": {
        "h1": "Autopeças à Venda",
        "title": "Peças de Carro: Motores, Pneus e Mais {'|'} Ambo Market",
        "description": "Veja e publique anúncios de peças de automóveis 🚗. Ofertas de motores, pneus, acessórios e muito mais em todo o país."
      }
    },
    "beauty-health": {
      "withCity": {
        "h1": "Produtos de Beleza e Saúde em {city}",
        "title": "Beleza e Saúde em {city}: Cosméticos, Equipamentos e Mais {'|'} Ambo Market",
        "description": "Anuncie ou compre produtos de beleza 💄 e saúde em {city}. Cosméticos, cuidados pessoais e equipamentos médicos."
      },
      "withoutCity": {
        "h1": "Beleza e Saúde",
        "title": "Produtos de Beleza e Saúde: Cosméticos e Mais {'|'} Ambo Market",
        "description": "Compre ou venda produtos de beleza 💄 e saúde. Cosméticos, cuidados pessoais, equipamentos médicos e mais."
      }
    },
    "real-estate": {
      "withCity": {
        "h1": "Imóveis para Comprar ou Alugar em {city}",
        "title": "Imóveis em {city}: Casas, Apartamentos e Mais {'|'} Ambo Market",
        "description": "Anuncie ou encontre casas 🏠, apartamentos 🏢 e terrenos para venda ou aluguel em {city}. Publique gratuitamente."
      },
      "withoutCity": {
        "h1": "Imóveis à Venda ou Aluguel",
        "title": "Imóveis: Casas, Apartamentos e Mais {'|'} Ambo Market",
        "description": "Veja anúncios de imóveis 🏠🏢 em toda Angola. Encontre ou anuncie casas, terrenos e apartamentos com facilidade."
      }
    },
    "childrens-goods": {
      "withCity": {
        "h1": "Produtos Infantis em {city}",
        "title": "Produtos Infantis em {city}: Brinquedos, Roupas e Mais {'|'} Ambo Market",
        "description": "Anuncie ou compre produtos infantis 🧸👕 em {city}. Roupas, brinquedos, produtos para bebê e mais. Anuncie grátis."
      },
      "withoutCity": {
        "h1": "Produtos para Crianças",
        "title": "Infantil: Brinquedos, Roupas e Mais {'|'} Ambo Market",
        "description": "Veja anúncios de brinquedos 🧸, roupas 👕 e produtos para crianças em todo o país. Anuncie ou compre no Ambo Market."
      }
    },
    "job": {
      "withCity": {
        "h1": "Vagas de Emprego em {city}",
        "title": "Empregos em {city}: Candidate-se Agora {'|'} Ambo Market",
        "description": "Encontre e publique vagas em {city}. Trabalho integral, meio período e freelancer em diversas áreas."
      },
      "withoutCity": {
        "h1": "Vagas de Emprego",
        "title": "Empregos: Oportunidades em Toda Angola {'|'} Ambo Market",
        "description": "Veja e anuncie empregos. Vagas de tempo integral, meio período ou freelance em todas as áreas."
      }
    },
    "services": {
      "withCity": {
        "h1": "Serviços em {city}",
        "title": "Serviços em {city}: Contrate Limpeza, Reparos e Mais {'|'} Ambo Market",
        "description": "Encontre ou ofereça serviços em {city}. Limpeza 🧼, reparos 🛠️, transporte, beleza e mais. Anuncie seus serviços gratuitamente."
      },
      "withoutCity": {
        "h1": "Serviços Disponíveis",
        "title": "Serviços: Reparos, Limpeza, Entregas e Mais {'|'} Ambo Market",
        "description": "Explore uma ampla variedade de serviços. Contrate ou anuncie reparos 🛠️, limpeza 🧼, mudanças, aulas e mais em todo o país."
      }
    },
    "building-materials": {
      "withCity": {
        "h1": "Materiais de Construção em {city}",
        "title": "Materiais em {city}: Cimento, Tijolos, Ferramentas e Mais {'|'} Ambo Market",
        "description": "Compre ou venda materiais de construção 🏗️ em {city}. Cimento, tijolos, ferramentas 🧰 e tudo para obra e reforma. Anuncie grátis."
      },
      "withoutCity": {
        "h1": "Materiais de Construção",
        "title": "Materiais: Cimento, Tijolos, Ferramentas e Mais {'|'} Ambo Market",
        "description": "Veja anúncios de materiais para construção em todo o país. Compre ou venda cimento, tijolos, ferramentas 🧰 e mais."
      }
    },
    "animals": {
      "withCity": {
        "h1": "Animais à Venda em {city}",
        "title": "Animais em {city}: Pets, Gado e Mais {'|'} Ambo Market",
        "description": "Compre ou venda animais em {city}. Veja anúncios confiáveis de pets 🐶🐱, gado 🐄🐓 e outros animais domésticos e de fazenda."
      },
      "withoutCity": {
        "h1": "Animais para Comprar e Vender",
        "title": "Animais: Pets, Gado e Mais {'|'} Ambo Market",
        "description": "Explore anúncios de animais 🐾 em toda Angola. Compre ou anuncie pets, aves, gado e animais exóticos."
      }
    },
    "for-business": {
      "withCity": {
        "h1": "Produtos Empresariais em {city}",
        "title": "Negócios em {city}: Equipamentos, Suprimentos e Mais {'|'} Ambo Market",
        "description": "Anuncie ou compre produtos empresariais em {city}. Impressoras 🖨️, suprimentos 📦, móveis de escritório e mais. Ideal para PMEs."
      },
      "withoutCity": {
        "h1": "Compre e Venda para Empresas",
        "title": "Para Negócios: Equipamentos, Suprimentos e Mais {'|'} Ambo Market",
        "description": "Veja anúncios de produtos para empresas. Equipamentos, móveis, caixas 📦, tecnologia e tudo para seu negócio."
      }
    },
    "for-home": {
      "withCity": {
        "h1": "Itens para Casa em {city}",
        "title": "Para Casa em {city}: Móveis, Eletrodomésticos e Mais {'|'} Ambo Market",
        "description": "Encontre ou venda itens para o lar 🏡 em {city}. Móveis 🛋️, eletrodomésticos 🏠, decoração e mais com ótimos preços."
      },
      "withoutCity": {
        "h1": "Compre e Venda Itens para Casa",
        "title": "Para Casa: Móveis, Eletrodomésticos e Mais {'|'} Ambo Market",
        "description": "Explore anúncios de produtos para casa. Compre ou anuncie móveis 🛋️, utensílios e equipamentos domésticos."
      }
    },
    "other": {
      "withCity": {
        "h1": "Outros Itens em {city}",
        "title": "Outros em {city}: Itens Únicos e Raros {'|'} Ambo Market",
        "description": "Descubra ou anuncie itens únicos em {city}. De colecionáveis raros 🏆 a ofertas exclusivas. Publique gratuitamente."
      },
      "withoutCity": {
        "h1": "Itens Diversos à Venda",
        "title": "Outros: Itens Únicos, Antiguidades e Mais {'|'} Ambo Market",
        "description": "Veja uma variedade de itens especiais 🏆. Colecionáveis, produtos artesanais e ofertas raras em toda Angola."
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
