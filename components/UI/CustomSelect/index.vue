<script setup lang="ts">
import type { Props } from './types';


const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: '',
  isRequired: false,
  sort: false,
  isDisabled: false,
});

const { t } = useI18n();

const emit = defineEmits([
  'update:modelValue',
  'focus',
  'blur',
]);

const isFocused = ref(false);
const isCustomSelectOpened = ref(false);
const searchString = ref('');

const innerValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
    isFocused.value = false;
  },
});

const filteredOptions = computed(() => {
  const options = [...props.options];

  if (props.sort) {
    options.sort((first, second) => {
      if (first.text < second.text) {
        return -1;
      }

      if (first.text > second.text) {
        return 1;
      }

      return 0;
    });
  }

  if (searchString.value) {
    return options.filter(item =>
      item.text.toLowerCase().includes(searchString.value.toLowerCase()),
    );
  }

  return options;
});

const customSelectText = computed(() => {
  const selectedOption = props.options.find(item => item.value === innerValue.value);

  return selectedOption?.text || innerValue.value;
});


const style = useCssModule();

const selectClassNames = computed(() => ({
  [style.root]: true,
  [style.customSelectDisabled]: props.isDisabled,
}));

const labelClassNames = computed(() => ({
  [style.label]: true,
  [style.labelRequired]: props.isRequired,
}));

const inputClassNames = computed(() => ({
  [style.input]: true,
  [style.input_empty]: !innerValue.value,
  [style.input_nonEmpty]: !!innerValue.value,
  [style.input_disabled]: props.isDisabled,
  [style.input_error]: hasError.value && !isFocused.value,
  [style.input_required]: props.isRequired,
  'has-error': hasError.value,
}));

const customSelectClassNames = computed(() => ({
  [style.customSelect__input]: true,
  [style.input_opened]: isCustomSelectOpened.value,
}));


const hasError = computed(() => props.errors && props.errors.length > 0);


const getCustomOptionClassNames = value => ({
  [style.optionButton]: true,
  [style.optionButton_selected]: value === innerValue.value,
});

const selectOption = (value) => {
  searchString.value = '';
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
  searchString.value = '';
  isCustomSelectOpened.value = false;
  onBlur();
};
</script>

<i18n>
{
  "en": {
    "no_results": "No results"
  },
  "pt": {
    "no_results": "Sem resultados"
  }
}
</i18n>

<template>
  <div :class="selectClassNames">
    <label
      v-if="label"
      :class="labelClassNames"
    >{{ label }}</label>

    <label
      v-click-outside="onClickOutside"
      :class="$style.customSelect"
    >
      <input
        v-if="isCustomSelectOpened"
        v-model="searchString"
        :class="[inputClassNames, customSelectClassNames]"
        type="text"
      >

      <input
        v-else
        :value="customSelectText"
        :placeholder="placeholder"
        :class="[inputClassNames, customSelectClassNames]"
        :disabled="isDisabled"
        type="text"
        @click="openCustomSelect"
      >

      <ul :class="$style.optionsList">
        <template v-if="filteredOptions.length">
          <li
            v-for="(item, index) in filteredOptions"
            :key="index"
            :class="$style.option"
          >
            <button
              :class="getCustomOptionClassNames(item.value)"
              type="button"
              @click="selectOption(item.value)"
            >
              {{ item.text }}
            </button>
          </li>
        </template>

        <li
          v-else
          :class="$style.option"
        >
          <button
            :class="$style.optionButton"
            type="button"
          >
            {{ t('no_results') }}
          </button>
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

.label {
  @include ui-input-label;
}

.customSelect {
  width: 100%;

  .label ~ & {
    top: 24px;
  }

  &__input {
    z-index: 25;
    text-transform: capitalize;
    background-color: $ui-color-white;
  }
}

.customSelectDisabled {

  & .customSelect {
    background-color: rgba($ui-color-transparent, .05);
  }

  & .background {
    background-color: rgba($ui-color-transparent, .05);
  }

  & .label {
    color: $ui-color-transparent;
  }
}

.input {
  @include ui-input-master();
  @include ui-input-state-normal();
  overflow: initial;
  color: $ui-color-text-light;
  background: $ui-color-white url('~/assets/images/icon-carret.svg') no-repeat calc(100% - 15px) center;
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

    & {
      background-color: rgba($ui-color-transparent, .05);
    }
  }

  &_opened {
    @include ui-input-state-hover();
    border-radius: 4px 4px 0 0;
  }
}

.labelRequired {
  @include ui-input-label-required;
}

.option {
  color: $ui-color-black;
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
