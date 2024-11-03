<script setup lang="ts">
import type { Props } from './types';


const props = defineProps<Props>();
</script>

<template>
  <ul :class="$style.root">
    <li
      v-for="error in props.errors"
      :key="error"
      :class="$style.item"
      v-text="error"
    />
  </ul>
</template>

<style lang="scss" module>
.root {
  @include ui-typo-10;
  margin-top: 8px;
  color: $ui-color-system-red;
}

.item {

  & + & {
    margin-top: 4px;
  }
}
</style>
