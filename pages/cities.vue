<script setup lang="ts">
import { CITIES } from '~/constants/cities';


const title = 'Classificados por Cidade em Angola – Luanda, Benguela, Huambo, Soyo | Ambo Market';
const description = 'Encontre classificados na sua cidade: Luanda, Benguela, Huambo, Soyo, Malanje e mais. Compre, venda e negocie perto de você no Ambo Market.';

useHead({
  title,
  meta: [
    { key: 'og:title', property: 'og:title', content: title },
    { key: 'twitter:title', property: 'twitter:title', content: title },
    { key: 'description', name: 'description', content: description },
    { key: 'og:description', property: 'og:description', content: description },
    { key: 'twitter:description', property: 'twitter:description', content: description },
  ],
});

const cities = computed(() => CITIES.map(city => ({
  id: city.id,
  name: city.name || 'Em todos os lugares',
  description: city.id === 'all' ?
    'Veja anúncios de todas as cidades na Ambo Market.' :
    `Veja classificados em ${city.name}.`,
  icon: city.id === 'all' ? 'i-lucide-map' : 'i-lucide-map-pin',
  route: { name: 'cityId', params: { cityId: city.id } },
})));
</script>

<template>
  <div class="space-y-3">
    <div class="rounded-2xl border border-default bg-default px-5 py-4">
      <h1 class="text-lg font-bold text-highlighted">
        Escolha uma cidade
      </h1>

      <p class="mt-0.5 text-sm text-muted">
        Encontre classificados em Angola ou vá direto para anúncios perto de você.
      </p>
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
