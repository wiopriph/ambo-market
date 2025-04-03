<script setup lang="ts">
import type { ListProps } from './types';
import { MAX_POSTS_PER_PAGE } from '~/composables/usePosts/constants';


const props = withDefaults(defineProps<ListProps>(), {
  isLoading: false,
  emptyTitle: '',
  emptyText: '',
});

const hasList = computed(() => Array.isArray(props.list) && props.list.length);
</script>

<template>
  <ul
    v-if="isLoading"
    :class="$style.root"
  >
    <li
      v-for="index in MAX_POSTS_PER_PAGE"
      :key="index"
      :class="$style.card"
    >
      <ProductCardSkeleton />
    </li>
  </ul>

  <ul
    v-else-if="hasList"
    :class="$style.root"
  >
    <li
      v-for="(product, index) in props.list"
      :key="index"
      :class="$style.card"
    >
      <ProductCard :product="product" />
    </li>
  </ul>

  <ProductListEmpty
    v-else
    :customTitle="emptyTitle"
    :customText="emptyText"
  />
</template>

<style lang="scss" module>
.root {
  @include ui-row;
}

.card {
  @include ui-col-ready;
  @include ui-col-vertical-gutter;
  @include ui-col(3);

  @include md {
    @include ui-col(4);
  }

  @include sm {
    @include ui-col(6);
  }
}
</style>
