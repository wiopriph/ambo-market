<script setup lang="ts">
import type { Props } from './types';
import IconArrowDown from '~/assets/images/icon-carret.svg?component';


const props = withDefaults(defineProps<Props>(), {
  titleTag: 'h4',
  expanded: false,
  title: '',
});


const isOpened = ref(props.expanded);

const toggle = () => {
  isOpened.value = !isOpened.value;
};


const style = useCssModule();

const rootClassNames = computed(() => ({
  [style.expand]: isOpened.value,
  [style.accordion]: true,
}));
</script>

<template>
  <div
    :class="rootClassNames"
    @click="toggle"
  >
    <div :class="$style.header">
      <component
        :is="titleTag"
        :class="$style.title"
      >
        {{ title }}
      </component>

      <IconArrowDown :class="$style.icon" />
    </div>

    <div :class="$style.content">
      <slot name="default" />
    </div>
  </div>
</template>

<style lang="scss" module>
.accordion {
  padding: 10px 0;
  border-bottom: 1px solid $ui-color-transparent;
  cursor: pointer;
}

.header {
  display: flex;
  align-items: center;
}

.title {
  @include ui-typo-15-bold;

  width: calc(100% - 24px);
  padding-right: 20px;
  cursor: pointer;
  user-select: none;
}

.icon {
  width: 24px;
  transform: rotate(180deg);
  transition: transform .2s;
}

.content {
  display: none;
  margin-top: 10px;
}

.expand {

  .icon {
    transform: rotate(0);
  }

  .content {
    display: block;
  }
}
</style>
