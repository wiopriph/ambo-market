<script setup lang="ts">
const props = defineProps({
  isMobile: {
    type: Boolean,
    default: false,
  },

  type: {
    type: String,
    default: 'horizontal',
    validator(value: string) {
      return ['horizontal', 'vertical'].includes(value);
    },
  },
});


const styles = useCssModule();

const rootClassNames = computed(() => ({
  [styles.root]: true,
  [styles.mobile]: props.isMobile,
  [styles[props.type]]: !!props.type,
}));
</script>

<template>
  <div :class="rootClassNames">
    AD
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-round-content-blocks;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100px;

  color: #BD8AA1;
  background-color: rgba(#BD8AA1, 0.1);
}

.mobile {
  @include exclude-md {
    display: none;
  }
}

.horizontal {
  height: 100px;
}

.vertical {
  height: 400px;
}
</style>
