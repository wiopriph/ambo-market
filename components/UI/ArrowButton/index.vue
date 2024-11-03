<script setup lang="ts">
import type { Props } from './types';
import IconArrow from '~/assets/images/icon-arrow.svg?component';


const props = withDefaults(defineProps<Props>(), {
  direction: 'right',
});


const style = useCssModule();

const iconClassNames = computed(() => ({
  [style.line]: true,
  [style[props.direction]]: true,
}));


const emit = defineEmits(['click']);
</script>

<template>
  <button
    :class="$style.root"
    type="button"
    @click.prevent="emit('click')"
  >
    <span :class="iconClassNames">
      <IconArrow :class="$style.icon" />
    </span>
  </button>
</template>

<style lang="scss" module>
$icon-width: 48px;

.root {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-width: $icon-width;
  min-height: $icon-width;
  margin: 0;
  padding: 0;
  background-color: initial;
  border: none;
  cursor: pointer;
  appearance: none;
  user-select: none;

  &:disabled {
    cursor: default;
  }
}

.wrap {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: $icon-width;
  height: $icon-width;
  background-color: rgba($ui-color-text-main, .6);
  border-radius: 50%;
  transition: fill .2s linear, color .2s linear, background-color .2s linear;
  fill: $ui-color-white;

  &:hover {
    color: $ui-color-black;
    background-color: $ui-color-transparent;
    fill: $ui-color-black;
  }

  &:active {
    color: $ui-color-white;
    background-color: $ui-color-black;
    fill: $ui-color-white;
  }
}

.right {
  transform: rotate(-90deg);
}

.bottom {
  transform: rotate(0deg);
}

.left {
  transform: rotate(90deg);
}

.top {
  transform: rotate(-180deg);
}

.icon {
  width: 32px;
  height: 32px;
}
</style>
