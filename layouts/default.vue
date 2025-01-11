<script setup lang="ts">
const head = useLocaleHead({
  addSeoAttributes: true,
  identifierAttribute: 'key',
});

const { t } = useI18n();

const title = computed(() => t('title'));
const description = computed(() => t('description'));

useHead({
  meta: computed(() => [
    { key: 'og:type', property: 'og:type', content: 'website' },
    { key: 'og:site_name', property: 'og:site_name', content: 'Ambo Market' },

    { key: 'og:image:width', property: 'og:image:width', content: '512' },
    { key: 'og:image:height', property: 'og:image:height', content: '512' },

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
    <Html :lang="head.htmlAttrs.lang">
      <Head>
        <Title>
          {{ title }}
        </Title>

        <template
          v-for="link in head.link"
          :key="link.key"
        >
          <Link
            :rel="link.rel"
            :href="link.href"
            :hreflang="link.hreflang"
          />
        </template>

        <template
          v-for="meta in head.meta"
          :key="meta.key"
        >
          <Meta
            :property="meta.property"
            :content="meta.content"
          />
        </template>
      </Head>

      <Body>
        <HeaderRoot />

        <slot />

        <Footer />
      </Body>
    </Html>
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
