<script setup lang="ts">
import type { Props } from './types';


const props = withDefaults(defineProps<Props>(), {
  text: '',
  isDisabled: false,
  tabindex: 0,
});


const emit = defineEmits([
  'update:modelValue',
  'blur',
  'focus',
]);

const innerValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});
</script>

<template>
  <label :class="$style.root">
    <input
      v-model="innerValue"
      :value="val"
      :name="name"
      :disabled="isDisabled"
      :tabindex="tabindex"
      :class="$style.input"
      type="radio"
      @blur="emit('blur')"
      @focus="emit('focus')"
    >

    <span
      :class="$style.inner"
      v-text="text"
    />
  </label>
</template>

<style lang="scss" module>
.input {
  position: absolute;
  opacity: 0;

  + .inner {
    @include ui-typo-15;
    line-height: 20px;
    cursor: pointer;

    &::before {
      position: relative;
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-right: 8px;
      text-align: center;
      vertical-align: top;
      background: $ui-color-white;
      border: 1px solid $ui-color-transparent;
      border-radius: 100%;
      transition: all .2s linear;
      content: '';
    }
  }

  &:checked {

    + .inner {

      &::before {
        background-color: $ui-color-white;
        border: 1px solid $ui-color-blue;
        box-shadow: inset 0 0 0 4px $ui-color-blue;
      }
    }
  }

  &:focus {

    + .inner {

      &::before {
        border-color: $ui-color-blue;
        outline: none;
      }
    }
  }

  &:disabled {

    + .inner {
      cursor: default;

      &::before {
        background: $ui-color-transparent;
        border-color: $ui-color-transparent;
        box-shadow: inset 0 0 0 4px $ui-color-white;
      }
    }
  }
}
</style>
