<script setup lang="ts">
const route = useRoute();

const PER_PAGE = 10;

const { data: posts } = await useAsyncData('posts', () => queryCollection('blog')
  .limit(PER_PAGE)
  .skip(((Number(route.query.page) || 1) - 1) * PER_PAGE)
  .all(), {
  watch: [() => route.params],
});


const { data: postCount } = await useAsyncData('postCount', () => queryCollection('blog').count(), {
  watch: [() => route.params],
});


const totalPages = computed(() => postCount.value ? Math.ceil(postCount.value / PER_PAGE) : 1);
const currentPage = computed(() => Number(route.query.page) || 1);

const hasPagination = computed(() => totalPages.value && totalPages.value > 1);

const setPage = (pageNumber: number) => {
  navigateTo({ query: { ...route.query, page: pageNumber } });
};

const { t } = useI18n();

const title = computed(() => t('title'));
const description = computed(() => t('description'));

const meta = computed(() => [
  { key: 'og:title', property: 'og:title', content: title.value },
  { key: 'twitter:title', property: 'twitter:title', content: title.value },
  { key: 'description', name: 'description', content: description.value },
  { key: 'og:description', property: 'og:description', content: description.value },
  { key: 'twitter:description', property: 'twitter:description', content: description.value },
]);

useHead({ title: title.value, meta: meta.value });


const breadcrumbs = computed(() => [
  {
    title: t('main_page'),
    to: { name: 'index' },
  },
  {
    title: t('blog'),
  },
]);
</script>

<i18n lang="json">
{
  "en": {
    "main_page": "Main page",
    "blog": "Blog",
    "title": "Ambo Market Blog – Tips, Guides & Market Trends in Angola",
    "h1": "Ambo Market Blog",
    "description": "Discover tips, how-to guides, and market news on the Ambo Market blog. Stay informed and grow your buying or selling skills in Angola!",
    "not_found": "No articles found matching your request."
  },
  "pt": {
    "main_page": "Página inicial",
    "blog": "Blog",
    "title": "Blog da Ambo Market – Dicas, Guias e Tendências do Mercado Angolano",
    "h1": "Blog da Ambo Market",
    "description": "Explore dicas, tutoriais e notícias do mercado no blog da Ambo Market. Fique informado e aprimore sua experiência de compra e venda em Angola!",
    "not_found": "Nenhum artigo encontrado para esta pesquisa."
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <div :class="$style.content">
      <div :class="$style.main">
        <UIBreadcrumbs :items="breadcrumbs" />

        <h1
          :class="$style.title"
          v-text="t('h1')"
        />

        <ul
          v-if="posts?.length"
          :class="$style.list"
        >
          <li
            v-for="post in posts"
            :key="post.path"
            :class="$style.post"
          >
            <BlogCard
              :route="post.path"
              :title="post.title"
              :img="post?.image"
              :date="post.date"
            />
          </li>
        </ul>

        <div
          v-else
          v-text="t('not_found')"
        />

        <UIPagination
          v-if="hasPagination"
          :view="3"
          :value="currentPage"
          :max="totalPages"
          :class="$style.pagination"
          @input="setPage"
        />
      </div>

      <div :class="$style.left" />
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

  margin-top: 10px;
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
  margin-left: 20px;

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

.list {
  @include ui-row;
}

.post {
  @include ui-col-ready;
  @include ui-col-vertical-gutter;
  @include ui-col(4);

  @include md {
    @include ui-col(6);
  }

  @include sm {
    @include ui-col(12);
  }
}
</style>
