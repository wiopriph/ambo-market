<script setup lang="ts">
import type { CategoryCard } from './types';


const props = defineProps<CategoryCard>();
</script>

<template>
  <NuxtLink
    :to="route"
    :class="$style.root"
  >
    <div
      :class="$style.label"
      v-text="props.title"
    />

    <NuxtImg
      :src="props.img"
      :class="$style.icon"
      loading="lazy"
      width="83"
      height="70"
      quality="90"
      alt=""
    />
  </NuxtLink>
</template>

<style lang="scss" module>
.root {
  @include ui-round-content-blocks;

  position: relative;
  display: flex;
  flex-direction: row;
  padding: 10px 5px 10px 10px;
  color: $ui-color-black;
  text-decoration: none;
  background-color: $ui-color-transparent;
  transition: background-color, box-shadow .2s linear;

  @include exclude-md {

    &:hover {
      background-color: #C7C7C7;
      box-shadow: rgba(0, 0, 0, .1) 0 8px 16px 0;
    }
  }
}

.label {
  @include ui-typo-14;

  z-index: 1;
  width: calc(100% - 85px);
  margin-right: 5px;
  hyphens: auto;
}

.icon {
  z-index: 1;
}
</style>
