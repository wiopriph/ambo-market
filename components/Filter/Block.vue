<script setup lang="ts">
import debounce from 'lodash/debounce';
import { usePosts } from '~/composables/usePosts';
import type { Filters } from '~/composables/usePosts/types';
import { DEFAULT_FILTERS } from '~/constants/filters';
import { CATEGORIES, getCategoryById } from '~/constants/categories';
import { CITIES } from '~/constants/cities';
import getObjectDifferences from '~/utils/getObjectDifferences';
import { SELECT_BRAND, SELECT_CATEGORY, SELECT_CITY, SELECT_SUBCATEGORY } from '~/constants/analytics-events';


const { t } = useI18n();

const {
  cityId,
  categoryId,
  subcategoryId,
  brandId,
  currentFilters,
  getFilter,
} = usePosts();

const citiesList = computed(() => CITIES.map(city => ({
  label: city.name || t('everywhere'),
  value: city.id,
})));

const categoriesItems = computed(() => CATEGORIES.map(({ id, key }) => ({
  label: t(key),
  value: id,
})));

const subcategoriesItems = computed(() => {
  const category = getCategoryById(categoryId.value);

  return category?.subcategories?.map(({ id, key }) => ({ label: t(key), value: id })) ?? [];
});

const brandsItems = computed(() => {
  const category = getCategoryById(categoryId.value);
  const subcategory = category?.subcategories?.find(sc => sc.id === subcategoryId.value);

  return subcategory?.brands?.map(({ id, key }) => ({ label: t(key), value: id })) ?? [];
});

const { pushEvent } = useAnalyticsEvent();
const route = useRoute();

const setFilter = (type: string, value: string | number | boolean) => {
  const filters = { ...currentFilters.value, [type]: value };

  navigateTo({ query: getObjectDifferences(filters, DEFAULT_FILTERS) });
};

const setCity = (city: string) => {
  const cityId = city || 'all';

  pushEvent(SELECT_CITY, { city_id: cityId });

  const params: Record<string, string> = { cityId };

  for (const key of ['categoryId', 'subcategoryId', 'brandId']) {
    const value = route.params[key];

    if (value) params[key] = value as string;
    else break;
  }

  navigateTo({ name: Object.keys(params).join('-'), params, query: { ...currentFilters.value } });
};

const setCategory = (categoryId: string) => {
  pushEvent(SELECT_CATEGORY, { category_id: categoryId });

  if (categoryId) {
    return navigateTo({
      name: 'cityId-categoryId',
      params: { cityId: cityId.value, categoryId },
      query: { ...currentFilters.value },
    });
  }

  navigateTo({ name: 'cityId', params: { cityId: cityId.value }, query: { ...currentFilters.value } });
};

const setSubcategory = (subcategoryId: string) => {
  pushEvent(SELECT_SUBCATEGORY, { subcategory_id: subcategoryId });

  navigateTo({
    name: 'cityId-categoryId-subcategoryId',
    params: { cityId: cityId.value, categoryId: categoryId.value, subcategoryId },
    query: { ...currentFilters.value },
  });
};

const setBrand = (brandId: string) => {
  pushEvent(SELECT_BRAND, { brand_id: brandId });

  navigateTo({
    name: 'cityId-categoryId-subcategoryId-brandId',
    params: { cityId: cityId.value, categoryId: categoryId.value, subcategoryId: subcategoryId.value, brandId },
    query: { ...currentFilters.value },
  });
};

const hasActiveFilters = computed(() => !!Object.keys(currentFilters.value).length);

const minPrice = computed({
  get: () => getFilter('minPrice'),
  set: debounce((value: string) => setFilter('minPrice', value), 1000),
});

const maxPrice = computed({
  get: () => getFilter('maxPrice'),
  set: debounce((value: string) => setFilter('maxPrice', value), 1000),
});

const removeFilter = (filterType: keyof Filters) => {
  const filters = { ...currentFilters.value };

  delete filters[filterType];
  navigateTo({ query: getObjectDifferences(filters, DEFAULT_FILTERS) });
};

const clearAllFilters = () => {
  navigateTo({ query: getObjectDifferences({ q: getFilter('q') }, DEFAULT_FILTERS) });
};

const criterionLabel = (key: string, value: string) => {
  if (key === 'minPrice') return t('from', { value });

  if (key === 'maxPrice') return t('to', { value });

  if (key === 'q') return t('search', { value });

  return value;
};
</script>

<i18n lang="json">
{
  "en": {
    "clear_all": "Clear all",
    "city": "City",
    "everywhere": "Everywhere",
    "category": "Category",
    "subcategory": "Subcategory",
    "brand": "Brand",
    "select": "Select",
    "price": "Price",
    "from": "From {value} kz",
    "to": "To {value} kz",
    "search": "Search: {value}"
  },
  "pt": {
    "clear_all": "Limpar tudo",
    "city": "Cidade",
    "everywhere": "Em todos os lugares",
    "category": "Categoria",
    "subcategory": "Subcategoria",
    "brand": "Marca",
    "select": "Selecione",
    "price": "Preço",
    "from": "Por {value} kz",
    "to": "Até {value} kz",
    "search": "Consulta: {value}"
  }
}
</i18n>

<template>
  <div class="rounded-xl bg-white shadow divide-y divide-default">
    <div
      v-if="hasActiveFilters"
      class="p-4"
    >
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="(value, key) in currentFilters"
          :key="key"
          color="neutral"
          variant="subtle"
          class="cursor-pointer"
          @click="removeFilter(key as keyof Filters)"
        >
          {{ criterionLabel(key, value) }}
          <UIcon
            name="i-lucide-x"
            class="size-3 ml-1"
          />
        </UBadge>
      </div>

      <UButton
        variant="link"
        color="primary"
        size="xs"
        class="mt-2 px-0"
        @click="clearAllFilters"
        v-text="t('clear_all')"
      />
    </div>

    <div class="p-4">
      <UFormField :label="t('city')">
        <USelect
          :modelValue="cityId"
          :items="citiesList"
          :placeholder="t('select')"
          valueKey="value"
          labelKey="label"
          class="w-full"
          @update:model-value="setCity"
        />
      </UFormField>
    </div>

    <div class="p-4">
      <UFormField :label="t('category')">
        <USelect
          :modelValue="categoryId"
          :items="categoriesItems"
          :placeholder="t('select')"
          valueKey="value"
          labelKey="label"
          class="w-full"
          @update:model-value="setCategory"
        />
      </UFormField>
    </div>

    <div class="p-4">
      <UFormField :label="t('subcategory')">
        <USelect
          :modelValue="subcategoryId"
          :items="subcategoriesItems"
          :placeholder="t('select')"
          valueKey="value"
          labelKey="label"
          class="w-full"
          @update:model-value="setSubcategory"
        />
      </UFormField>
    </div>

    <div
      v-if="brandsItems.length"
      class="p-4"
    >
      <UFormField :label="t('brand')">
        <USelect
          :modelValue="brandId"
          :items="brandsItems"
          :placeholder="t('select')"
          valueKey="value"
          labelKey="label"
          class="w-full"
          @update:model-value="setBrand"
        />
      </UFormField>
    </div>

    <div class="p-4">
      <p
        class="text-sm font-semibold mb-1"
        v-text="t('price')"
      />

      <div class="flex gap-2">
        <UInput
          v-model="minPrice"
          :placeholder="t('from')"
          name="minPrice"
          type="number"
          class="w-full"
        />

        <UInput
          v-model="maxPrice"
          :placeholder="t('to')"
          name="maxPrice"
          type="number"
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>
