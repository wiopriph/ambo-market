<script setup lang="ts">
import type { UITogglerProps } from './types';


const props = withDefaults(defineProps<UITogglerProps>(), {
  title: '',
  description: '',
});


const style = useCssModule();

const tumblerClassNames = computed(() => ({
  [style.root]: true,
  [style.active]: props.modelValue,
}));


const emit = defineEmits(['update:modelValue']);

const change = (value: boolean) => {
  emit('update:modelValue', value);
};
</script>

<template>
  <div :class="tumblerClassNames">
    <div :class="$style.heading">
      <div v-text="label" />

      <UICheckbox
        :modelValue="modelValue"
        :class="$style.checkbox"
        @update:model-value="change"
      />
    </div>

    <div :class="$style.content">
      <slot>
        <p v-text="description" />
      </slot>
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-typo-15;

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 30px;
  padding: 10px 20px;
  transition: background-color .2s linear;

  @include md {
    flex-direction: column;
  }
}

.active {
  background-color: #CEFAEA;
}

.heading {

  @include exclude-md {
    width: 280px;
  }
}

.checkbox {
  margin-top: 10px;
}

.content {
  @include ui-typo-14;

  color: $ui-color-text-main;
  word-wrap: break-word;

  @include md {
    margin-top: 10px;
  }

  @include exclude-md {
    width: calc(100% - 280px);
  }
}
</style>
