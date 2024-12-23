<script setup lang="ts">
import type { InputTextAreaProps } from './types';


const props = withDefaults(defineProps<InputTextAreaProps>(), {
  label: '',
  name: 'text',
  placeholder: '',
  isRequired: false,
  isDisabled: false,
});

const emit = defineEmits(['update:modelValue']);

const innerValue = computed({
  get: () => props.modelValue,
  set(value: string) {
    emit('update:modelValue', value);
  },
});

const hasError = computed(() => !!props.error);


const style = useCssModule();

const inputClassNames = computed(() => ({
  [style.input]: true,
  [style.input_textarea]: true,
  [style.input_disabled]: props.isDisabled,
  [style.input_error]: hasError.value,
  [style.input_required]: props.isRequired,
  'has-error': hasError.value,
}));


const onBlur = () => {
  innerValue.value = innerValue.value.trim();
};
</script>

<template>
  <div :class="style.root">
    <textarea
      v-model="innerValue"
      :name="name"
      :disabled="isDisabled"
      :placeholder="placeholder"
      :class="inputClassNames"
      rows="7"
      @blur="onBlur"
    />

    <label
      v-if="label"
      :class="style.label"
      v-text="label"
    />

    <div :class="style.background" />
  </div>
</template>

<style lang="scss" module>
.root {
  position: relative;
  z-index: $z-idx-main;
  display: flex;
  flex-direction: column;
  width: 100%;
}

$height: 100px;

.input {
  @include ui-input-master();
  @include ui-input-state-normal();

  height: $height;
  resize: none;

  &_error {
    @include ui-input-state-error();
  }

  &:disabled,
  &_disabled {
    @include ui-input-state-disabled();
  }

  @include sm {
    height: $height;
  }

  ~ .background {
    height: $height;
  }

  &_textarea {
    overflow: auto;
    white-space: normal;
  }
}
</style>
