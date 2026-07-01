<script setup lang="ts">
import type { Post } from '~/composables/usePosts/types';
import { MAX_POSTS_PER_PAGE } from '~/composables/usePosts/constants';


interface ListProps {
  list?: Post[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyText?: string;
}


const props = withDefaults(defineProps<ListProps>(), {
  isLoading: false,
  emptyTitle: '',
  emptyText: '',
});

const hasList = computed(() => Array.isArray(props.list) && props.list.length);

const emptyTitle = computed(() => props.emptyTitle || 'Nada encontrado');
const emptyDescription = computed(() => props.emptyText || 'Não encontramos o que você estava procurando. Por favor, modifique os critérios de busca, os filtros selecionados ou a categoria.');
</script>

<template>
  <div
    v-if="isLoading"
    class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
  >
    <div
      v-for="index in MAX_POSTS_PER_PAGE"
      :key="index"
      class="flex flex-col overflow-hidden rounded-2xl border border-default bg-default"
    >
      <USkeleton class="aspect-square w-full" />

      <div class="p-2.5">
        <USkeleton class="h-5 w-14" />

        <USkeleton class="h-4 w-4/5 mt-2" />
      </div>
    </div>
  </div>

  <div
    v-else-if="hasList"
    class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
  >
    <ProductCard
      v-for="(product, index) in props.list"
      :key="index"
      :product="product"
      :priority="index < 5"
    />
  </div>

  <UEmpty
    v-else
    icon="i-lucide-package-search"
    :title="emptyTitle"
    :description="emptyDescription"
    class="mt-5 mb-10 mx-auto max-w-md"
  />
</template>
