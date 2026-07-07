<script setup lang="ts">
import type { Post } from '~/composables/usePosts/types';


useHead({ title: 'Favoritos - Ambo Market' });

const { favoriteIds } = useFavorites();

// useFetch пробрасывает cookie сессии при SSR — страница приходит сразу с данными
const { data, status, refresh } = await useFetch<{ posts: Post[]; resultsCount: number }>(
  '/api/favorites',
);

const posts = computed(() => data.value?.posts ?? []);
const isLoading = computed(() => status.value === 'pending');

// удаление из избранного на этой же странице -> обновляем список
watch(favoriteIds, (ids, oldIds) => {
  // реагируем только на реальное изменение (не на первичную загрузку id при логине)
  if (ids.length !== oldIds.length) {
    refresh();
  }
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
