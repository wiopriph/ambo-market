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
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));

  @include md {
    padding: 0 $parent-padding;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }
}

.card {
  grid-column: span 1;
}
</style>

