<script setup lang="ts">
const { $fire } = useNuxtApp();

const { data: points, error } = await useAsyncData(
  'pickupPoints',
  async () => {
    try {
      const points = await $fire.https('getPickupPoints');

      return points?.list;
    } catch (error_) {
      if (error_?.code === 'functions/not-found') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Not found',
          fatal: true,
        });
      }

      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to load pickup points',
        fatal: true,
      });
    }
  },
);

if (error?.value) {
  throw createError(error.value);
}

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
  }

  @include exclude-md {
    @include ui-col(6);
  }

  & + & {
    margin-top: 20px;
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
