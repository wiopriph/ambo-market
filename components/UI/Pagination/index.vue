<script setup lang="ts">
import type { PaginationProps } from './types';


const props = withDefaults(defineProps<PaginationProps>(), {
  min: 1,
  max: 1,
  value: 1,
  view: 5,
});

const currentPage = computed(() => {
  if (props.value > props.max) {
    return props.max;
  }

  if (props.value < props.min) {
    return props.min;
  }

  return props.value;
});

const tail = computed(() => Math.floor(props.view / 2));

const pageNumbers = computed(() => {
  let offsetLeft = tail.value;
  let offsetRight = tail.value;

  const leftValue = currentPage.value - tail.value;
  const rightValue = currentPage.value + tail.value;

  if (leftValue < props.min) {
    offsetLeft = props.min + leftValue;
    offsetRight += tail.value - offsetLeft;
  }

  if (rightValue > props.max) {
    offsetRight = props.max - currentPage.value;
    offsetLeft += tail.value - offsetRight;
  }

  if (currentPage.value + offsetRight > props.max) {
    offsetRight = props.max - currentPage.value;
  }

  if (currentPage.value - offsetLeft < props.min) {
    offsetLeft = currentPage.value - props.min;
  }

  const pages = [currentPage.value];

  for (let i = 0; i < offsetLeft; i++) {
    pages.unshift(currentPage.value - i - 1);
  }

  for (let i = 0; i < offsetRight; i++) {
    pages.push(currentPage.value + i + 1);
  }

  return pages;
});

const firstItem = computed(() => pageNumbers.value[0]);
const lastItem = computed(() => pageNumbers.value[pageNumbers.value.length - 1]);

const hasFixedMin = computed(() => firstItem.value > props.min);
const hasFixedMax = computed(() => lastItem.value < props.max);

const hasStartDots = computed(() => firstItem.value > props.min + 1);
const hasEndDots = computed(() => lastItem.value < props.max - 1);

const isPrevDisabled = computed(() => currentPage.value === props.min);
const isNextDisabled = computed(() => currentPage.value === props.max);

const jumpPrevValue = computed(() => Math.max(props.min, currentPage.value - 1));
const jumpNextValue = computed(() => Math.min(props.max, currentPage.value + 1));


const emit = defineEmits(['input']);

const select = (pageNumber: number) => {
  emit('input', pageNumber);
};


const style = useCssModule();

const getButtonClassNames = (number: number) => ({
  [style.button]: true,
  [style.active]: props.value === number,
});
</script>

<template>
  <nav
    aria-label="Pagination"
    :class="$style.root"
  >
    <button
      :class="$style.button"
      :disabled="isPrevDisabled"
      type="button"
      @click="select(jumpPrevValue)"
    >
      &lt;
    </button>

    <button
      v-if="hasFixedMin"
      :class="getButtonClassNames(min)"
      type="button"
      @click="select(min)"
      v-text="min"
    />

    <button
      v-if="hasStartDots"
      :class="$style.button"
      type="button"
      disabled
    >
      &hellip;
    </button>

    <button
      v-for="num in pageNumbers"
      :key="num"
      :class="getButtonClassNames(num)"
      type="button"
      @click="select(num)"
      v-text="num"
    />

    <button
      v-if="hasEndDots"
      :class="$style.button"
      type="button"
      disabled
    >
      &hellip;
    </button>

    <button
      v-if="hasFixedMax"
      :class="getButtonClassNames(max)"
      type="button"
      @click="select(max)"
      v-text="max"
    />

    <button
      :class="$style.button"
      :disabled="isNextDisabled"
      type="button"
      @click="select(jumpNextValue)"
    >
      &gt;
    </button>
  </nav>
</template>

<style lang="scss" module>
.root {
  display: flex;
  justify-content: center;
}

.button {
  @include ui-button;

  display: inline-block;
  margin-right: -1px;
  padding: 5px 10px;
  color: $ui-color-black;
  text-align: center;
  background-color: $ui-color-white;
  border: 1px solid $ui-color-transparent;
  border-radius: 0;
  cursor: pointer;
  transition: color .2s linear;
  user-select: none;

  &:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  &:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  &:disabled {
    color: $ui-color-text-light;
    cursor: default;
  }

  &:not(:disabled):hover {
    color: $ui-color-blue-light;
  }
}

.active {
  color: $ui-color-white;
  background-color: $ui-color-blue;
  cursor: default;
}
</style>
