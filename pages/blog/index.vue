<script setup lang="ts">
const route = useRoute();

const PER_PAGE = 20;

const { data: posts } = await useAsyncData('posts', () => {
  const tagsQuery = route.query.tags || '';

  const query = queryCollection('blog')
    .limit(PER_PAGE)
    .skip(((Number(route.query.page) || 1) - 1) * PER_PAGE);

  if (tagsQuery) {
    query.where('tags', 'LIKE', `%${tagsQuery}%`);
  }

  return query.all();
}, {
  watch: [() => route.query],
});

const TAGS = [
  'Guias',
  'Imóveis',
  'Transporte',
  'Eletrônicos',
  'Negócios',
];

const currentTag = computed(() => route.query.tags || 'Todos os temas');

const tagsList = computed(() => {
  const list = [{
    title: 'Todos os temas',
    route: { name: 'blog' },
  }];

  TAGS.forEach((tag) => {
    list.push({
      title: tag,
      route: {
        name: 'blog',
        query: {
          tags: tag,
        },
      },
    });
  });

  return list;
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
    "main_page": "Home",
    "blog": "Blog",
    "title": "Ambo Market Blog – Expert Tips, Guides & Market Insights from Angola",
    "h1": "Ambo Market Blog",
    "description": "Stay ahead with expert tips, step-by-step guides, and the latest market trends on the Ambo Market blog. Whether you're buying or selling in Angola, our blog helps you succeed!",
    "not_found": "Sorry, no articles match your search. Try another topic!"
  },
  "pt": {
    "main_page": "Página Inicial",
    "blog": "Blog",
    "title": "Blog da Ambo Market – Dicas, Guias e Insights do Mercado Angolano",
    "h1": "Blog da Ambo Market",
    "description": "Fique à frente com dicas de especialistas, guias passo a passo e as últimas tendências do mercado no blog da Ambo Market. Se você compra ou vende em Angola, nosso blog é seu parceiro para o sucesso!",
    "not_found": "Desculpe, nenhum artigo encontrado para essa pesquisa. Tente outro tema!"
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

        <ul :class="$style.tags">
          <li
            v-for="tag in tagsList"
            :key="tag.title"
          >
            <BlogTag
              :value="tag.title"
              :route="tag.route"
              :isActive="tag.title === currentTag"
            />
          </li>
        </ul>

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
              :tags="post.tags"
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

  margin-top: 18px;
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

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}
</style>
