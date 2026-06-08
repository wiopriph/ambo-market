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
  <section class="space-y-6 py-4 sm:py-8">
    <div class="space-y-3">
      <h1
        class="text-3xl font-bold text-highlighted sm:text-4xl"
        v-text="t('h1')"
      />

      <p
        class="max-w-3xl text-base leading-7 text-muted"
        v-text="t('description')"
      />
    </div>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <ULink
        v-for="city in cities"
        :key="city.id"
        :to="city.route"
        class="block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <UCard class="h-full transition hover:border-primary hover:bg-muted/30">
          <div class="flex items-start gap-3">
            <UIcon
              :name="city.icon"
              class="mt-1 size-5 shrink-0 text-primary"
            />

            <div class="min-w-0 space-y-1">
              <p class="font-semibold text-highlighted">
                {{ city.name }}
              </p>

              <p class="text-sm leading-6 text-muted">
                {{ city.description }}
              </p>
            </div>
          </div>
        </UCard>
      </ULink>
    </div>
  </section>
</template>
