<script setup lang="ts">
import { CITIES } from '~/constants/cities';
import { usePosts } from '~/composables/usePosts';


const emit = defineEmits(['close']);

const closeModal = () => emit('close');

const { t } = useI18n();
const route = useRoute();
const { setCity } = usePosts();
const style = useCssModule();

const getCityClassNames = (id: string) => ({
  [style.link]: true,
  [style.strong]: id === 'all',
});

const getCityRoute = (cityId: string) => {
  const params: Record<string, string> = { cityId };
  const routeParamKeys = ['categoryId', 'subcategoryId', 'brandId'];

  for (const key of routeParamKeys) {
    const value = route.params[key];

    if (typeof value === 'string') {
      params[key] = value;
    } else {
      break;
    }
  }

  return {
    name: Object.keys(params).join('-'),
    params,
    query: route.query,
  };
};

const citiesList = computed(() => CITIES.map(city => ({
  id: city.id,
  name: city.name || t('everywhere'),
  route: getCityRoute(city.id),
})));

const selectCity = (cityId: string) => {
  setCity(cityId);
  closeModal();
};
</script>

<i18n>
{
  "en": {
    "location": "Location",
    "everywhere": "Everywhere"
  },
  "pt": {
    "location": "Localização",
    "everywhere": "Em todos os lugares"
  }
}
</i18n>

<template>
  <UIModal
    :title="t('location')"
    maxWidth="520px"
    @close="closeModal"
  >
    <ul :class="$style.list">
      <li
        v-for="city in citiesList"
        :key="city.id"
        :class="$style.item"
      >
        <NuxtLink
          :to="city.route"
          :class="getCityClassNames(city.id)"
          @click="selectCity(city.id)"
        >
          {{ city.name }}
        </NuxtLink>
      </li>
    </ul>
  </UIModal>
</template>

<style lang="scss" module>
.list {
  padding: 20px;
}

.item {

  & + & {
    margin-top: 20px;
  }
}

.link {
  text-decoration: none;
}

.strong {
  font-weight: $font-bold-weight;
}
</style>
