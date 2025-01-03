<script setup lang="ts">
import type { LineDescriptionProps } from './types';


const props = withDefaults(defineProps<LineDescriptionProps>(), {
  title: '',
  description: '',
  position: 'start',
});


const style = useCssModule();

const lineClassNames = computed(() => ({
  [style.line]: true,
  [style[props.position]]: true,
}));

const nameClassNames = computed(() => ({
  [style.title]: true,
  [style.hide]: props.hideTitle,
  [style.bold]: props.boldTitle,
  [style.required]: props.requiredTitle,
}));
</script>

<template>
  <div :class="$style.root">
    <div :class="lineClassNames">
      <div :class="$style.heading">
        <span
          :class="nameClassNames"
          v-text="title"
        />
      </div>

      <div :class="$style.content">
        <slot>
          {{ description }}
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 20px 0;

  @include exclude-md {
    align-items: center;
  }
}

.line {
  display: flex;
  flex: 1;
  flex-direction: row;

  @include md {
    flex-direction: column;
  }
}

.start {
  @include exclude-md {
    align-items: flex-start;
  }
}

.center {
  @include exclude-md {
    align-items: center;
  }
}

.end {
  @include exclude-md {
    align-items: flex-end;
  }
}

$heading-width: 240px;

.heading {

  @include exclude-md {
    width: $heading-width;
  }
}

.content {

  @include md {
    margin-top: 10px;
  }

  @include exclude-md {
    width: calc(100% - $heading-width);
  }
}

.title {
  flex-shrink: 0;
  padding-right: 10px;
  color: $ui-color-text-main;
  word-break: break-word;
  overflow-wrap: break-word;
}

.bold {
  color: $ui-color-black;
  font-weight: $font-bold-weight;
}

.hide {

  @include md {
    display: none;
  }
}

.required {

  &::after {
    color: $ui-color-system-red;
    content: '\00A0*';
  }
}
</style>

