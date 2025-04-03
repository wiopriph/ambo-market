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
  route: {
    name: 'cityId',
    params: {
      cityId: city.id,
    },
  },
})));

const style = useCssModule();

const getCityClassNames = (id: string) => ({
  [style.link]: true,
  [style.strong]: id === 'all',
});
</script>

<i18n lang="json">
{
  "en": {
    "title": "All Cities - Ambo Market Free Classifieds Website",
    "description": "Discover all cities in Angola on the Ambo Market free classifieds website. Choose a classifieds board in your city!",
    "all": "All Cities"
  },
  "pt": {
    "title": "Todas as Cidades - Site de Classificados Grátis Ambo Market",
    "description": "Descubra todas as cidades em Angola no site de classificados grátis Ambo Market. Escolha um quadro de classificados em sua cidade!",
    "all": "Todas as Cidades"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <h1
      :class="$style.title"
      v-text="t('all')"
    />

    <ul :class="$style.list">
      <li
        v-for="(city, index) in cities"
        :key="`${city.id}_${index}`"
        :class="$style.item"
      >
        <NuxtLink
          :to="city.route"
          :class="getCityClassNames(city.id)"
        >
          {{ city.name }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-simple-container;

  padding: 24px 20px;
}

.title {
  margin-bottom: 36px;
}

.list {
  list-style: none;
}

.item {
  @include exclude-sm {
    margin-top: 24px;
  }

  @include sm {
    margin-top: 16px;
  }
}

.link {
  text-decoration: none;

  @include exclude-sm {
    @include ui-typo-24-medium;
  }

  @include sm {
    @include ui-typo-16-medium;
  }
}

.strong {
  font-weight: $font-bold-weight;
}
</style>
