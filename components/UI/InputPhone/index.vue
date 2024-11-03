<script setup lang="ts">
import type { Props } from './types';

// @todo: добавить v-mask:phone

const props = withDefaults(defineProps<Props>(), {
  name: 'phone',
  isRequired: false,
  isDisabled: false,
});

const emit = defineEmits([
  'update:modelValue',
]);

const innerValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

const hasError = computed(() => props.errors && props.errors.length > 0);

const style = useCssModule();

const inputClassNames = computed(() => ({
  [style.input]: true,
  [style.input_disabled]: props.isDisabled,
  [style.input_required]: props.isRequired,
  [style.input_error]: hasError.value,
  'has-error': hasError.value,
}));
</script>

<template>
  <div :class="$style.root">
    <input
      v-model="innerValue"
      :name="name"
      :disabled="isDisabled"
      :placeholder="placeholder"
      :class="inputClassNames"
      type="tel"
      autocomplete="tel-national"
    >

    <label
      v-if="label"
      :class="$style.label"
      v-text="label"
    />

    <div :class="$style.background" />
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-input-root();

  width: 100%;
}

.input {
  @include ui-input-master();
  @include ui-input-state-normal();

  &:disabled,
  &_disabled {
    @include ui-input-state-disabled();
  }

  &_error {
    @include ui-input-state-error();
  }
}
</style>
