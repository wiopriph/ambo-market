<script setup lang="ts">
import { CATEGORIES } from '~/constants/categories';
import { usePosts } from '~/composables/usePosts';


definePageMeta({
  middleware: 'set-filters-middleware',
});


const { t } = useI18n();

const title = computed(() => t('seo.index.title'));
const description = computed(() => t('seo.index.description'));

useHead({
  title: title.value,
  meta: [
    { key: 'og:title', property: 'og:title', content: title.value },
    { key: 'twitter:title', property: 'twitter:title', content: title.value },
    { key: 'description', name: 'description', content: description.value },
    { key: 'og:description', property: 'og:description', content: description.value },
    { key: 'twitter:description', property: 'twitter:description', content: description.value },
  ],
});


const {
  cityId,
  fetchPosts,
  isFindActive,
} = usePosts();

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
  watch: [() => route.query],
});


const hasPagination = computed(() => {
  if (posts.value?.resultsCount) {
    return Math.ceil(posts.value?.resultsCount / 10) > 1;
  }

  return false;
});

const setPage = (pageNumber: string) => {
  const query = { ...route.query };

  query.page = pageNumber;

  navigateTo({ query });
};
</script>

<template>
  <LazySearchBlock v-if="isFindActive" />

  <div
    v-else
    :class="$style.root"
  >
    <CategoryList
      :list="categories"
      :class="$style.category"
    />

    <div :class="$style.content">
      <div :class="$style.main">
        <h2
          :class="$style.title"
          v-text="t('all_ads')"
        />

        <ProductList :list="posts?.posts" />

        <UIPagination
          v-if="hasPagination"
          :view="3"
          :max="posts?.resultsCount"
          :class="$style.pagination"
          @input="setPage"
        />
      </div>

      <div :class="$style.right">
        <AD type="vertical" />

        <AD
          :class="$style.ad"
          type="vertical"
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

.main {
  flex: 1 1;
  min-width: 0;
}

.right {
  position: relative;
  flex: 0 240px;
  max-width: 240px;
  margin-left: 20px;

  @include md {
    display: none;
  }
}

.ad {
  position: sticky;
  top: (64px + 10px);
  margin-top: 20px;
}
</style>
