<script setup lang="ts">
import type { Props } from './types';
import IconEye from '~/assets/images/icon-eye.svg?component';


const props = withDefaults(defineProps<Props>(), {
  count: 0,
});
</script>

<template>
  <div :class="$style.root">
    <IconEye :class="$style.icon" />

    <span
      :class="$style.text"
      v-text="props.count"
    />
  </div>
</template>

<style lang="scss" module>
.root {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  border-radius: 60px;
}

.icon {
  width: 12px;
  height: 12px;
  margin-right: 4px;
}

.text {
  @include ui-typo-10;
  color: $ui-color-black;
}
</style>
