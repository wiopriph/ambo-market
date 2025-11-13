<script setup lang="ts">
const { data, error } = await useFetch('/api/offices/list');

if (error.value) {
  throw createError(error.value);
}

const points = computed(() => data.value?.items || []);

const { t } = useI18n();
</script>


<i18n lang="json">
{
  "en": {
    "points": "Pick-up points"
  },
  "pt": {
    "points": "Pontos de coleta"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <h1
      :class="$style.title"
      v-text="t('points')"
    />

    <ul :class="$style.list">
      <li
        v-for="point in points"
        :key="point.id"
        :class="$style.point"
      >
        <OrderPointCard
          :point="point"
          :class="$style.card"
        />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-simple-container;
  @include ui-typo-15;

  padding: 24px 20px;
}

.title {
  @include ui-typo-24-bold;
}


.list {
  @include ui-row;

  margin-top: 20px;
}

.point {
  @include ui-col-ready;
  @include ui-col-vertical-gutter;

  @include md {
    @include ui-col(12);

    & + & {
      margin-top: 20px;
    }
  }

  @include exclude-md {
    @include ui-col(6);
  }
}

.card {
  @include ui-round-content-blocks;

  padding: 20px;
  background-color: $ui-color-white;
  box-shadow: $box-shadow;
}

.item {
  color: $ui-color-text-main;

  & + & {
    margin-top: 10px;
  }
}

.text {
  color: $ui-color-black;
}
</style>
