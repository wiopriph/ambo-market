<script setup lang="ts">
import type { CriterionProps } from './types';
import IconClose from '~/assets/images/auth/icon-close.svg?component';


const props = withDefaults(defineProps<CriterionProps>(), {
  value: '',
});

const FILTERS = {
  PERIOD: 'period',
  SAFE_TRANSACTION: 'safeTransaction',
  MIN_PRICE: 'minPrice',
  MAX_PRICE: 'maxPrice',
  Q: 'q',
};

const { t } = useI18n();

const displayText = computed(() => {
  switch (props.type) {
    case FILTERS.PERIOD:
      return t(`${props.value}`);
    case FILTERS.SAFE_TRANSACTION:
      return t('safe_deal');
    case FILTERS.MIN_PRICE:
      return t('from', { value: props.value });
    case FILTERS.MAX_PRICE:
      return t('to', { value: props.value });
    case FILTERS.Q:
      return t('search', { value: props.value });
    default:
      return props.value;
  }
});


const emit = defineEmits(['click']);

const click = () => {
  emit('click', props.type);
};
</script>

<i18n lang="json">
{
  "en": {
    "search": "Search: {value}",
    "from": "From {value} $",
    "to": "To {value} $",
    "safe_deal": "Safe deal",
    "day": "For 24 hours",
    "week": "For 7 days",
    "all": "All the time"
  },
  "pt": {
    "search": "Consulta de pesquisa: {value}",
    "from": "Por {value} $",
    "to": "Até {value} $",
    "safe_deal": "Negociação segura",
    "day": "Por 24 horas",
    "week": "Por 7 dias",
    "all": "O tempo todo"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <span
      :class="$style.text"
      v-text="displayText"
    />

    <button
      :class="$style.button"
      type="button"
      @click="click"
    >
      <IconClose :class="$style.icon" />
    </button>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-round-content-blocks;

  position: relative;
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding-right: 28px;
  padding-left: 10px;
  background-color: $ui-color-transparent;
  border: 1px solid $ui-color-transparent;
}

.text {
  @include ui-typo-14;

  max-width: 240px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.button {
  @include ui-button;

  position: absolute;
  top: 50%;
  right: 6px;
  width: 16px;
  height: 16px;
  margin: 0;
  padding: 0;
  transform: translateY(-50%);
  cursor: pointer;
}

.icon {
  width: 100%;
  height: 100%;
}
</style>
