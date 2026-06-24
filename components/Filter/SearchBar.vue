<script setup lang="ts">
import debounce from 'lodash/debounce';
import { usePosts } from '~/composables/usePosts';
import type { Filters } from '~/composables/usePosts/types';
import { DEFAULT_FILTERS } from '~/constants/filters';
import { CITIES } from '~/constants/cities';
import getObjectDifferences from '~/utils/getObjectDifferences';
import { SEARCH_SUBMIT, SELECT_CITY } from '~/constants/analytics-events';


const { t } = useI18n();
const route = useRoute();
const { pushEvent } = useAnalyticsEvent();

const {
  cityId,
  categoryId,
  subcategoryId,
  brandId,
  currentFilters,
  hasActiveFilters,
  getFilter,
} = usePosts();

const citiesList = computed(() => CITIES.map(city => ({
  label: city.name || t('everywhere'),
  value: city.id,
})));

const currentCityLabel = computed(
  () => citiesList.value.find(c => c.value === cityId.value)?.label || t('everywhere'),
);

const activeFiltersCount = computed(
  () => [categoryId.value, subcategoryId.value, brandId.value].filter(Boolean).length,
);

const buildParams = () => {
  const params: Record<string, string> = { cityId: cityId.value || 'all' };

  for (const key of ['categoryId', 'subcategoryId', 'brandId']) {
    const val = route.params[key];

    if (val) params[key] = val as string;
    else break;
  }

  return params;
};

const searchQuery = computed({
  get: () => getFilter('q') || '',
  set: debounce((value: string) => {
    const params = buildParams();
    const query = getObjectDifferences({ ...currentFilters.value, q: value }, DEFAULT_FILTERS);

    pushEvent(SEARCH_SUBMIT, { query: value });
    navigateTo({ name: Object.keys(params).join('-'), params, query });
  }, 600),
});

const setCity = (newCityId: string) => {
  pushEvent(SELECT_CITY, { city_id: newCityId });

  const params = { ...buildParams(), cityId: newCityId || 'all' };

  navigateTo({ name: Object.keys(params).join('-'), params, query: { ...currentFilters.value } });
};

const removeFilter = (key: keyof Filters) => {
  const filters = { ...currentFilters.value };

  delete filters[key];
  navigateTo({ query: getObjectDifferences(filters, DEFAULT_FILTERS) });
};

const clearAllFilters = () => {
  navigateTo({ query: getObjectDifferences({ q: getFilter('q') }, DEFAULT_FILTERS) });
};

const criterionLabel = (key: string, value: string) => {
  if (key === 'minPrice') return t('from', { value });

  if (key === 'maxPrice') return t('to', { value });

  return value;
};

const isFilterOpen = ref(false);
const isCityOpen = ref(false);
</script>

<i18n lang="json">
{
  "en": {
    "search": "What are you looking for?",
    "search_in": "Search in {category}...",
    "everywhere": "Everywhere",
    "city": "City",
    "filters": "Filters",
    "clear_all": "Clear all",
    "from": "From {value} kz",
    "to": "To {value} kz"
  },
  "pt": {
    "search": "O que procuras?",
    "search_in": "Buscar em {category}...",
    "everywhere": "Em todos os lugares",
    "city": "Cidade",
    "filters": "Filtros",
    "clear_all": "Limpar tudo",
    "from": "Por {value} kz",
    "to": "Até {value} kz"
  }
}
</i18n>

<template>
  <div class="flex w-full overflow-hidden rounded-md border border-default bg-default lg:h-8">
    <div class="flex flex-1 items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-3 lg:py-0">
      <UIcon
        name="i-lucide-search"
        class="size-4 shrink-0 text-muted"
      />

      <input
        :value="searchQuery"
        :placeholder="categoryId ? t('search_in', { category: t(`categories.${categoryId}`) }) : t('search')"
        class="w-full bg-transparent text-sm text-highlighted placeholder:text-muted outline-none"
        @input="searchQuery = ($event.target as HTMLInputElement).value"
      >
    </div>

    <UPopover
      v-model:open="isCityOpen"
      :content="{ align: 'start' }"
    >
      <button
        class="hidden shrink-0 items-center gap-1.5 border-l border-default px-3 py-2 text-left transition hover:bg-elevated sm:flex sm:px-4 sm:py-2.5 lg:h-full lg:px-3 lg:py-0"
        :class="{ 'bg-elevated': isCityOpen }"
        type="button"
      >
        <UIcon
          name="i-lucide-map-pin"
          class="size-3.5 shrink-0 text-muted"
        />

        <span
          class="text-sm font-medium text-highlighted"
          v-text="currentCityLabel"
        />
      </button>

      <template #content>
        <div class="w-48 py-1">
          <button
            v-for="city in citiesList"
            :key="city.value"
            class="flex w-full items-center px-3 py-2 text-sm transition hover:bg-elevated"
            :class="city.value === cityId ? 'text-primary font-medium' : 'text-highlighted'"
            type="button"
            @click="setCity(city.value); isCityOpen = false"
          >
            {{ city.label }}
          </button>
        </div>
      </template>
    </UPopover>

    <button
      :class="{ 'bg-elevated': activeFiltersCount > 0 }"
      class="flex shrink-0 items-center gap-2 border-l border-default px-3 py-2 transition hover:bg-elevated sm:px-4 sm:py-2.5 lg:h-full lg:px-3 lg:py-0"
      type="button"
      @click="isFilterOpen = true"
    >
      <UIcon
        name="i-lucide-sliders-horizontal"
        class="size-4 text-muted"
      />

      <span
        class="hidden text-sm font-medium text-highlighted sm:inline"
        v-text="t('filters')"
      />

      <UBadge
        v-if="activeFiltersCount"
        :label="String(activeFiltersCount)"
        color="primary"
        size="xs"
      />
    </button>
  </div>

  <div
    v-if="hasActiveFilters"
    class="md:hidden mt-2 flex flex-wrap items-center gap-2"
  >
    <UBadge
      v-for="(value, key) in currentFilters"
      :key="key"
      color="neutral"
      variant="soft"
      class="cursor-pointer gap-1 pr-1"
      @click="removeFilter(key as keyof Filters)"
    >
      {{ criterionLabel(String(key), String(value)) }}
      <UIcon
        name="i-lucide-x"
        class="size-3"
      />
    </UBadge>

    <UButton
      :label="t('clear_all')"
      color="neutral"
      variant="ghost"
      size="xs"
      class="h-auto py-0.5"
      @click="clearAllFilters"
    />
  </div>

  <FilterModal
    v-model:open="isFilterOpen"
    @close="isFilterOpen = false"
  />
</template>
