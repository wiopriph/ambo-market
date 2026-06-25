<script setup lang="ts">
import { usePosts } from '~/composables/usePosts';
import { CATEGORIES } from '~/constants/categories';
import { DEFAULT_FILTERS } from '~/constants/filters';
import getObjectDifferences from '~/utils/getObjectDifferences';
import { CITIES } from '~/constants/cities';
import { SELECT_BRAND, SELECT_CATEGORY, SELECT_CITY, SELECT_SUBCATEGORY } from '~/constants/analytics-events';


const open = defineModel<boolean>({ default: false });

const emit = defineEmits<{ close: [] }>();

const {
  cityId,
  categoryId,
  subcategoryId,
  brandId,
  currentFilters,
  getFilter,
} = usePosts();

const newCityId = ref('');
const newCategoryId = ref('');
const newSubcategoryId = ref('');
const newBrandId = ref('');
const newMinPrice = ref('');
const newMaxPrice = ref('');

const citiesItems = computed(() =>
  CITIES.map(({ id, name }) => ({ value: id, label: name || 'Em todos os lugares' })),
);

const categoriesItems = computed(() =>
  CATEGORIES.map(({ id, name }) => ({ value: id, label: name })),
);

const subcategoriesItems = computed(() => {
  const category = CATEGORIES.find(cat => cat.id === newCategoryId.value);

  return category?.subcategories?.map(({ id, name }) => ({ value: id, label: name })) ?? [];
});

const brandsItems = computed(() => {
  const category = CATEGORIES.find(cat => cat.id === newCategoryId.value);
  const subcategory = category?.subcategories?.find(sc => sc.id === newSubcategoryId.value);

  return subcategory?.brands?.map(({ id, name }) => ({ value: id, label: name })) ?? [];
});

watch(open, (val) => {
  if (val) {
    newCityId.value = cityId.value;
    newCategoryId.value = categoryId.value;
    newSubcategoryId.value = subcategoryId.value;
    newBrandId.value = brandId.value;
    newMinPrice.value = getFilter('minPrice') as string || '';
    newMaxPrice.value = getFilter('maxPrice') as string || '';
  }
});

watch(newCategoryId, () => {
  newSubcategoryId.value = '';
  newBrandId.value = '';
});

watch(newSubcategoryId, () => {
  newBrandId.value = '';
});

const route = useRoute();
const { pushEvent } = useAnalyticsEvent();

const updateFilters = () => {
  const query = getObjectDifferences(
    { ...currentFilters.value, minPrice: newMinPrice.value, maxPrice: newMaxPrice.value },
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

  emit('close');
  navigateTo({ name: Object.keys(params).join('-'), params, query });
};

const clearAllFilters = () => {
  const cityIdParam = (route.params.cityId as string) || cityId.value || 'all';

  emit('close');

  navigateTo({
    name: 'cityId',
    params: { cityId: cityIdParam },
    query: getObjectDifferences({ q: currentFilters.value.q }, DEFAULT_FILTERS),
  });
};
</script>

<template>
  <UDrawer
    v-model:open="open"
    direction="bottom"
  >
    <template #header>
      <div class="flex items-center justify-between px-4 py-3">
        <span class="font-semibold">Filtros</span>

        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="emit('close')"
        />
      </div>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 px-4 py-4 overflow-y-auto max-h-[60vh]">
        <UFormField
          label="Cidade"
          class="sm:hidden"
        >
          <USelect
            v-model="newCityId"
            :items="citiesItems"
            placeholder="Em todos os lugares"
            valueKey="value"
            labelKey="label"
            class="w-full"
            @update:model-value="pushEvent(SELECT_CITY, { city_id: $event })"
          />
        </UFormField>

        <UFormField label="Categoria">
          <USelect
            v-model="newCategoryId"
            :items="categoriesItems"
            placeholder="Selecione"
            valueKey="value"
            labelKey="label"
            class="w-full"
            @update:model-value="pushEvent(SELECT_CATEGORY, { category_id: $event })"
          />
        </UFormField>

        <UFormField
          v-if="subcategoriesItems.length"
          label="Subcategoria"
        >
          <USelect
            v-model="newSubcategoryId"
            :items="subcategoriesItems"
            placeholder="Selecione"
            valueKey="value"
            labelKey="label"
            class="w-full"
            @update:model-value="pushEvent(SELECT_SUBCATEGORY, { subcategory_id: $event })"
          />
        </UFormField>

        <UFormField
          v-if="brandsItems.length"
          label="Marca"
        >
          <USelect
            v-model="newBrandId"
            :items="brandsItems"
            placeholder="Selecione"
            valueKey="value"
            labelKey="label"
            class="w-full"
            @update:model-value="pushEvent(SELECT_BRAND, { brand_id: $event })"
          />
        </UFormField>

        <UFormField label="Preço">
          <div class="flex gap-2">
            <UInput
              v-model="newMinPrice"
              placeholder="De"
              type="number"
              class="w-full"
            />

            <UInput
              v-model="newMaxPrice"
              placeholder="Até"
              type="number"
              class="w-full"
            />
          </div>
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex gap-2 px-4 pb-4">
        <UButton
          label="Limpar tudo"
          color="neutral"
          variant="soft"
          class="flex-1"
          @click="clearAllFilters"
        />

        <UButton
          label="Aplicar"
          class="flex-1"
          @click="updateFilters"
        />
      </div>
    </template>
  </UDrawer>
</template>
