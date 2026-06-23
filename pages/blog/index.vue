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
    "read_more": "Read more",
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
    "read_more": "Ler mais",
    "not_found_title": "Nenhum artigo encontrado",
    "not_found": "Desculpe, nenhum artigo encontrado para essa pesquisa. Tente outro tema!"
  }
}
</i18n>

<template>
  <div class="mx-auto max-w-[1280px] px-4 sm:px-5 py-6 sm:py-8 space-y-5">

    <UBreadcrumb :items="breadcrumbs" class="hidden sm:flex" />

    <!-- Header -->
    <div class="rounded-2xl border border-default bg-default px-5 py-4">
      <h1 class="text-lg font-bold text-highlighted" v-text="t('h1')" />
      <p class="mt-0.5 text-sm text-muted" v-text="t('description')" />
    </div>

    <!-- Tag filters -->
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

    <!-- Posts grid -->
    <div
      v-if="posts?.length"
      class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      <NuxtLink
        v-for="post in posts"
        :key="post.path"
        :to="post.path"
        class="group flex flex-col overflow-hidden rounded-2xl border border-default bg-default transition hover:border-primary/40 hover:shadow-sm"
      >
        <div class="aspect-[16/9] overflow-hidden bg-muted">
          <NuxtImg
            v-if="post.image"
            :src="post.image"
            :alt="post.title"
            class="size-full object-cover transition group-hover:scale-105"
            loading="lazy"
            sizes="sm:100vw md:50vw lg:420px"
          />
          <div v-else class="size-full flex items-center justify-center">
            <UIcon name="i-lucide-newspaper" class="size-10 text-muted" />
          </div>
        </div>

        <div class="flex flex-1 flex-col gap-2 p-4">
          <div v-if="post.tags?.length" class="flex flex-wrap gap-1">
            <UBadge
              v-for="tag in post.tags"
              :key="tag"
              :label="tag"
              color="neutral"
              variant="soft"
              size="sm"
            />
          </div>

          <p class="text-sm font-semibold text-highlighted line-clamp-2 leading-snug" v-text="post.title" />
          <p class="text-xs text-muted line-clamp-2 leading-relaxed flex-1" v-text="post.description" />

          <div class="flex items-center gap-1 text-xs text-primary mt-1">
            <span>{{ t('read_more') }}</span>
            <UIcon name="i-lucide-arrow-right" class="size-3" />
          </div>
        </div>
      </NuxtLink>
    </div>

    <UEmpty
      v-else
      icon="i-lucide-search-x"
      :title="t('not_found_title')"
      :description="t('not_found')"
      variant="naked"
      size="lg"
    />

    <div v-if="hasPagination" class="flex justify-center">
      <UPagination
        :page="currentPage"
        :total="postCount || 0"
        :itemsPerPage="PER_PAGE"
        size="sm"
        @update:page="setPage"
      />
    </div>
  </div>
</template>
