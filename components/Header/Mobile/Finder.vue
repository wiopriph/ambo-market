<script setup lang="ts">
import IconFilter from '~/assets/images/header/icon-filter.svg?component';
import IconClose from '~/assets/images/auth/icon-close.svg?component';
import { DEFAULT_FILTERS } from '~/constants/filters';
import getObjectDifferences from '~/utils/getObjectDifferences';
import { usePosts } from '~/composables/usePosts';
import type { Filters } from '~/composables/usePosts/types';


const { t } = useI18n();

const route = useRoute();

const searchPlaceholder = computed(() => {
  const { categoryId } = route.params;

  if (categoryId) {
    return t('search_in_category', { category: t(`${categoryId}`) });
  }

  return t('search');
});


const {
  getFilter,
  currentFilters,
  cityId,
  isFindActive,
} = usePosts();

const searchString = ref('');

onMounted(() => {
  searchString.value = getFilter('q');
});

const hasRemoveFiltersButton = computed(() => Object.keys(currentFilters.value).length > 2);

const find = () => {
  const { categoryId } = route.params;

  if (categoryId) {
    return navigateTo({
      name: 'cityId-categoryId',
      params: {
        cityId: cityId.value,
        categoryId,
      },
      query: {
        ...currentFilters.value,
        q: searchString.value,
      },
    });
  }

  if (cityId.value && cityId.value !== 'all') {
    return navigateTo({
      name: 'cityId',
      params: {
        cityId: cityId.value,
      },
      query: {
        ...currentFilters.value,
        q: searchString.value,
      },
    });
  }

  return navigateTo({
    name: 'index',
    query: {
      ...currentFilters.value,
      q: searchString.value,
    },
  });
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


const isFilterModalVisible = ref(false);

const showFilterModal = () => {
  isFilterModalVisible.value = true;
};

const hideFilterModal = () => {
  isFilterModalVisible.value = false;
};
</script>

<i18n>
{
  "en": {
    "search": "Search for anything",
    "search_in_category": "Search in {category} section"
  },
  "pt": {
    "search": "Procure por qualquer coisa",
    "search_in_category": "Pesquisar na seção {category}"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <div :class="$style.findWrap">
      <UIInput
        v-model="searchString"
        :placeholder="searchPlaceholder"
        name="search"
        type="text"
        @submit="find"
      />

      <button
        v-if="isFindActive"
        :class="$style.filterButton"
        type="button"
        @click="showFilterModal"
      >
        <IconFilter :class="$style.filterIcon" />
      </button>
    </div>

    <div
      v-if="isFindActive"
      :class="$style.criterionWrap"
    >
      <button
        v-if="hasRemoveFiltersButton"
        :class="$style.criterionButton"
        type="button"
        @click="clearAllFilters"
      >
        <IconClose :class="$style.criterionIcon" />
      </button>

      <ul :class="$style.criterionList">
        <li
          v-for="(value, key) in currentFilters"
          :key="key"
          :class="$style.criterion"
        >
          <FilterCriterion
            :type="key"
            :value="value"
            @click="removeFilter"
          />
        </li>
      </ul>
    </div>

    <transition name="fade">
      <LazyFilterModal
        v-if="isFilterModalVisible"
        @close="hideFilterModal"
      />
    </transition>
  </div>
</template>

<style lang="scss" module>
.root {
  padding: 10px 20px;
}

.findWrap {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.filterButton {
  @include ui-button-primary;

  & {
    margin-left: 10px;
    padding: 10px;

    display: flex;
    flex-direction: row;
    align-items: center;
  }
}

.filterIcon {
  fill: #FFFFFF;
}

.criterionWrap {
  position: relative;
  margin-top: 10px;
  overflow: auto hidden;
}

.criterionButton {
  @include ui-button;
  @include ui-round-content-blocks;

  position: fixed;
  right: 20px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: $ui-color-white;
  box-shadow: $box-shadow;
}

.criterionIcon {
  width: 18px;
  height: 18px;
}

.criterionList {
  display: inline-flex;
  margin-right: 28px + 5px;
  white-space: nowrap;
}

.criterion {

  & + & {
    margin-left: 5px;
  }
}
</style>
