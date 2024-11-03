<script setup lang="ts">
import type { Props } from './types';


const props = withDefaults(defineProps<Props>(), {
  tabindex: 0,
});


const emit = defineEmits([
  'update:modelValue',
  'blur',
  'focus',
]);

const innerValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
});
</script>

<template>
  <label :class="$style.root">
    <input
      v-model="innerValue"
      :value="val"
      :name="name"
      :tabindex="tabindex"
      :class="$style.input"
      type="radio"
      @blur="emit('blur')"
      @focus="emit('focus')"
    >

    <span :class="$style.inner">{{ text }}</span>
  </label>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
}

.input {
  position: absolute;
  z-index: $z-idx-under;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.inner {
  @include ui-round-ui-elements;
  @include ui-typo-16;

  width: 100%;
  height: 44px;
  padding: 12px;
  background-color: $ui-color-white;
  cursor: pointer;
  transition: border-color .2s linear, color .2s linear, background-color .2s linear;

  &:hover {
    background: $ui-color-transparent;
  }

  .input:checked ~ & {
    color: $ui-color-white;
    background-color: $ui-color-blue;
  }

  .input:focus ~ & {
    border-color: $ui-color-blue-light;
  }
}
</style>

