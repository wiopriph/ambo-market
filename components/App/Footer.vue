<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import { useFeedback } from '~/composables/useFeedback';


const { openFeedback } = useFeedback();

const items: NavigationMenuItem[] = [
  { label: 'Sobre', to: { name: 'about' } },
  { label: 'Termos de Uso', to: { name: 'terms' } },
  { label: 'Política de Privacidade', to: { name: 'privacy' } },
  { label: 'Deixe a sua opinião', onSelect: () => openFeedback('idea') },
];

const socialLinks = [
  { name: 'Facebook', url: 'https://www.facebook.com/ambo.market', icon: 'i-lucide-facebook' },
  { name: 'Instagram', url: 'https://www.instagram.com/ambo.market', icon: 'i-lucide-instagram' },
  { name: 'Youtube', url: 'https://www.youtube.com/@ambo.market', icon: 'i-lucide-youtube' },
];
</script>

<template>
  <UFooter
    class="mt-auto"
    :ui="{
      container: 'mx-auto max-w-[1280px] px-4 sm:px-6',
      bottom: 'mx-auto max-w-[1280px] border-t border-default px-4 py-2 sm:px-6'
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
      <p class="text-center text-xs leading-relaxed text-muted">
        Ambo Market - classificados gratis em Angola. Compra e venda online em Luanda, Benguela, Huambo, Lobito, Cabinda
        e toda Angola. Carros, imoveis, telemoveis, electronica e servicos.
      </p>
    </template>
  </UFooter>
</template>
