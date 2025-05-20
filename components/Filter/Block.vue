<script setup lang="ts">
import debounce from 'lodash/debounce';
import { usePosts } from '~/composables/usePosts';
import type { Filters } from '~/composables/usePosts/types';
import { DEFAULT_FILTERS } from '~/constants/filters';
import { CATEGORIES, getCategoryById } from '~/constants/categories';
import { CITIES } from '~/constants/cities';
import getObjectDifferences from '~/utils/getObjectDifferences';


const { t } = useI18n();

const categoriesItems = computed(() => CATEGORIES.map(({ id, key }) => ({ value: id, text: t(key) })));

const subcategoriesItems = computed(() => {
  const category = getCategoryById(categoryId.value);

  if (category?.subcategories?.length) {
    return category.subcategories?.map(({ id, key }) => ({ value: id, text: t(key) }));
  }

  return [];
});

const brandsItems = computed(() => {
  const category = getCategoryById(categoryId.value);
  const subcategory = category?.subcategories?.find(sc => sc.id === subcategoryId.value);

  if (subcategory?.brands?.length) {
    return subcategory.brands.map(({ id, key }) => ({
      value: id,
      text: t(key),
    }));
  }

  return [];
});

const {
  cityId,
  categoryId,
  subcategoryId,
  brandId,
  currentFilters,
  getFilter,
} = usePosts();

const setFilter = (type: string, value: string | number | boolean) => {
  const filters = {
    ...currentFilters.value,
    [type]: value,
  };
  const query = getObjectDifferences(filters, DEFAULT_FILTERS);

  navigateTo({ query });
};


const citiesList = computed(() => CITIES.map(city => ({
  value: city.id,
  text: city.name || t('everywhere'),
})));

const route = useRoute();

const setCity = (city: string) => {
  const query = { ...currentFilters.value };
  const params: Record<string, string> = {
    cityId: city || 'all',
  };

  const keys: string[] = ['categoryId', 'subcategoryId', 'brandId'];

  for (const key of keys) {
    const value = route.params[key];

    if (value) {
      params[key] = value as string;
    } else {
      break;
    }
  }

  const name = Object.keys(params).join('-');

  return navigateTo({ name, params, query });
};

const setCategory = (categoryId: string) => {
  const query = { ...currentFilters.value };

  if (categoryId) {
    return navigateTo({
      name: 'cityId-categoryId',
      params: {
        cityId: cityId.value,
        categoryId,
      },
      query,
    });
  }

  return navigateTo({
    name: 'cityId',
    params: {
      cityId: cityId.value,
    },
    query,
  });
};

const setSubcategory = (subcategoryId: string) => {
  const query = { ...currentFilters.value };

  return navigateTo({
    name: 'cityId-categoryId-subcategoryId',
    params: {
      cityId: cityId.value,
      categoryId: categoryId.value,
      subcategoryId,
    },
    query,
  });
};

const setBrand = (brandId: string) => {
  const query = { ...currentFilters.value };

  return navigateTo({
    name: 'cityId-categoryId-subcategoryId-brandId',
    params: {
      cityId: cityId.value,
      categoryId: categoryId.value,
      subcategoryId: subcategoryId.value,
      brandId,
    },
    query,
  });
};

const hasActiveFilters = computed(() => !!Object.keys(currentFilters.value).length);

const minPrice = computed({
  get() {
    return getFilter('minPrice');
  },
  set: debounce((value: number | string) => {
    setFilter('minPrice', value);
  }, 1000),
});

const maxPrice = computed({
  get() {
    return getFilter('maxPrice');
  },
  set: debounce((value: number | string) => {
    setFilter('maxPrice', value);
  }, 1000),
});

const changeSafeDeal = (value: boolean) => {
  setFilter('safeTransaction', value);
};


const removeFilter = (filterType: keyof Filters) => {
  const filters = { ...currentFilters.value };

  delete filters[filterType];

  const query = getObjectDifferences(filters, DEFAULT_FILTERS);

  navigateTo({ query });
};

const clearAllFilters = () => {
  const onlySearchFilter = { q: getFilter('q') };

  const query = getObjectDifferences(onlySearchFilter, DEFAULT_FILTERS);

  navigateTo({ query });
};
</script>

<i18n>
{
  "en": {
    "clear_all": "Clear all filter",
    "everywhere": "Everywhere",
    "category": "Category",
    "subcategory": "Subcategory",
    "brand": "Brand",
    "select": "Select",
    "price": "Price",
    "from": "from",
    "to": "to",
    "safe_deal": "Safe deal"
  },
  "pt": {
    "clear_all": "limpar todo o filtro",
    "everywhere": "Em todos os lugares",
    "category": "Categoria",
    "subcategory": "Subcategoria",
    "brand": "Marca",
    "select": "Selecione",
    "price": "Preço",
    "from": "por",
    "to": "até",
    "safe_deal": "Negócio Seguro"
  }
}
</i18n>

<template>
  <ul :class="$style.root">
    <li
      v-if="hasActiveFilters"
      :class="$style.block"
    >
      <ul :class="$style.criterionList">
        <li
          v-for="(value, key) in currentFilters"
          :key="key"
          :class="$style.criterionItem"
        >
          <FilterCriterion
            :type="key"
            :value="value"
            @click="removeFilter"
          />
        </li>
      </ul>

      <button
        :class="$style.criterionClearButton"
        type="button"
        @click="clearAllFilters"
        v-text="t('clear_all')"
      />
    </li>

    <li :class="$style.block">
      <span
        :class="$style.title"
        v-text="t('city')"
      />

      <UISelect
        :modelValue="cityId"
        :options="citiesList"
        :placeholder="t('select')"
        :class="$style.category"
        name="category"
        @update:model-value="setCity"
      />
    </li>

    <li :class="$style.block">
      <span
        :class="$style.title"
        v-text="t('category')"
      />

      <UISelect
        :modelValue="categoryId"
        :options="categoriesItems"
        :placeholder="t('select')"
        :class="$style.category"
        name="category"
        @update:model-value="setCategory"
      />
    </li>

    <li :class="$style.block">
      <span
        :class="$style.title"
        v-text="t('subcategory')"
      />

      <UISelect
        :modelValue="subcategoryId"
        :options="subcategoriesItems"
        :placeholder="t('select')"
        :class="$style.category"
        name="category"
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
        :modelValue="brandId"
        :options="brandsItems"
        :placeholder="t('select')"
        :class="$style.category"
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
          name="from"
          type="number"
        />

        <UIInput
          v-model="maxPrice"
          :placeholder="t('to')"
          :class="$style.price"
          name="to"
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

        <UICheckbox
          :modelValue="getFilter('safeTransaction')"
          @update:model-value="changeSafeDeal"
        />
      </div>
    </li>
  </ul>
</template>

<style lang="scss" module>
.root {
  @include ui-round-content-blocks;

  padding: 4px 20px;
  background-color: $ui-color-white;
  box-shadow: $box-shadow;
}

.block {
  padding: 16px 0;

  & + & {
    border-top: 1px solid $ui-color-transparent;
  }
}

.criterionList {
  display: flex;
  flex-wrap: wrap;
}

.criterionItem {
  display: inline-flex;
  margin-right: 8px;
  margin-bottom: 8px;
}

.criterionClearButton {
  margin-top: 10px;
  color: $ui-color-blue;
  background-color: initial;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.title {
  @include ui-typo-15-bold;
}

.priceRange {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}

.price {

  & + & {
    margin-left: 5px;
  }
}

.check {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.category {
  margin-top: 16px;
}
</style>
