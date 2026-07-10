<script setup lang="ts">
import { useFeedback } from '~/composables/useFeedback';
import { usePosts } from '~/composables/usePosts';
import { CATEGORIES } from '~/constants/categories';
import { CITIES } from '~/constants/cities';


const { openFeedback } = useFeedback();
const { cityId } = usePosts();

const year = new Date().getFullYear();

const POPULAR_CATEGORY_IDS = ['vehicles', 'real-estate', 'electronics', 'fashion', 'jobs', 'services'];

const categoryLinks = computed(() =>
  POPULAR_CATEGORY_IDS
    .map(id => CATEGORIES.find(category => category.id === id))
    .filter((category): category is NonNullable<typeof category> => !!category)
    .map(category => ({
      label: category.name,
      to: { name: 'cityId-categoryId', params: { cityId: cityId.value, categoryId: category.id } },
    })),
);

const cityLinks = computed(() =>
  CITIES
    .filter(city => city.id !== 'all')
    .slice(0, 6)
    .map(city => ({
      label: city.name,
      to: { name: 'cityId', params: { cityId: city.id } },
    })),
);

const aboutLinks = [
  { label: 'Sobre', to: { name: 'about' } },
  { label: 'Termos de Uso', to: { name: 'terms' } },
  { label: 'Política de Privacidade', to: { name: 'privacy' } },
];

const socialLinks = [
  { name: 'Facebook', url: 'https://www.facebook.com/ambo.market', icon: 'i-lucide-facebook' },
  { name: 'Instagram', url: 'https://www.instagram.com/ambo.market', icon: 'i-lucide-instagram' },
  { name: 'Youtube', url: 'https://www.youtube.com/@ambo.market', icon: 'i-lucide-youtube' },
];
</script>

<template>
  <footer class="mt-auto border-t border-default bg-default">
    <div class="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6">
      <div class="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        <div class="col-span-2 sm:col-span-3 lg:col-span-2">
          <ULink
            :to="{ name: 'index' }"
            aria-label="Página inicial"
            class="inline-flex"
          >
            <img
              src="/icon-logo.svg"
              alt="Ambo Market"
              width="180"
              height="32"
              class="h-6 w-auto"
            >
          </ULink>

          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Marketplace de classificados grátis em Angola. Compre e venda sem comissões.
          </p>

          <div class="mt-4 flex gap-1">
            <UButton
              v-for="social in socialLinks"
              :key="social.name"
              :to="social.url"
              :aria-label="social.name"
              :icon="social.icon"
              color="neutral"
              variant="ghost"
              size="sm"
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
        </div>

        <nav class="flex flex-col gap-2.5">
          <p class="text-sm font-semibold text-highlighted">
            Ambo Market
          </p>

          <ULink
            v-for="link in aboutLinks"
            :key="link.label"
            :to="link.to"
            class="text-sm text-muted transition hover:text-primary"
          >
            {{ link.label }}
          </ULink>

          <button
            type="button"
            class="text-left text-sm text-muted transition hover:text-primary"
            @click="openFeedback('idea')"
          >
            Deixe a sua opinião
          </button>
        </nav>

        <nav class="flex flex-col gap-2.5">
          <p class="text-sm font-semibold text-highlighted">
            Categorias
          </p>

          <ULink
            v-for="link in categoryLinks"
            :key="link.label"
            :to="link.to"
            class="text-sm text-muted transition hover:text-primary"
          >
            {{ link.label }}
          </ULink>
        </nav>

        <nav class="flex flex-col gap-2.5">
          <p class="text-sm font-semibold text-highlighted">
            Cidades
          </p>

          <ULink
            v-for="link in cityLinks"
            :key="link.label"
            :to="link.to"
            class="text-sm text-muted transition hover:text-primary"
          >
            {{ link.label }}
          </ULink>
        </nav>
      </div>

      <div class="mt-8 border-t border-default pt-6">
        <p class="text-xs leading-relaxed text-muted">
          Ambo Market — classificados grátis em Angola. Compra e venda online em Luanda, Benguela, Huambo, Lobito,
          Cabinda e toda Angola. Carros, imóveis, telemóveis, electrónica e serviços.
        </p>

        <p class="mt-3 text-xs text-muted">
          © {{ year }} Ambo.Market
        </p>
      </div>
    </div>
  </footer>
</template>
