<script setup lang="ts">
import debounce from 'lodash/debounce';
import { PERIODS, DEFAULT_FILTERS } from '~/constants/filters';
import getObjectDifferences from '~/utils/getObjectDifferences';
import { usePosts } from '~/composables/usePosts';
import type { Filters } from '~/composables/usePosts/types';


const { t } = useI18n();

const periods = computed(() => [
  { type: PERIODS.DAY, text: t('day') },
  { type: PERIODS.WEEK, text: t('week') },
  { type: PERIODS.ALL, text: t('all') },
]);


const {
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


// @todo: мб isFindActive вместо hasActiveFilters
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

const period = computed({
  get() {
    return getFilter('period');
  },
  set(value: string) {
    setFilter('period', value);
  },
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
    "price": "Price, $",
    "from": "from",
    "to": "to",
    "safe_deal": "Safe deal",
    "period": "Placement period",
    "day": "For 24 hours",
    "week": "For 7 days",
    "all": "All the time"
  },
  "pt": {
    "clear_all": "limpar todo o filtro",
    "price": "$, Preço",
    "from": "por",
    "to": "até",
    "safe_deal": "Negociação segura",
    "period": "Período de colocação",
    "day": "Por 24 horas",
    "week": "Por 7 dias",
    "all": "O tempo todo"
  }
}
</i18n>

<template>
  <div>
    <div
      v-if="hasActiveFilters"
      :class="$style.clear"
    >
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

      <button
        :class="$style.clearButton"
        type="button"
        @click="clearAllFilters"
        v-text="t('clear_all')"
      />
    </div>

    <div :class="$style.block">
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
    </div>

    <ul v-if="false">
      <li :class="$style.block">
        <div :class="$style.check">
          <span
            :class="$style.title"
            v-text="t('safe_deal')"
          />

          <UICheckbox
            :checked="getFilter('safeTransaction')"
            @change="changeSafeDeal"
          />
        </div>
      </li>
    </ul>

    <div :class="$style.block">
      <span
        :class="$style.title"
        v-text="t('period')"
      />

      <ul :class="$style.periodList">
        <li
          v-for="({ type, text }) in periods"
          :key="type"
          :class="$style.periodItem"
        >
          <UIInputRadio
            v-model="period"
            :text="text"
            :val="type"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
}

.criterionList {
  display: flex;
  flex-wrap: wrap;
}

.criterion {
  display: inline-flex;
  margin-right: 8px;
  margin-bottom: 8px;
}

.clear {
  padding: 16px 0;
}

.clearButton {
  margin-top: 10px;
  color: $ui-color-blue;
  background-color: initial;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.block {
  padding: 16px 0;
  border-top: 1px solid $ui-color-transparent;
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

.periodList {
  margin-top: 16px;
}

.periodItem {

  & + & {
    margin-top: 10px;
  }
}
</style>
