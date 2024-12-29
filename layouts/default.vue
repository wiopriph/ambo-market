<script setup lang="ts">
const { t } = useI18n();

const title = computed(() => t('title'));
const description = computed(() => t('description'));

useHead({
  title: computed(() => title.value),
  meta: computed(() => [
    { key: 'og:title', property: 'og:title', content: title.value },
    { key: 'twitter:title', property: 'twitter:title', content: title.value },
    { key: 'description', name: 'description', content: description.value },
    { key: 'og:description', property: 'og:description', content: description.value },
    { key: 'twitter:description', property: 'twitter:description', content: description.value },
  ]),
});
</script>

<i18n>
{
  "en": {
    "title": "Ambo Market - Classified Ads, Free Private Listings",
    "description": "Ambo Market offers affordable deals on used and new cars, apartments, and other real estate, as well as new or pre-owned clothing and furniture. Buy or sell with ease!"
  },
  "pt": {
    "title": "Ambo Market - Anúncios Classificados, Anúncios Privados Gratuitos",
    "description": "O Ambo Market oferece negócios acessíveis em carros usados e novos, apartamentos e outros imóveis, além de roupas e móveis novos ou usados. Compre ou venda com facilidade!"
  }
}
</i18n>

<template>
  <div :class="$style.page">
    <HeaderRoot />

    <slot />

    <Footer />
  </div>
</template>

<style lang="scss" module>
.page {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
</style>
