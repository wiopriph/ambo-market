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

const customSelectText = computed(() => {
  const selectedOption = props.options.find(item => item.value === innerValue.value);

  return selectedOption?.text || innerValue.value;
});


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

const isCustomSelectOpened = ref<boolean>(false);

const customSelectClassNames = computed(() => ({
  [style.customSelect__input]: true,
  [style.input_opened]: isCustomSelectOpened.value,
}));

const getCustomOptionClassNames = (value: string) => ({
  [style.optionButton]: true,
  [style.optionButton_selected]: value === innerValue.value,
});

const selectOption = (value: string) => {
  innerValue.value = value;
  isCustomSelectOpened.value = false;
};

const onFocus = () => {
  emit('focus');
  isFocused.value = true;
};

const onBlur = () => {
  emit('blur');
  isFocused.value = false;
};

const onClickOutside = () => {
  if (isFocused.value) {
    closeCustomSelect();
  }
};

const openCustomSelect = () => {
  isCustomSelectOpened.value = true;
  onFocus();
};

const closeCustomSelect = () => {
  isCustomSelectOpened.value = false;
  onBlur();
};
</script>

<template>
  <div :class="$style.root">
    <select
      v-model="innerValue"
      :class="[inputClassNames, $style.input_native]"
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

    <label
      v-if="label"
      :class="$style.label"
      v-text="label"
    />

    <label
      v-click-outside="onClickOutside"
      :class="$style.customSelect"
    >
      <input
        :value="customSelectText"
        :placeholder="placeholder"
        :class="[inputClassNames, customSelectClassNames]"
        :disabled="isDisabled"
        type="text"
        tabindex="-1"
        readonly
        @click="openCustomSelect"
      >

      <ul :class="$style.optionsList">
        <li
          v-for="(item, index) in options"
          :key="index"
          :class="$style.option"
        >
          <button
            :class="getCustomOptionClassNames(item.value)"
            type="button"
            @click="selectOption(item.value)"
            v-text="item.text"
          />
        </li>
      </ul>
    </label>

    <div :class="$style.background" />
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
  overflow: initial;
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

  &_opened {
    @include ui-input-state-hover();
    border-radius: 4px 4px 0 0;
  }

  @include exclude-md {

    &_native {
      opacity: 0;

      &:focus {
        opacity: 1;
      }
    }
  }
}

.option {
  color: $ui-color-black;
}

.customSelect {
  position: absolute;
  top: 0;
  left: 0;
  order: 1;
  width: 100%;

  .label ~ & {
    top: 24px;
  }

  &__input {
    position: relative;
    z-index: $z-idx-over;
  }

  .input.input_native:focus ~ & {
    display: none;
  }

  @include md {
    display: none;
  }
}

.optionsList {
  position: absolute;
  z-index: $z-idx-dropdown;
  display: none;
  width: 100%;
  max-height: 190px;
  overflow-y: auto;
  background-color: $ui-color-white;
  border: 1px solid $ui-color-blue;
  border-radius: 0 0 4px 4px;

  .customSelect__input.input_opened ~ & {
    display: flex;
    flex-direction: column;
  }

  .optionButton {
    @include ui-typo-15;
    width: 100%;
    margin: 0;
    padding: 12px 14px;
    overflow: hidden;
    white-space: nowrap;
    text-align: left;
    text-overflow: ellipsis;
    background-color: $ui-color-white;
    border: none;
    cursor: pointer;
    transition: color .2s linear;
    appearance: none;

    &:hover:not(#{&}_selected) {
      background-color: $ui-color-transparent;
    }

    &_selected {
      color: $ui-color-white;
      background-color: $ui-color-blue;
    }
  }
}
</style>
