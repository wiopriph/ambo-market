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

const { t } = useI18n();

const breadcrumbs = computed(() => [
  {
    title: t('main_page'),
    to: { name: 'index' },
  },
  {
    title: t('blog'),
    to: { name: 'blog' },
  },
  {
    title: doc.value?.title || '',
  },
]);
</script>

<i18n lang="json">
{
  "en": {
    "main_page": "Home",
    "blog": "Blog"
  },
  "pt": {
    "main_page": "Página Inicial",
    "blog": "Blog"
  }
}
</i18n>

<template>
  <div
    v-if="doc"
    :class="$style.root"
  >
    <div :class="$style.content">
      <div :class="$style.main">
        <UIBreadcrumbs :items="breadcrumbs" />

        <ContentRenderer
          :value="doc"
          :class="$style.prose"
        />

        <ul
          v-if="doc.tags?.length"
          :class="$style.tags"
        >
          <li
            v-for="tag in doc.tags"
            :key="tag"
          >
            <NuxtLink :to="{ name: 'blog', query: { tags: tag } }">
              {{ `#${tag.toLowerCase()}` }}
            </NuxtLink>
          </li>
        </ul>
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


// для content
.prose {
  max-width: 100%;
  font-size: 16px;
  line-height: 1.6;
  color: $ui-color-black;

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.4;
    margin-top: 18px;
    margin-bottom: 14px;
    color: $ui-color-black;
    text-decoration: none;

    a {
      color: inherit;
      text-decoration: none;
    }
  }

  h1 {
    font-size: 28px;
  }

  h2 {
    font-size: 22px;
  }

  h3 {
    font-size: 18px;
  }

  img {
    display: block;
    width: 100%;
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 10px 0;
  }

  p {
    margin: 0.5em 0;
  }

  ul, ol {
    padding-left: 1.2em;
    margin: 10px 0;
  }

  ul {
    list-style-type: disc;
  }

  li {
    margin-bottom: 4px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
    font-size: 15px;
  }

  th, td {
    border: 1px solid $ui-color-transparent;
    padding: 8px;
    text-align: left;
  }

  th {
    font-weight: 600;
  }

  blockquote {
    border-left: 4px solid $ui-color-transparent;
    padding-left: 10px;
    color: #555;
    font-style: italic;
    margin: 1em 0;
  }

  code {
    background: #f4f4f4;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 90%;
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}
</style>
