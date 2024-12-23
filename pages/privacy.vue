<script setup lang="ts">
import { PRIVACY_HTML } from '~/constants/privacy';


const { t } = useI18n();
</script>

<i18n>
{
  "en": {
    "privacy_policy": "Privacy Policy"
  },
  "pt": {
    "privacy_policy": "Política de Privacidade"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <h1 v-text="t('privacy_policy')" />

    <!-- eslint-disable vue/no-v-html -->
    <div v-html="PRIVACY_HTML" />
    <!-- eslint-enable vue/no-v-html -->
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-simple-container;

  padding: 20px;

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
