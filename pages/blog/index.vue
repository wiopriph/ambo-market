<script setup lang="ts">
const route = useRoute();

const PER_PAGE = 20;

const selectedTag = computed(() => {
  const tags = route.query.tags;

  if (typeof tags === 'string') {
    return tags;
  }

  if (Array.isArray(tags) && typeof tags[0] === 'string') {
    return tags[0];
  }

  return '';
});

const createBlogQuery = () => {
  const query = queryCollection('blog');

  if (selectedTag.value) {
    query.where('tags', 'LIKE', `%${selectedTag.value}%`);
  }

  return query;
};

const { data: posts } = await useAsyncData(
  () => `blog-${selectedTag.value || 'all'}-${route.query.page || 1}`,
  () => createBlogQuery()
    .limit(PER_PAGE)
    .skip(((Number(route.query.page) || 1) - 1) * PER_PAGE)
    .all(),
  { watch: [() => route.query] },
);

const TAGS = [
  'Guias',
  'Imóveis',
  'Transporte',
  'Eletrônicos',
  'Negócios',
];

const { t } = useI18n();

const currentTag = computed(() => selectedTag.value);

const tagsList = computed(() => {
  const list = [{
    title: t('all_topics'),
    value: '',
    route: { name: 'blog' },
  }];

  TAGS.forEach((tag) => {
    list.push({
      title: tag,
      value: tag,
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


const { data: postCount } = await useAsyncData(
  () => `blog-count-${selectedTag.value || 'all'}`,
  () => createBlogQuery().count(),
  { watch: [() => route.query] },
);


const totalPages = computed(() => postCount.value ? Math.ceil(postCount.value / PER_PAGE) : 1);
const currentPage = computed(() => Number(route.query.page) || 1);

const hasPagination = computed(() => totalPages.value && totalPages.value > 1);

const setPage = (pageNumber: number) => {
  navigateTo({
    query: {
      ...route.query,
      page: pageNumber > 1 ? pageNumber : undefined,
    },
  });
};

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
    label: t('main_page'),
    to: { name: 'index' },
  },
  {
    label: t('blog'),
  },
]);
</script>

<i18n lang="json">
{
  "en": {
    "main_page": "Home",
    "blog": "Blog",
    "all_topics": "All topics",
    "title": "Ambo Market Blog – Expert Tips, Guides & Market Insights from Angola",
    "h1": "Ambo Market Blog",
    "description": "Stay ahead with expert tips, step-by-step guides, and the latest market trends on the Ambo Market blog. Whether you're buying or selling in Angola, our blog helps you succeed!",
    "not_found_title": "No articles found",
    "not_found": "Sorry, no articles match your search. Try another topic!"
  },
  "pt": {
    "main_page": "Página Inicial",
    "blog": "Blog",
    "all_topics": "Todos os temas",
    "title": "Blog da Ambo Market – Dicas, Guias e Insights do Mercado Angolano",
    "h1": "Blog da Ambo Market",
    "description": "Fique à frente com dicas de especialistas, guias passo a passo e as últimas tendências do mercado no blog da Ambo Market. Se você compra ou vende em Angola, nosso blog é seu parceiro para o sucesso!",
    "not_found_title": "Nenhum artigo encontrado",
    "not_found": "Desculpe, nenhum artigo encontrado para essa pesquisa. Tente outro tema!"
  }
}
</i18n>

<template>
  <section class="space-y-6 py-4 sm:py-8">
    <UBreadcrumb :items="breadcrumbs" />

    <div class="space-y-3">
      <h1
        class="text-3xl font-bold text-highlighted sm:text-4xl"
        v-text="t('h1')"
      />

      <p
        class="max-w-3xl text-base leading-7 text-muted"
        v-text="t('description')"
      />
    </div>

    <div class="flex flex-wrap gap-2">
      <UButton
        v-for="tag in tagsList"
        :key="tag.title"
        :to="tag.route"
        :label="tag.title"
        color="neutral"
        :variant="tag.value === currentTag ? 'solid' : 'soft'"
        size="sm"
      />
    </div>

    <div
      v-if="posts?.length"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <UBlogPost
        v-for="post in posts"
        :key="post.path"
        :to="post.path"
        :title="post.title"
        :description="post.description"
        :image="post.image"
        variant="outline"
      >
        <template
          v-if="post.tags?.length"
          #authors
        >
          <div class="flex flex-wrap gap-1.5">
            <UBadge
              v-for="tag in post.tags"
              :key="tag"
              :label="tag"
              color="neutral"
              variant="soft"
            />
          </div>
        </template>
      </UBlogPost>
    </div>

    <UEmpty
      v-else
      icon="i-lucide-search-x"
      :title="t('not_found_title')"
      :description="t('not_found')"
      variant="naked"
      size="lg"
    />

    <div
      v-if="hasPagination"
      class="flex justify-center"
    >
      <UPagination
        :page="currentPage"
        :total="postCount || 0"
        :itemsPerPage="PER_PAGE"
        size="sm"
        @update:page="setPage"
      />
    </div>
  </section>
</template>
