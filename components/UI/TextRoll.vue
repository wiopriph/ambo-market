<script setup lang="ts">
const props = withDefaults(defineProps<{
  expandOnMount?: boolean;
}>(), {
  expandOnMount: false,
});

const { t } = useI18n();

const contentRef = ref<HTMLElement | null>(null);
const isExpanded = ref(props.expandOnMount);
const isOverflowing = ref(false);

onMounted(() => {
  if (contentRef.value) {
    isOverflowing.value = contentRef.value.scrollHeight > 300;
  }
});
</script>

<i18n lang="json">
{
  "en": {
    "expand": "Show more"
  },
  "pt": {
    "expand": "Mostrar mais"
  }
}
</i18n>

<template>
  <div class="relative">
    <div
      ref="contentRef"
      class="overflow-hidden transition-[max-height] duration-300"
      :class="isExpanded ? 'max-h-none' : isOverflowing ? 'max-h-[300px]' : ''"
    >
      <slot />
    </div>

    <div
      v-if="isOverflowing && !isExpanded"
      class="absolute bottom-0 left-0 right-0 flex justify-center bg-gradient-to-t from-default pb-1 pt-8"
    >
      <UButton
        :label="t('expand')"
        color="neutral"
        variant="soft"
        size="sm"
        @click="isExpanded = true"
      />
    </div>
  </div>
</template>
