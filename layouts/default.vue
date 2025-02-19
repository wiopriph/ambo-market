<script setup lang="ts">
import { useUser } from '~/composables/useUser';


const head = useLocaleHead({
  addSeoAttributes: true,
  identifierAttribute: 'key',
});

const { t } = useI18n();

const title = computed(() => t('title'));
const description = computed(() => t('description'));

const config = useRuntimeConfig();

const image = `${config.public.appBaseUrl}/images/background.png`;

useHead({
  meta: computed(() => [
    { key: 'og:type', property: 'og:type', content: 'website' },
    { key: 'og:site_name', property: 'og:site_name', content: 'Ambo Market' },
    { hid: 'og:image', property: 'og:image', content: image },
    { key: 'og:image:width', property: 'og:image:width', content: '512' },
    { key: 'og:image:height', property: 'og:image:height', content: '512' },
    { key: 'og:title', property: 'og:title', content: title.value },
    { key: 'og:description', property: 'og:description', content: description.value },

    { key: 'description', name: 'description', content: description.value },

    { hid: 'twitter:image', property: 'twitter:image', content: image },
    { key: 'twitter:title', property: 'twitter:title', content: title.value },
    { key: 'twitter:description', property: 'twitter:description', content: description.value },
  ]),
});


const { $fire } = useNuxtApp();

const {
  isAuthChecking,
  fetchProfile,
  setCurrentUser,
} = useUser();

onMounted(() => {
  $fire.auth.onAuthStateChanged(async (user) => {
    isAuthChecking.value = true;

    if (user) {
      try {
        await fetchProfile();

        setTimeout(() => {
          isAuthChecking.value = false;
        }, 1000);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error while fetching user profile:', error);
      }
    } else {
      setCurrentUser(null);

      isAuthChecking.value = false;
    }
  });
});


const style = useCssModule();
const route = useRoute();
const ROUTES_WITHOUT_FOOTER = [
  'im',
  'im-chat-chatId',
];

const footerClassNames = computed(() => ({
  [style.hide]: ROUTES_WITHOUT_FOOTER.includes(route.name as string),
}));
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

        <Footer :class="footerClassNames" />
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

.hide {

  @include md {
    display: none;
  }
}
</style>
