<script setup lang="ts">
import { usePosts } from '~/composables/usePosts';
import { DEFAULT_FILTERS } from '~/constants/filters';
import { CATEGORIES } from '~/constants/categories';
import { CITIES } from '~/constants/cities';
import getObjectDifferences from '~/utils/getObjectDifferences';
import { SELECT_BRAND, SELECT_CATEGORY, SELECT_CITY, SELECT_SUBCATEGORY } from '~/constants/analytics-events';


const open = defineModel<boolean>({ default: false });

const { t } = useI18n();

const {
  cityId,
  categoryId,
  subcategoryId,
  brandId,
  getFilter,
  currentFilters,
} = usePosts();

const newCityId = ref('');
const newCategoryId = ref('');
const newSubcategoryId = ref('');
const newBrandId = ref('');
const minPrice = ref('');
const maxPrice = ref('');

const citiesList = computed(() => CITIES.map(city => ({
  value: city.id,
  label: city.name || t('everywhere'),
})));

const categoriesItems = computed(() => CATEGORIES.map(({ id, key }) => ({
  value: id,
  label: t(key),
})));

const subcategoriesItems = computed(() => {
  const category = CATEGORIES.find(cat => cat.id === newCategoryId.value);

  return category?.subcategories?.map(({ id, key }) => ({ value: id, label: t(key) })) ?? [];
});

const brandsItems = computed(() => {
  const category = CATEGORIES.find(cat => cat.id === newCategoryId.value);
  const subcategory = category?.subcategories?.find(sc => sc.id === newSubcategoryId.value);

  return subcategory?.brands?.map(({ id, key }) => ({ value: id, label: t(key) })) ?? [];
});

watch(open, (val) => {
  if (val) {
    newCityId.value = cityId.value;
    newCategoryId.value = categoryId.value;
    newSubcategoryId.value = subcategoryId.value;
    newBrandId.value = brandId.value;
    minPrice.value = getFilter('minPrice');
    maxPrice.value = getFilter('maxPrice');
  }
});

const route = useRoute();
const { pushEvent } = useAnalyticsEvent();

const updateFilters = () => {
  const query = getObjectDifferences(
    { ...currentFilters.value, minPrice: minPrice.value, maxPrice: maxPrice.value },
    DEFAULT_FILTERS,
  );

  const params: Record<string, string> = { cityId: newCityId.value || 'all' };

  for (const [key, value] of [
    ['categoryId', newCategoryId.value],
    ['subcategoryId', newSubcategoryId.value],
    ['brandId', newBrandId.value],
  ]) {
    if (value) params[key] = value;
    else break;
  }

  open.value = false;
  navigateTo({ name: Object.keys(params).join('-'), params, query });
};

const clearAllFilters = () => {
  open.value = false;
  navigateTo({ query: getObjectDifferences({ q: getFilter('q') }, DEFAULT_FILTERS) });
};
</script>

<i18n lang="json">
{
  "en": {
    "filters": "Filters",
    "everywhere": "Everywhere",
    "city": "City",
    "category": "Category",
    "subcategory": "Subcategory",
    "brand": "Brand",
    "select": "Select",
    "price": "Price",
    "from": "From",
    "to": "To",
    "clear_all": "Clear all",
    "apply": "Apply"
  },
  "pt": {
    "filters": "Filtros",
    "everywhere": "Em todos os lugares",
    "city": "Cidade",
    "category": "Categoria",
    "subcategory": "Subcategoria",
    "brand": "Marca",
    "select": "Selecione",
    "price": "Preço",
    "from": "Por",
    "to": "Até",
    "clear_all": "Limpar tudo",
    "apply": "Aplicar"
  }
}
</i18n>

<template>
  <UDrawer
    v-model:open="open"
    :title="t('filters')"
    direction="bottom"
  >
    <template #header>
      <div class="flex items-center justify-between px-4 py-3">
        <span
          class="font-semibold"
          v-text="t('filters')"
        />

        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="open = false"
        />
      </div>
    </template>

    <div class="flex flex-col gap-4 px-4 pb-4 overflow-y-auto max-h-[70vh]">
      <UFormField :label="t('city')">
        <USelect
          v-model="newCityId"
          :items="citiesList"
          :placeholder="t('select')"
          valueKey="value"
          labelKey="label"
          class="w-full"
          @update:model-value="pushEvent(SELECT_CITY, { city_id: $event })"
        />
      </UFormField>

      <UFormField :label="t('category')">
        <USelect
          v-model="newCategoryId"
          :items="categoriesItems"
          :placeholder="t('select')"
          valueKey="value"
          labelKey="label"
          class="w-full"
          @update:model-value="pushEvent(SELECT_CATEGORY, { category_id: $event })"
        />
      </UFormField>

      <UFormField
        v-if="subcategoriesItems.length"
        :label="t('subcategory')"
      >
        <USelect
          v-model="newSubcategoryId"
          :items="subcategoriesItems"
          :placeholder="t('select')"
          valueKey="value"
          labelKey="label"
          class="w-full"
          @update:model-value="pushEvent(SELECT_SUBCATEGORY, { subcategory_id: $event })"
        />
      </UFormField>

      <UFormField
        v-if="brandsItems.length"
        :label="t('brand')"
      >
        <USelect
          v-model="newBrandId"
          :items="brandsItems"
          :placeholder="t('select')"
          valueKey="value"
          labelKey="label"
          class="w-full"
          @update:model-value="pushEvent(SELECT_BRAND, { brand_id: $event })"
        />
      </UFormField>

      <UFormField :label="t('price')">
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
      </UFormField>
    </div>

    <template #footer>
      <div class="flex gap-2 px-4 pb-4">
        <UButton
          :label="t('clear_all')"
          color="neutral"
          variant="soft"
          class="flex-1"
          @click="clearAllFilters"
        />

        <UButton
          :label="t('apply')"
          class="flex-1"
          @click="updateFilters"
        />
      </div>
    </template>
  </UDrawer>
</template>
