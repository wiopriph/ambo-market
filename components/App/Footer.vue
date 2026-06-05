<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';


const { t } = useI18n();


const items = computed<NavigationMenuItem[]>(() => ([
  {
    label: t('about'),
    to: { name: 'about' },
  },
  {
    label: t('terms_of_use'),
    to: { name: 'terms' },
  },
  {
    label: t('privacy_policy'),
    to: { name: 'privacy' },
  },
]));

const socialLinks = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/ambo.market',
    icon: 'i-lucide-facebook',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/ambo.market',
    icon: 'i-lucide-instagram',
  },
  {
    name: 'Youtube',
    url: 'https://www.youtube.com/@ambo.market',
    icon: 'i-lucide-youtube',
  },
];
</script>

<i18n lang="json">
{
  "en": {
    "about": "About",
    "terms_of_use": "Terms of Use",
    "privacy_policy": "Privacy Policy",
    "follow_us": "Follow Us",
    "seo_text": "Ambo Market - free classifieds in Angola. Buy and sell online in Luanda, Benguela, Huambo, Lobito, Cabinda and across Angola. Cars, real estate, mobile phones, electronics and services."
  },
  "pt": {
    "about": "Sobre",
    "terms_of_use": "Termos de Uso",
    "privacy_policy": "Política de Privacidade",
    "follow_us": "Siga-nos",
    "seo_text": "Ambo Market - classificados gratis em Angola. Compra e venda online em Luanda, Benguela, Huambo, Lobito, Cabinda e toda Angola. Carros, imoveis, telemoveis, electronica e servicos."
  }
}
</i18n>

<template>
  <UFooter
    class="mt-auto"
    :ui="{
      container: 'mx-auto max-w-6xl',
      bottom: 'mx-auto max-w-6xl border-t border-default py-2 lg:py-2'
    }"
  >
    <template #left>
      <p class="text-sm text-muted">
        © {{ new Date().getFullYear() }} Ambo.Market
      </p>
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
    />

    <template #right>
      <UButton
        v-for="social in socialLinks"
        :key="social.name"
        :to="social.url"
        :aria-label="social.name"
        :icon="social.icon"
        color="neutral"
        variant="ghost"
        target="_blank"
        rel="noopener noreferrer"
      />
    </template>

    <template #bottom>
      <p
        class="text-center text-xs leading-relaxed text-muted"
        v-text="t('seo_text')"
      />
    </template>
  </UFooter>
</template>
