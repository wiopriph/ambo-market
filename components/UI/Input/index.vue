<script setup lang="ts">
import type { InputProps } from './types';


const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  isRequired: false,
  isDisabled: false,
  isSuccess: false,
});

const emit = defineEmits([
  'update:modelValue',
  'submit',
]);

const innerValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

const hasError = computed(() => !!props.error);

const style = useCssModule();

const inputClassNames = computed(() => ({
  [style.input]: true,
  [style.input_disabled]: props.isDisabled,
  [style.input_required]: props.isRequired,
  [style.input_success]: props.isSuccess,
  [style.input_error]: hasError.value,
  'has-error': hasError.value,
}));

const submit = () => {
  emit('submit', innerValue);
};
</script>

<template>
  <div :class="$style.root">
    <input
      v-model="innerValue"
      :name="name"
      :type="type"
      :disabled="isDisabled"
      :autocomplete="name"
      :placeholder="placeholder"
      :class="inputClassNames"
      @keydown.enter="submit"
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

  &_success {
    @include ui-input-state-success();

    background-image: url('~/assets/images/profile/icon-verified.svg');
    background-repeat: no-repeat;
    background-position: right 16px center;
  }
}
</style>
