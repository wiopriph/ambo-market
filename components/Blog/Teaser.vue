<script setup lang="ts">
type TeaserArticle = {
  path: string;
  title: string;
  date: string;
  isNews: boolean;
};

// без картинок намеренно: блок стоит выше товаров и не должен становиться LCP-элементом
const { data: articles } = await useFetch<TeaserArticle[]>('/api/blog/latest', {
  key: 'blog-latest',
  default: () => [],
});
</script>

<template>
  <nav
    v-if="articles.length"
    aria-label="Dicas e novidades do blog"
    class="flex flex-col gap-2 rounded-2xl border border-default bg-default px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
  >
    <NuxtLink
      :to="{ name: 'blog' }"
      class="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-highlighted hover:text-primary"
    >
      <UIcon
        name="i-lucide-newspaper"
        class="size-4 text-primary"
      />
      Dicas e novidades
    </NuxtLink>

    <ul class="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:gap-4">
      <li
        v-for="(article, index) in articles"
        :key="article.path"
        class="min-w-0 sm:flex-1"
        :class="{ 'hidden sm:block': index > 1 }"
      >
        <NuxtLink
          :to="article.path"
          class="flex items-center gap-1.5 text-sm text-muted hover:text-primary"
        >
          <UBadge
            v-if="article.isNews"
            label="Novo"
            color="primary"
            variant="soft"
            size="sm"
          />

          <span
            class="truncate"
            v-text="article.title"
          />
        </NuxtLink>
      </li>
    </ul>

    <NuxtLink
      :to="{ name: 'blog' }"
      class="shrink-0 text-xs text-primary"
    >
      Ver blog
    </NuxtLink>
  </nav>
</template>
