<script setup lang="ts">
const { t } = useI18n();
</script>

<i18n>
{
  "en": {
    "about": "About"
  },
  "pt": {
    "about": "About"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <h1 v-text="t('about')" />
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-simple-container;
  @include ui-typo-15;
  padding: 24px 20px;

  h1 {
    @include ui-typo-36-medium;
  }

  h3 {
    @include ui-typo-24-medium;
    margin-top: 36px;
  }

  p {
    margin-top: 24px;
  }
}
</style>
