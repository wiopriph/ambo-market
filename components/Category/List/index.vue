<script setup lang="ts">
import type { Props } from './types';


const props = defineProps<Props>();
</script>

<template>
  <div :class="$style.root">
    <div :class="$style.wrap">
      <CategoryCard
        v-for="(category, index) in props.list"
        :key="index"
        :title="category.title"
        :img="category.img"
        :route="category.route"
        :class="$style.card"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
$parent-padding: 20px; // fix: компенсация бокового padding на малых экранах

.root {
  @include md {
    margin-right: -$parent-padding;
    margin-left: -$parent-padding;
    overflow: auto;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar { // fix: полоска прокрутки
      width: 0;
      height: 0;
    }
  }
}

.wrap {
  display: grid;
  grid-gap: 8px;
  grid-template-rows: repeat(2, 100px);
  grid-template-columns: repeat(5, minmax(160px, 300px));

  @include md {
    width: max-content;
    padding: 0 $parent-padding;
  }
}

.card {
  grid-column: span 1;
}
</style>
