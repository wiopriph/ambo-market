<script setup lang="ts">
import type { SelectProps } from './types';


const props = withDefaults(defineProps<SelectProps>(), {
  label: '',
  placeholder: '',
  isRequired: false,
  sort: false,
  isDisabled: false,
});

const emit = defineEmits([
  'update:modelValue',
  'focus',
  'blur',
]);

const isFocused = ref<boolean>(false);

const innerValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
    isFocused.value = false;
  },
});

const onFocus = () => {
  emit('focus');
  isFocused.value = true;
};

const onBlur = () => {
  emit('blur');
  isFocused.value = false;
};


const style = useCssModule();
const hasError = computed(() => !!props.error);

const inputClassNames = computed(() => ({
  [style.input]: true,
  [style.input_empty]: !innerValue.value,
  [style.input_nonEmpty]: !!innerValue.value,
  [style.input_disabled]: props.isDisabled,
  [style.input_error]: hasError.value && !isFocused.value,
  [style.input_required]: props.isRequired,
  'has-error': hasError.value,
}));
</script>

<template>
  <div :class="$style.root">
    <label :class="$style.label">
      <select
        v-model="innerValue"
        :class="inputClassNames"
        :disabled="isDisabled"
        @focus="onFocus"
        @blur="onBlur"
      >
        <option
          value=""
          disabled
          selected
          hidden
          v-text="placeholder"
        />

        <option
          v-for="(item, index) in options"
          :key="index"
          :class="$style.option"
          :value="item.value"
          v-text="item.text"
        />
      </select>
    </label>
  </div>
</template>

<style lang="scss" module>
.root {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input {
  @include ui-input-master();
  @include ui-input-state-normal();
  background: url('@/assets/images/icon-carret.svg') no-repeat calc(100% - 15px) center;
  cursor: pointer;

  &_error {
    @include ui-input-state-error();
  }

  &_empty {
    color: $ui-color-text-light;
  }

  &_nonEmpty {
    color: $ui-color-text-main;
  }

  &:disabled,
  &_disabled {
    @include ui-input-state-disabled();
  }
}

.option {
  color: $ui-color-black;
}

.label {
  @include ui-typo-15-bold;
  background-color: $ui-color-white;
}
</style>

