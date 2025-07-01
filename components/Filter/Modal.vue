<script setup lang="ts">
import { usePosts } from '~/composables/usePosts';
import { DEFAULT_FILTERS } from '~/constants/filters';
import { CATEGORIES } from '~/constants/categories';
import { CITIES } from '~/constants/cities';
import getObjectDifferences from '~/utils/getObjectDifferences';
import { SELECT_BRAND, SELECT_CATEGORY, SELECT_CITY, SELECT_SUBCATEGORY } from '~/constants/analytics-events';


const { t } = useI18n();


const categoriesItems = computed(() => CATEGORIES.map(({ id, key }) => ({ value: id, text: t(key) })));

const citiesList = computed(() => CITIES.map(city => ({
  value: city.id,
  text: city.name ? city.name : t('everywhere'),
})));


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

const minPrice = ref<string | number>('');
const maxPrice = ref<string | number>('');
const safeTransaction = ref<boolean>(false);

const subcategoriesItems = computed(() => {
  const category = CATEGORIES.find(cat => cat.id === newCategoryId.value);

  return category?.subcategories?.map(({ id, key }) => ({ value: id, text: t(key) })) || [];
});


const brandsItems = computed(() => {
  const category = CATEGORIES.find(cat => cat.id === newCategoryId.value);
  const subcategory = category?.subcategories?.find(sc => sc.id === newSubcategoryId.value);

  return subcategory?.brands?.map(({ id, key }) => ({ value: id, text: t(key) })) || [];
});


onMounted(() => {
  newCityId.value = cityId.value;
  newCategoryId.value = categoryId.value;
  newSubcategoryId.value = subcategoryId.value;
  newBrandId.value = brandId.value;

  minPrice.value = getFilter('minPrice');
  maxPrice.value = getFilter('maxPrice');
  safeTransaction.value = getFilter('safeTransaction');
});


const updateFilters = () => {
  const filters = {
    ...currentFilters.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    safeTransaction: safeTransaction.value,
  };

  const query = getObjectDifferences(filters, DEFAULT_FILTERS);

  close();

  const params: Record<string, string> = {
    cityId: newCityId.value || 'all',
  };

  const valuesMap = {
    categoryId: newCategoryId.value,
    subcategoryId: newSubcategoryId.value,
    brandId: newBrandId.value,
  };

  const keys = ['categoryId', 'subcategoryId', 'brandId'];

  for (const key of keys) {
    const value = valuesMap[key as keyof typeof valuesMap];

    if (value) {
      params[key] = value;
    } else {
      break;
    }
  }

  const name = Object.keys(params).join('-');

  return navigateTo({ name, params, query });
};


const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

const clearAllFilters = () => {
  navigateTo({ query: { q: getFilter('q') } });

  close();
};

const { pushEvent } = useAnalyticsEvent();


const setCity = (cityId: string) => {
  pushEvent(SELECT_CITY, { city_id: cityId });
};

const setCategory = (categoryId: string) => {
  pushEvent(SELECT_CATEGORY, { category_id: categoryId });
};

const setSubcategory = (subcategoryId: string) => {
  pushEvent(SELECT_SUBCATEGORY, { subcategory_id: subcategoryId });
};

const setBrand = (brandId: string) => {
  pushEvent(SELECT_BRAND, { brand_id: brandId });
};
</script>

<i18n lang="json">
{
  "en": {
    "filters": "Filters",
    "everywhere": "Everywhere",
    "category": "Category",
    "subcategory": "Subcategory",
    "brand": "Brand",
    "select": "Select",
    "price": "Price",
    "from": "from",
    "to": "to",
    "safe_deal": "Safe deal",
    "radius": "Radius",
    "clear_all": "Clear all filter",
    "update_search": "Update search"
  },
  "pt": {
    "filters": "Filtros",
    "everywhere": "Em todos os lugares",
    "category": "Categoria",
    "subcategory": "Subcategoria",
    "brand": "Marca",
    "select": "Selecione",
    "price": "Preço",
    "from": "por",
    "to": "até",
    "safe_deal": "Negócio Seguro",
    "radius": "raio",
    "clear_all": "limpar todo o filtro",
    "update_search": "Atualizar pesquisa"
  }
}
</i18n>

<template>
  <UIModal
    :title="t('filters')"
    @close="close"
  >
    <div :class="$style.root">
      <ul :class="$style.wrap">
        <li :class="$style.block">
          <span
            :class="$style.title"
            v-text="t('city')"
          />

          <UISelect
            v-model="newCityId"
            :options="citiesList"
            :placeholder="t('select')"
            :class="$style.selector"
            name="city"
            @update:model-value="setCity"
          />
        </li>

        <li :class="$style.block">
          <span
            :class="$style.title"
            v-text="t('category')"
          />

          <UISelect
            v-model="newCategoryId"
            :options="categoriesItems"
            :placeholder="t('select')"
            :class="$style.selector"
            name="category"
            @update:model-value="setCategory"
          />
        </li>

        <li
          v-if="subcategoriesItems.length"
          :class="$style.block"
        >
          <span
            :class="$style.title"
            v-text="t('subcategory')"
          />

          <UISelect
            v-model="newSubcategoryId"
            :options="subcategoriesItems"
            :placeholder="t('select')"
            :class="$style.selector"
            name="subcategory"
            @update:model-value="setSubcategory"
          />
        </li>

        <li
          v-if="brandsItems.length"
          :class="$style.block"
        >
          <span
            :class="$style.title"
            v-text="t('brand')"
          />

          <UISelect
            v-model="newBrandId"
            :options="brandsItems"
            :placeholder="t('select')"
            :class="$style.selector"
            name="brand"
            @update:model-value="setBrand"
          />
        </li>

        <li :class="$style.block">
          <span
            :class="$style.title"
            v-text="t('price')"
          />

          <div :class="$style.priceRange">
            <UIInput
              v-model="minPrice"
              :placeholder="t('from')"
              :class="$style.price"
              name="min_price"
              type="number"
            />

            <UIInput
              v-model="maxPrice"
              :placeholder="t('to')"
              :class="$style.price"
              name="max_price"
              type="number"
            />
          </div>
        </li>

        <li
          v-if="false"
          :class="$style.block"
        >
          <div :class="$style.check">
            <span
              :class="$style.title"
              v-text="t('safe_deal')"
            />

            <UICheckbox v-model="safeTransaction" />
          </div>
        </li>
      </ul>

      <div :class="$style.bottom">
        <UIButton
          :text="t('clear_all')"
          :class="$style.button"
          type="secondary"
          @click="clearAllFilters"
        />

        <UIButton
          :text="t('update_search')"
          :class="$style.button"
          @click="updateFilters"
        />
      </div>
    </div>
  </UIModal>
</template>

<style lang="scss" module>
.root {
  width: 100%;
  height: calc(100% - 44px);
  padding: 0 20px;
}

.wrap {
  height: calc(100vh - 44px - 138px);
  overflow: auto scroll;
}

.block {
  padding: 8px 0;
}

.title {
  @include ui-typo-15-bold;
}

.priceRange {
  display: flex;
  flex-direction: row;
  margin-top: 8px;
}

.price {

  & + & {
    margin-left: 4px;
  }
}

.check {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.selector {
  margin-top: 8px;
}

.bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  background-color: $ui-color-white;
}

.button {
  width: 100%;

  & + & {
    margin-top: 8px;
  }
}
</style>

