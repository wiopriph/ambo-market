<script setup>
const { t, setLocale } = useI18n();
</script>

<template>
  <div>
    <div>
      <button
        type="button"
        @click="setLocale('en')"
      >
        en
      </button>

      <button
        type="button"
        @click="setLocale('pt')"
      >
        pt
      </button>

      <p v-text="t('seo.common.title')" />

      <I18nT
        keypath="seo.common.title"
        tag="p"
      />
    </div>
  </div>
</template>
