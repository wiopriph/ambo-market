<script setup lang="ts">
import type { Props } from './types';


const props = defineProps<Props>();

const style = useCssModule();

const getTabClassNames = (value: string | number) => ({
  [style.tab]: true,
  [style.tabActive]: value === innerValue.value,
});


const emit = defineEmits(['update:modelValue']);

const innerValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
</script>

<template>
  <div :class="$style.root">
    <label
      v-for="option in options"
      :key="option.value"
      :class="getTabClassNames(option.value)"
    >
      <input
        v-model="innerValue"
        :value="option.value"
        :class="$style.input"
        type="radio"
      >

      <span>{{ option.label }}</span>
    </label>
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
}

.tab {
  @include ui-typo-12;
  position: relative;
  z-index: 0;
  display: inline-block;
  flex: 1;
  min-width: 70px;
  margin-right: -1px;
  padding: 10px;
  color: $ui-color-black;
  text-align: center;
  background-color: $ui-color-white;
  border: 1px solid $ui-color-transparent;
  border-radius: 0;
  cursor: pointer;
  user-select: none;

  &:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  &:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}

.tabActive {
  color: $ui-color-white;
  background-color: $ui-color-blue;
}

.input {
  display: none;
}
</style>
