<script setup lang="ts">
import type { ErrorProps } from './types';


const props = defineProps<ErrorProps>();
</script>

<template>
  <span
    v-if="props.text"
    :class="$style.root"
    v-text="props.text"
  />
</template>

<style lang="scss" module>
.root {
  @include ui-typo-10;

  margin-top: 8px;
  color: $ui-color-system-red;
}
</style>
