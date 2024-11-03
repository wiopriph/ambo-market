<script setup lang="ts">
import type { Props } from './types';


const props = withDefaults(defineProps<Props>(), {
  type: 'common',
});


const style = useCssModule();

const rootClassNames = computed(() => ({
  [style.root]: true,
  [style[`root_${props.type}`]]: true,
}));
</script>

<template>
  <div :class="rootClassNames">
    <div :class="$style.dots" />
  </div>
</template>

<style lang="scss" module>
.root {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: (10px * 3 + 6px * 2 + 3px * 2);
}

.dots {
  position: relative;
  width: 10px;
  height: 10px;
  background-color: $ui-color-white;
  border-radius: 5px;
  animation: dotFlashing 1s infinite linear alternate;
  animation-delay: .5s;

  .root_gray & {
    animation-name: dotFlashingGray;
  }

  &::before {
    left: -16px;
    animation-delay: 0s;
  }

  &::after {
    left: 16px;
    animation-delay: 1s;
  }

  &::before,
  &::after {
    position: absolute;
    top: 0;
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: $ui-color-white;
    border-radius: 5px;
    animation: dotFlashing 1s infinite alternate;
    content: '';

    .root_gray & {
      animation-name: dotFlashingGray;
    }
  }
}

@mixin ui-animation-dot-flashing($name: '', $color: $ui-color-white) {
  $animation-name: dotFlashing#{$name};

  @keyframes #{$animation-name} {

    0% {
      background-color: rgba($color, 1);
    }

    50%,
    100% {
      background-color: rgba($color, .3);
    }
  }
}

@include ui-animation-dot-flashing('', $ui-color-white);
@include ui-animation-dot-flashing('Gray', $ui-color-text-main);
</style>
