<script setup lang="ts">
import type { Props } from './types';


const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
});

const emit = defineEmits([
  'update:modelValue',
]);

const innerValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
});


const style = useCssModule();

const inputClassNames = computed(() => ({
  [style.input]: true,
  [style.active]: props.modelValue,
}));
</script>

<template>
  <label :class="$style.root">
    <input
      v-model="innerValue"
      :class="inputClassNames"
      type="checkbox"
    >

    <span :class="$style.slider" />
  </label>
</template>

<style lang="scss" module>
.root {
  display: inline-flex;
  width: 36px;
  height: 20px;
}

.slider {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: $ui-color-white;
  border: 1px solid $ui-color-transparent;
  border-radius: 64px;
  cursor: pointer;
  transition: border .2s linear, background-color .2s linear;

  &::before {
    position: absolute;
    bottom: 3px;
    left: 4px;
    width: 12px;
    height: 12px;
    background-color: $ui-color-text-main;
    border-radius: 50%;
    transition: transform .2s linear, background-color .2s linear;
    content: '';
  }
}

.input {
  display: none;

  &.active {

    + .slider {
      background-color: $ui-color-blue;
      border: 1px solid $ui-color-blue;

      &::before {
        background-color: $ui-color-white;
        transform: translateX(14px);
      }
    }
  }
}
</style>
