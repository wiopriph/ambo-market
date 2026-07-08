<script setup lang="ts">
import { usePosts } from '~/composables/usePosts';
import { CATEGORIES } from '~/constants/categories';
import { DEFAULT_FILTERS } from '~/constants/filters';
import getObjectDifferences from '~/utils/getObjectDifferences';
import { CITIES } from '~/constants/cities';
import { getFilterableAttributeFields } from '~/constants/productAttributes';
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
  attrs,
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

// --- Фильтры по атрибутам ---

const attributeFields = computed(() =>
  getFilterableAttributeFields(newCategoryId.value, newSubcategoryId.value));

// значения контролов: field.key -> string[] (select) | boolean, `${key}_min`/`${key}_max` -> string
const newAttrs = ref<Record<string, any>>({});

const resetAttrControls = () => {
  const controls: Record<string, any> = {};

  for (const field of attributeFields.value) {
    if (field.type === 'select') controls[field.key] = [];

    if (field.type === 'boolean') controls[field.key] = false;

    if (field.type === 'number') {
      controls[`${field.key}_min`] = '';
      controls[`${field.key}_max`] = '';
    }
  }

  newAttrs.value = controls;
};

const fillAttrControlsFromState = () => {
  resetAttrControls();

  for (const field of attributeFields.value) {
    if (field.type === 'select') {
      const raw = attrs.value[`attr_${field.key}`];

      if (raw) newAttrs.value[field.key] = raw.split(',');
    }

    if (field.type === 'boolean' && attrs.value[`attr_${field.key}`] === '1') {
      newAttrs.value[field.key] = true;
    }

    if (field.type === 'number') {
      newAttrs.value[`${field.key}_min`] = attrs.value[`attr_${field.key}_min`] ?? '';
      newAttrs.value[`${field.key}_max`] = attrs.value[`attr_${field.key}_max`] ?? '';
    }
  }
};

const buildAttrQuery = () => {
  const result: Record<string, string> = {};

  for (const field of attributeFields.value) {
    if (field.type === 'select') {
      const values = (newAttrs.value[field.key] ?? []).filter(Boolean);

      if (values.length) result[`attr_${field.key}`] = values.join(',');
    }

    if (field.type === 'boolean' && newAttrs.value[field.key]) {
      result[`attr_${field.key}`] = '1';
    }

    if (field.type === 'number') {
      const min = newAttrs.value[`${field.key}_min`];
      const max = newAttrs.value[`${field.key}_max`];

      if (min) result[`attr_${field.key}_min`] = String(min);

      if (max) result[`attr_${field.key}_max`] = String(max);
    }
  }

  return result;
};

watch(open, (val) => {
  if (val) {
    newCityId.value = cityId.value;
    newCategoryId.value = categoryId.value;
    newSubcategoryId.value = subcategoryId.value;
    newBrandId.value = brandId.value;
    newMinPrice.value = getFilter('minPrice') as string || '';
    newMaxPrice.value = getFilter('maxPrice') as string || '';
    fillAttrControlsFromState();
  }
});

// сбросы — только на действия пользователя (не на программную инициализацию при открытии)
const onCategoryChange = (value: string) => {
  pushEvent(SELECT_CATEGORY, { 'category_id': value });
  newSubcategoryId.value = '';
  newBrandId.value = '';
  nextTick(resetAttrControls);
};

const onSubcategoryChange = (value: string) => {
  pushEvent(SELECT_SUBCATEGORY, { 'subcategory_id': value });
  newBrandId.value = '';
  nextTick(resetAttrControls);
};

const route = useRoute();
const { pushEvent } = useAnalyticsEvent();

const updateFilters = () => {
  const query = {
    ...getObjectDifferences(
      { ...currentFilters.value, minPrice: newMinPrice.value, maxPrice: newMaxPrice.value },
      DEFAULT_FILTERS,
    ),
    ...buildAttrQuery(),
  };
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
            @update:model-value="onCategoryChange($event as string)"
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
            @update:model-value="onSubcategoryChange($event as string)"
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

        <template v-if="attributeFields.length">
          <div class="border-t border-default pt-4">
            <p class="mb-3 text-sm font-semibold text-highlighted">
              Características
            </p>

            <div class="flex flex-col gap-4">
              <UFormField
                v-for="field in attributeFields"
                :key="field.key"
                :label="field.unit ? `${field.label} (${field.unit})` : field.label"
              >
                <USelect
                  v-if="field.type === 'select'"
                  v-model="newAttrs[field.key]"
                  :items="field.options"
                  multiple
                  valueKey="value"
                  labelKey="label"
                  placeholder="Qualquer"
                  class="w-full"
                />

                <div
                  v-else-if="field.type === 'number'"
                  class="flex gap-2"
                >
                  <UInput
                    v-model="newAttrs[`${field.key}_min`]"
                    placeholder="De"
                    type="number"
                    inputmode="decimal"
                    class="w-full"
                  />

                  <UInput
                    v-model="newAttrs[`${field.key}_max`]"
                    placeholder="Até"
                    type="number"
                    inputmode="decimal"
                    class="w-full"
                  />
                </div>

                <USwitch
                  v-else-if="field.type === 'boolean'"
                  v-model="newAttrs[field.key]"
                />
              </UFormField>
            </div>
          </div>
        </template>
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
