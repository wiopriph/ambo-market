<script setup lang="ts">
const route = useRoute();

const { data: doc } = await useAsyncData(
  () => `blog-${route.params.slug}`,
  () => queryCollection('blog').path(route.path)
    .first(),
);

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
}

const title = computed(() => doc.value?.title || '');
const description = computed(() => doc.value?.description || '');
const image = computed(() => {
  const img = doc.value?.image || '';

  return img.startsWith('/images/') ? `${useRuntimeConfig().public.appBaseUrl}${img}` : img;
});

const meta = computed(() => {
  const metaTags = [
    { key: 'og:title', property: 'og:title', content: title.value },
    { key: 'twitter:title', property: 'twitter:title', content: title.value },
    { key: 'description', name: 'description', content: description.value },
    { key: 'og:description', property: 'og:description', content: description.value },
    { key: 'twitter:description', property: 'twitter:description', content: description.value },
  ];

  if (image.value) {
    metaTags.push(
      { key: 'og:image', property: 'og:image', content: image.value },
      { key: 'twitter:image', property: 'twitter:image', content: image.value },
    );
  }

  return metaTags;
});

const config = useRuntimeConfig();

const datePublished = computed(() => doc.value?.date || '');
const dateModified = computed(() => doc.value?.dateModified || datePublished.value);


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
    class="mx-auto  px-4 sm:px-5 py-6 sm:py-8 space-y-4"
  >
    <UBreadcrumb
      :items="breadcrumbs"
      class="hidden sm:flex"
    />

    <div class="rounded-2xl border border-default bg-default px-5 py-6">
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
  </div>
</template>
