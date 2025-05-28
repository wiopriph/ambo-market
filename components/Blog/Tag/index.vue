<script setup lang="ts">
import type { BlogTagProps } from './types';


const props = withDefaults(defineProps<BlogTagProps>(), {
  value: '',
  isActive: false,
});

const style = useCssModule();

const rootClassNames = computed(() => ({
  [style.root]: true,
  [style.active]: props.isActive,
}));
</script>

<template>
  <NuxtLink
    :to="route"
    :class="rootClassNames"
  >
    {{ value }}
  </NuxtLink>
</template>

<style lang="scss" module>
.root {
  @include ui-button;
  @include ui-round-content-blocks;

  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  color: $ui-color-black;
  background-color: $ui-color-transparent;
  border: 1px solid $ui-color-transparent;
}

.active {
  color: $ui-color-white;
  background-color: $ui-color-black;
  border: 1px solid $ui-color-black;
}
</style>
