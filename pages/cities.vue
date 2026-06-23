<script setup lang="ts">
import { CITIES } from '~/constants/cities';


const { t } = useI18n();

const title = computed(() => t('title'));
const description = computed(() => t('description'));


const meta = computed(() => [
  { key: 'og:title', property: 'og:title', content: title.value },
  { key: 'twitter:title', property: 'twitter:title', content: title.value },
  { key: 'description', name: 'description', content: description.value },
  { key: 'og:description', property: 'og:description', content: description.value },
  { key: 'twitter:description', property: 'twitter:description', content: description.value },
]);

useHead({ title: title.value, meta: meta.value });

const cities = computed(() => CITIES.map(city => ({
  id: city.id,
  name: city.name || t('everywhere'),
  description: city.id === 'all' ?
    t('all_city_description') :
    t('city_description', { city: city.name }),
  icon: city.id === 'all' ? 'i-lucide-map' : 'i-lucide-map-pin',
  route: {
    name: 'cityId',
    params: {
      cityId: city.id,
    },
  },
})));

const allCityRoute = computed(() => ({
  name: 'cityId',
  params: {
    cityId: 'all',
  },
}));
</script>

<i18n lang="json">
{
  "en": {
    "title": "All Cities - Ambo Market Free Classifieds Website",
    "h1": "Choose a city",
    "description": "Find classifieds across Angola or jump straight to listings near you.",
    "everywhere": "Everywhere",
    "all_city_description": "See listings from every city on Ambo Market.",
    "city_description": "Browse classifieds in {city}."
  },
  "pt": {
    "title": "Todas as Cidades - Site de Classificados Grátis Ambo Market",
    "h1": "Escolha uma cidade",
    "description": "Encontre classificados em Angola ou vá direto para anúncios perto de você.",
    "everywhere": "Em todos os lugares",
    "all_city_description": "Veja anúncios de todas as cidades na Ambo Market.",
    "city_description": "Veja classificados em {city}."
  }
}
</i18n>

<template>
  <div class="mx-auto max-w-[1280px] px-4 sm:px-5 py-6 sm:py-8 space-y-3">
    <div class="rounded-2xl border border-default bg-default px-5 py-4">
      <h1
        class="text-lg font-bold text-highlighted"
        v-text="t('h1')"
      />

      <p
        class="mt-0.5 text-sm text-muted"
        v-text="t('description')"
      />
    </div>

    <div class="rounded-2xl border border-default bg-default divide-y divide-default overflow-hidden">
      <NuxtLink
        v-for="city in cities"
        :key="city.id"
        :to="city.route"
        class="flex items-center gap-4 px-5 py-3.5 transition hover:bg-elevated"
      >
        <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <UIcon
            :name="city.icon"
            class="size-4.5 text-primary"
          />
        </div>

        <div class="min-w-0 flex-1">
          <p
            class="text-sm font-semibold text-highlighted"
            v-text="city.name"
          />

          <p
            class="text-xs text-muted"
            v-text="city.description"
          />
        </div>

        <UIcon
          name="i-lucide-chevron-right"
          class="size-4 shrink-0 text-muted"
        />
      </NuxtLink>
    </div>
  </div>
</template>
