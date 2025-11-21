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
  coords,
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

useHead({ title: title.value, meta: meta.value });

const categories = computed(() => CATEGORIES.map(category => ({
  title: t(category.key),
  img: category.img,
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
  { watch: [coords, () => route.query] },
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

<i18n lang="json">
{
  "en": {
    "default": {
      "withCity": {
        "h1": "Buy and Sell in {city}",
        "title": "Classifieds in {city} – Buy & Sell Locally {'|'} Ambo Market",
        "description": "Find local classifieds in {city} – fresh ads for buying and selling products of all kinds. Post your item for free and connect with local buyers on Ambo Market."
      },
      "withoutCity": {
        "h1": "Buy and Sell Across Angola",
        "title": "Free Classifieds in Angola – Buy & Sell Anything {'|'} Ambo Market",
        "description": "Browse nationwide classifieds – post your ad for free or find great deals on products and services in Angola. Fast, easy and local on Ambo Market."
      }
    },
    "search": {
      "withCity": {
        "h1": "Search results for «{q}» in {city}",
        "title": "{q} in {city} – Buy Now at the Best Price {'|'} Ambo Market",
        "description": "Browse listings for «{q}» in {city} – discover affordable products 🤩 with photos and reviews 💬 on Ambo Market. Sell your items fast and easy!"
      },
      "withoutCity": {
        "h1": "Search results for «{q}»",
        "title": "{q} for Sale – Best Prices in Angola {'|'} Ambo Market",
        "description": "Explore listings for «{q}» across Angola. Find the best deals 💸 with trusted sellers and useful reviews. Buy and sell easily with Ambo Market."
      }
    }
  },
  "pt": {
    "default": {
      "withCity": {
        "h1": "Compra e venda em {city}",
        "title": "Classificados em {city} – Anúncios Grátis de Compra e Venda {'|'} Ambo Market",
        "description": "Veja anúncios em {city} – produtos diversos para comprar ou vender. Publique seu anúncio grátis e negocie localmente no Ambo Market."
      },
      "withoutCity": {
        "h1": "Compra e venda em toda Angola",
        "title": "Classificados em Angola – Anuncie Grátis {'|'} Ambo Market",
        "description": "Classificados gratuitos em Angola – compre, venda e negocie com facilidade em todo o país. Encontre ofertas e publique anúncios grátis no Ambo Market."
      }
    },
    "search": {
      "withCity": {
        "h1": "Resultados para «{q}» em {city}",
        "title": "{q} em {city} – Compre com os melhores preços {'|'} Ambo Market",
        "description": "Veja anúncios para «{q}» em {city} – ofertas com fotos 🤩 e avaliações 💬. Compre e venda com praticidade no Ambo Market."
      },
      "withoutCity": {
        "h1": "Resultados para «{q}»",
        "title": "{q} à venda – Melhores ofertas em Angola {'|'} Ambo Market",
        "description": "Encontre anúncios de «{q}» em toda Angola. Compre com confiança 💸 – com fotos e avaliações de vendedores. Ambo Market é fácil e seguro."
      }
    }
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <h1
      :class="$style.title"
      v-text="seo.h1"
    />

    <CategoryList
      :list="categories"
      :class="$style.category"
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
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-simple-container;

  padding: 24px 20px;
}

.title {
  @include ui-typo-32-bold;

  margin-bottom: 24px;
}

.category {
  margin-bottom: 24px;
}

.content {
  display: flex;
}

.pagination {
  margin-top: 20px;
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
</style>
