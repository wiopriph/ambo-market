<script setup lang="ts">
import type { Props } from './types';


const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  isLoading: false,
  text: '',
});

const style = useCssModule();

const rootClassNames = computed(() => ({
  [style[props.type]]: true,
  [style[`${props.type}_isLoading`]]: props.isLoading,
}));

const animationType = (type: string) => {
  if (type === 'secondary') {
    return 'gray';
  }

  return 'common';
};

const emit = defineEmits([
  'click',
]);
</script>

<template>
  <button
    :disabled="isDisabled"
    :class="rootClassNames"
    type="button"
    @click.prevent="emit('click')"
  >
    <UILoading
      v-if="isLoading"
      :type="animationType(props.type)"
    />

    <template v-else>
      <slot>
        {{ text }}
      </slot>
    </template>
  </button>
</template>

<style lang="scss" module>
.primary {
  @include ui-button-primary;
}

.secondary {
  @include ui-button-secondary;
}

.tertiary {
  @include ui-button-tertiary;
}
</style>

