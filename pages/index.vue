<script setup lang="ts">
import { CATEGORIES } from '~/constants/categories';
import { usePosts } from '~/composables/usePosts';
import { MAX_POSTS_PER_PAGE } from '~/composables/usePosts/constants';


definePageMeta({
  middleware: 'set-filters-middleware',
});

const {
  cityId,
  locationName,
  coords,
  page,
  getFilter,
  fetchPosts,
  isFindActive,
  isLoading,
} = usePosts();

const { t } = useI18n();

const seo = computed(() => {
  const searchQuery = getFilter('q');

  let translationKey;

  if (searchQuery) {
    translationKey = cityId.value !== 'all' ? 'search.withCity' : 'search.withoutCity';
  } else {
    translationKey = cityId.value !== 'all' ? 'default.withCity' : 'default.withoutCity';
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
  title: t(category.type),
  img: category.img,
  route: {
    name: 'cityId-categoryId',
    params: {
      categoryId: category.type,
      cityId: cityId.value,
    },
  },
})));


const route = useRoute();

const { data: posts } = await useAsyncData('posts', () => fetchPosts(), {
  watch: [coords, () => route.query],
});


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
        "h1": "All classifieds in {city}",
        "title": "Ambo Market - {city} Classifieds, Free Private Listings",
        "description": "Classifieds – fresh private ads for buying and selling all kinds of goods in {city}. The easiest way to sell or buy items. Post your ad for free on Ambo Market."
      },
      "withoutCity": {
        "h1": "All classifieds",
        "title": "Ambo Market - Classifieds, Free Private Listings",
        "description": "Classifieds – fresh private ads for buying and selling all kinds of goods. The easiest way to sell or buy items. Post your ad for free on Ambo Market."
      }
    },
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
    }
  },
  "pt": {
    "default": {
      "withCity": {
        "h1": "Todos os anúncios em {city}",
        "title": "Ambo Market - Classificados em {city}, anúncios grátis",
        "description": "Classificados – anúncios particulares recentes para compra e venda de todos os tipos de produtos em {city}. O jeito mais fácil de vender ou comprar. Anuncie grátis no Ambo Market."
      },
      "withoutCity": {
        "h1": "Todos os anúncios",
        "title": "Ambo Market - Classificados, anúncios grátis",
        "description": "Classificados – anúncios particulares recentes para compra e venda de todos os tipos de produtos. O jeito mais fácil de vender ou comprar. Anuncie grátis no Ambo Market."
      }
    },
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
    }
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <template v-if="isFindActive">
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
        </div>
      </div>
    </template>

    <template v-else>
      <CategoryList
        :list="categories"
        :class="$style.category"
      />

      <h1
        :class="$style.title"
        v-text="seo.h1"
      />

      <div :class="$style.content">
        <div :class="$style.left">
          <AD type="vertical" />

          <AD
            :class="$style.ad"
            type="vertical"
          />
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
    </template>
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
  margin-bottom: 36px;
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

.ad {
  position: sticky;
  top: (64px + 10px);
  margin-top: 20px;
}
</style>
