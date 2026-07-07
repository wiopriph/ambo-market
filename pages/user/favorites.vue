<script setup lang="ts">
import type { Post } from '~/composables/usePosts/types';


definePageMeta({ middleware: 'auth' });

useHead({
  title: 'Favoritos - Ambo Market',
  meta: [{ key: 'robots', name: 'robots', content: 'noindex, nofollow' }],
});

const { favoriteIds } = useFavorites();

const { data, status, refresh } = await useLazyFetch<{ posts: Post[]; resultsCount: number }>(
  '/api/favorites',
  { server: false },
);

const posts = computed(() => data.value?.posts ?? []);
const isLoading = computed(() => status.value === 'pending');

// удаление из избранного на этой же странице -> обновляем список
watch(favoriteIds, () => {
  refresh();
});
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-lg font-bold text-highlighted">
      Favoritos
    </h1>

    <ProductList
      :list="posts"
      :isLoading="isLoading"
      emptyTitle="Ainda não tem favoritos"
      emptyText="Toque no coração de um anúncio para o guardar aqui."
    />
  </div>
</template>
