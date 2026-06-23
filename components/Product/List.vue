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

const { t } = useI18n();

const emptyTitle = computed(() => props.emptyTitle || t('empty_title'));
const emptyDescription = computed(() => props.emptyText || t('empty_text'));
</script>

<i18n lang="json">
{
  "en": {
    "empty_title": "Nothing found",
    "empty_text": "We couldn't find what you were looking for. Please modify the search criteria, selected filters, or category."
  },
  "pt": {
    "empty_title": "Nada encontrado",
    "empty_text": "Não encontramos o que você estava procurando. Por favor, modifique os critérios de busca, os filtros selecionados ou a categoria."
  }
}
</i18n>

<template>
  <div
    v-if="isLoading"
    class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
  >
    <div
      v-for="index in MAX_POSTS_PER_PAGE"
      :key="index"
      class="flex flex-col overflow-hidden rounded-xl bg-white shadow"
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
