<script setup lang="ts">
const { t, setLocale } = useI18n();

const title = computed(() => t('seo.index.title'));
const description = computed(() => t('seo.index.description'));

useHead({
  title,
  meta: [
    { key: 'og:title', property: 'og:title', content: title },
    { key: 'twitter:title', property: 'twitter:title', content: title },
    { key: 'description', name: 'description', content: description },
    { key: 'og:description', property: 'og:description', content: description },
    { key: 'twitter:description', property: 'twitter:description', content: description },
  ],
});
</script>

<template>
  <div :class="$style.root">
    <div>
      <UIButton
        text="en"
        type="primary"

        @click="setLocale('en')"
      />

      <UIButton
        type="secondary"
        @click="setLocale('pt')"
      >
        pt
      </UIButton>

      <p v-text="t('seo.common.title')" />
    </div>
  </div>
</template>


<style lang="scss" module>
.root {
  @include ui-simple-container;
  padding: 24px 20px;
}
</style>
