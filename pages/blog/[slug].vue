<script setup lang="ts">
import { formatFullDate } from '~/utils/formatDate';


const RELATED_COUNT = 3;

const route = useRoute();

const { data: doc } = await useAsyncData(
  () => `blog-${route.params.slug}`,
  () => queryCollection('blog').path(route.path)
    .first(),
);

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
}

// сначала статьи с тем же первым тегом, недостающие добираются из свежих
const { data: related } = await useAsyncData(
  () => `blog-related-${route.params.slug}`,
  async () => {
    const tag = doc.value?.tags?.[0];
    const byTag = tag ?
      await queryCollection('blog')
        .where('path', '<>', route.path)
        .where('tags', 'LIKE', `%${tag}%`)
        .order('date', 'DESC')
        .select('path', 'title', 'description', 'image', 'date', 'dateModified')
        .limit(RELATED_COUNT)
        .all() :
      [];

    if (byTag.length >= RELATED_COUNT) {
      return byTag;
    }

    const latest = await queryCollection('blog')
      .where('path', 'NOT IN', [route.path, ...byTag.map(article => article.path)])
      .order('date', 'DESC')
      .select('path', 'title', 'description', 'image', 'date', 'dateModified')
      .limit(RELATED_COUNT - byTag.length)
      .all();

    return [...byTag, ...latest];
  },
);

const title = computed(() => doc.value?.title || '');
const description = computed(() => doc.value?.description || '');
const image = computed(() => {
  const img = doc.value?.image || '';

  return img.startsWith('/images/') ? `${useRuntimeConfig().public.appBaseUrl}${img}` : img;
});

const meta = computed(() => {
  const metaTags: Record<string, string>[] = [
    { key: 'description', name: 'description', content: description.value },
    { key: 'og:type', property: 'og:type', content: 'article' },
    { key: 'og:title', property: 'og:title', content: title.value },
    { key: 'og:description', property: 'og:description', content: description.value },
    { key: 'twitter:card', name: 'twitter:card', content: image.value ? 'summary_large_image' : 'summary' },
    { key: 'twitter:title', property: 'twitter:title', content: title.value },
    { key: 'twitter:description', property: 'twitter:description', content: description.value },
  ];

  if (image.value) {
    metaTags.push(
      { key: 'og:image', property: 'og:image', content: image.value },
      { key: 'twitter:image', property: 'twitter:image', content: image.value },
    );
  }

  if (doc.value?.date) {
    metaTags.push({ key: 'article:published_time', property: 'article:published_time', content: String(doc.value.date) });
  }

  if (doc.value?.dateModified || doc.value?.date) {
    metaTags.push({ key: 'article:modified_time', property: 'article:modified_time', content: String(doc.value.dateModified || doc.value.date) });
  }

  return metaTags;
});

const config = useRuntimeConfig();

const datePublished = computed(() => doc.value?.date || '');
const dateModified = computed(() => doc.value?.dateModified || datePublished.value);
const isUpdated = computed(() => Boolean(doc.value?.dateModified) && dateModified.value !== datePublished.value);


const script = computed(() => [
  {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title.value,
      description: description.value,
      image: image.value,
      author: {
        '@type': 'Person',
        name: 'Equipe Ambo',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Ambo Market',
        logo: {
          '@type': 'ImageObject',
          url: `${config.public.appBaseUrl}/images/background.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${config.public.appBaseUrl}${route.path}`,
      },
      datePublished: datePublished.value,
      dateModified: dateModified.value,
    }),
  },
]);

useHead({
  title: title.value,
  meta: meta.value,
  script: script.value,
});

const breadcrumbs = computed(() => [
  { label: 'Página Inicial', to: { name: 'index' } },
  { label: 'Blog', to: { name: 'blog' } },
  { label: doc.value?.title || '' },
]);
</script>

<template>
  <div
    v-if="doc"
    class="space-y-4"
  >
    <UBreadcrumb
      :items="breadcrumbs"
      class="hidden sm:flex"
    />

    <div class="rounded-2xl border border-default bg-default px-5 py-6">
      <p
        v-if="datePublished"
        class="mb-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted"
      >
        <span>
          Publicado em
          <time :datetime="String(datePublished)">{{ formatFullDate(datePublished, 'pt') }}</time>
        </span>

        <span v-if="isUpdated">
          Atualizado em
          <time :datetime="String(dateModified)">{{ formatFullDate(dateModified, 'pt') }}</time>
        </span>
      </p>

      <ContentRenderer
        :value="doc"
        class="prose prose-sm dark:prose-invert max-w-none"
      />
    </div>

    <div
      v-if="doc.tags?.length"
      class="flex flex-wrap gap-2"
    >
      <UButton
        v-for="tag in doc.tags"
        :key="tag"
        :to="{ name: 'blog', query: { tags: tag } }"
        :label="`#${tag.toLowerCase()}`"
        color="neutral"
        variant="soft"
        size="sm"
      />
    </div>

    <section
      v-if="related?.length"
      class="space-y-3"
    >
      <h2 class="text-base font-bold text-highlighted">
        Leia também
      </h2>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <NuxtLink
          v-for="article in related"
          :key="article.path"
          :to="article.path"
          class="group flex gap-3 rounded-2xl border border-default bg-default p-3 transition hover:border-primary/40 hover:shadow-sm sm:flex-col sm:gap-2"
        >
          <div class="size-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:aspect-[16/9] sm:size-auto sm:w-full">
            <img
              v-if="article.image"
              :src="article.image"
              :alt="article.title"
              class="size-full object-cover transition group-hover:scale-105"
              loading="lazy"
            >
          </div>

          <div class="flex min-w-0 flex-col gap-1">
            <p
              class="text-sm font-semibold leading-snug text-highlighted line-clamp-2"
              v-text="article.title"
            />

            <p
              class="hidden text-xs leading-relaxed text-muted line-clamp-2 sm:block"
              v-text="article.description"
            />

            <time
              class="text-xs text-muted"
              :datetime="String(article.dateModified || article.date)"
              v-text="formatFullDate(article.dateModified || article.date, 'pt')"
            />
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
