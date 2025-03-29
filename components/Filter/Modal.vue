<script setup lang="ts">
import { PERIODS, DEFAULT_FILTERS, type PeriodsValues } from '~/constants/filters';
import getObjectDifferences from '~/utils/getObjectDifferences';
import { usePosts } from '~/composables/usePosts';
import { CATEGORIES } from '~/constants/categories';
import { CITIES } from '~/constants/cities';


const { t } = useI18n();

const periods = computed(() => [
  { type: PERIODS.DAY, text: t('day') },
  { type: PERIODS.WEEK, text: t('week') },
  { type: PERIODS.ALL, text: t('all') },
]);

const categoriesItems = computed(() => CATEGORIES.map(({ type }) => ({ value: type, text: t(type) })));

const citiesList = computed(() => CITIES.map(city => ({
  value: city.id,
  text: city.name ? city.name : t('everywhere'),
})));


const {
  cityId,
  getFilter,
  currentFilters,
} = usePosts();

const newCityId = ref('');
const categoryId = ref('');
const minPrice = ref<string | number>('');
const maxPrice = ref<string | number>('');
const safeTransaction = ref<boolean>(false);
const period = ref<PeriodsValues>(PERIODS.ALL);


const route = useRoute();

onMounted(() => {
  newCityId.value = cityId.value;
  categoryId.value = route.params.categoryId as string;

  minPrice.value = getFilter('minPrice');
  maxPrice.value = getFilter('maxPrice');
  safeTransaction.value = getFilter('safeTransaction');
  period.value = getFilter('period');
});


const updateFilters = () => {
  const filters = {
    ...currentFilters.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    safeTransaction: safeTransaction.value,
    period: period.value,
  };

  const query = getObjectDifferences(filters, DEFAULT_FILTERS);

  close();

  if (categoryId.value) {
    return navigateTo({
      name: 'cityId-categoryId',
      params: {
        cityId: newCityId.value || 'all',
        categoryId: categoryId.value,
      },
      query,
    });
  }

  return navigateTo({
    name: 'cityId',
    params: {
      cityId: newCityId.value || 'all',
    },
    query,
  });
};


const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

const clearAllFilters = () => {
  navigateTo({ query: { q: getFilter('q') } });

  close();
};
</script>

<i18n lang="json">
{
  "en": {
    "filters": "Filters",
    "everywhere": "Everywhere",
    "category": "Category",
    "select_category": "Select category",
    "price": "Price",
    "from": "from",
    "to": "to",
    "safe_deal": "Safe deal",
    "period": "Placement period",
    "day": "For 24 hours",
    "week": "For 7 days",
    "all": "All the time",
    "radius": "Radius",
    "clear_all": "Clear all filter",
    "update_search": "Update search"
  },
  "pt": {
    "filters": "Filtros",
    "everywhere": "Em todos os lugares",
    "category": "Categoria",
    "select_category": "Selecione a categoria",
    "price": "Preço",
    "from": "por",
    "to": "até",
    "safe_deal": "Negociação segura",
    "period": "Período de colocação",
    "day": "Por 24 horas",
    "week": "Por 7 dias",
    "all": "O tempo todo",
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
            :placeholder="t('select_city')"
            :class="$style.selector"
            name="category"
          />
        </li>

        <li :class="$style.block">
          <span
            :class="$style.title"
            v-text="t('category')"
          />

          <UISelect
            v-model="categoryId"
            :options="categoriesItems"
            :placeholder="t('select_category')"
            :class="$style.selector"
            name="category"
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

        <li :class="$style.block">
          <span
            :class="$style.title"
            v-text="t('period')"
          />

          <ul :class="$style.selector">
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
  padding: 20px 0;

  & + & {
    border-top: 1px solid $ui-color-transparent;
  }
}

.title {
  @include ui-typo-15-bold;
}

.priceRange {
  display: flex;
  flex-direction: row;
  margin-top: 16px;
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

.selector {
  margin-top: 16px;
}

.periodItem {

  & + & {
    margin-top: 10px;
  }
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
    margin-top: 10px;
  }
}
</style>
