<script setup lang="ts">
import type { CategoryCard } from '~/components/Category/Card/types';


const categoryList = inject<ComputedRef<CategoryCard[]>>('categoryList');


const emit = defineEmits(['close']);

const close = () => emit('close');
</script>

<template>
  <div :class="$style.root">
    <ul
      v-if="categoryList"
      :class="$style.list"
    >
      <li
        v-for="category in categoryList"
        :key="category.title"
        :class="$style.item"
      >
        <NuxtLink
          :to="category.route"
          :class="$style.link"
          @click="close"
        >
          {{ category.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-round-ui-elements;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 500px;
  padding: 30px;
  background-color: $ui-color-white;
  border: 1px solid $ui-color-transparent;
  box-shadow: $box-shadow;
}

.list {
  column-count: 2;
  column-gap: 80px;
}

.item {
  margin-bottom: 10px;
}

.link {
  text-decoration: none;
  transition: color .2s linear, text-decoration .2s linear;

  &:hover {
    color: $ui-color-blue-light;
    text-decoration: underline;
  }
}
</style>
