<script setup lang="ts">
const route = useRoute();
const { data: doc } = await useAsyncData(route.path, () => queryCollection('blog').path(route.path)
  .first());

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
}

const title = computed(() => doc.value?.title || '');
const description = computed(() => doc.value?.description || '');

// @todo: доделать работу с картинками
const meta = computed(() => [
  { key: 'og:title', property: 'og:title', content: title.value },
  { key: 'twitter:title', property: 'twitter:title', content: title.value },
  { key: 'description', name: 'description', content: description.value },
  { key: 'og:description', property: 'og:description', content: description.value },
  { key: 'twitter:description', property: 'twitter:description', content: description.value },
]);

useHead({ title: title.value, meta: meta.value });

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
    "main_page": "Main page",
    "blog": "Blog"
  },
  "pt": {
    "main_page": "Página inicial",
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

        <h1
          :class="$style.title"
          v-text="doc.title"
        />

        <ContentRenderer
          :value="doc"
          :class="$style.prose"
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


// для content
.prose {
  max-width: 100%;
  font-size: 16px;
  line-height: 1.6;
  color: $ui-color-black;

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.4;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
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

  p {
    margin: 0.5em 0;
  }

  ul, ol {
    padding-left: 1.2em;
    margin: 1em 0;
  }

  li {
    margin-bottom: 0.3em;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
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

  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 1em 0;
  }

  blockquote {
    border-left: 4px solid $ui-color-transparent;
    padding-left: 1em;
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
</style>
