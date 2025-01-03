<script setup lang="ts">
import IconEmptyList from '~/assets/images/icon-empty-list.svg?component';


const { t } = useI18n();
</script>

<i18n lang="json">
{
  "en": {
    "select_chat": "Select chat"
  },
  "pt": {
    "select_chat": "Selecionar chat"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <p
      :class="$style.text"
      v-text="t('select_chat')"
    />

    <IconEmptyList :class="$style.icon" />
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.text {
  @include ui-typo-12;
}

.icon {
  margin-top: 16px;
}
</style>
