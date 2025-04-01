<script setup lang="ts">
import type { TextRollProps } from './types';


const props = withDefaults(defineProps<TextRollProps>(), {
  expandOnMount: false,
});

const isExpanded = ref(props.expandOnMount);
const isOverflowing = ref(false);
const contentRef = ref<HTMLElement | null>(null);

const checkOverflow = () => {
  if (contentRef.value) {
    isOverflowing.value = contentRef.value.scrollHeight > 300;
  }
};

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
  checkOverflow();
});

const style = useCssModule();

const contentClassNames = computed(() => ({
  [style.content]: true,
  [style.expanded]: isExpanded.value,
  [style.collapsed]: !isExpanded.value && (isOverflowing.value && isMounted.value),
}));

const { t } = useI18n();
</script>

<i18n>
{
  "en": {
    "expand": "Expand"
  },
  "pt": {
    "expand": "Expandir"
  }
}
</i18n>

<template>
  <div :class="$style.container">
    <div
      ref="contentRef"
      :class="contentClassNames"
    >
      <slot />
    </div>

    <button
      v-if="isOverflowing && !isExpanded && isMounted"
      :class="$style.toggleButton"
      type="button"
      @click="toggleExpand"
    >
      {{ t('expand') }}
    </button>
  </div>
</template>

<style lang="scss" module>
.container {
  position: relative;
}

.content {
  transition: max-height 0.3s ease;
}

.content:not(.expanded):not(.collapsed) {
  max-height: 300px;
  overflow: hidden;
}

.collapsed {
  overflow: hidden;
  max-height: 300px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 16px;
    background: linear-gradient(to bottom, transparent, #FAFAFA);
  }
}

.expanded {
  max-height: none;
}

.toggleButton {
  @include ui-button-link-view;
  @include ui-typo-14;

  margin-top: 8px;
  width: 100%;
  text-align: center;
}
</style>
