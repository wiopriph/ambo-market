<script setup lang="ts">
import type { RouteLocationRaw } from '#vue-router';
import IconCheckbox from '~/assets/images/icon-checkbox.svg?component';
import type { CategoryCard } from '~/components/Category/Card/types';


const indexRoute = inject<RouteLocationRaw>('indexRoute');
const categoryList = inject<ComputedRef<CategoryCard[]>>('categoryList');


const emit = defineEmits(['close']);

const close = () => setTimeout(() => {
  emit('close');
}, 100);

const { t } = useI18n();
</script>

<i18n lang="json">
{
  "en": {
    "all_categories": "All categories"
  },
  "pt": {
    "all_categories": "Todas as categorias"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <ul :class="$style.list">
      <li :class="$style.item">
        <NuxtLink
          :to="indexRoute"
          :class="$style.link"
          @click="close"
        >
          <span :class="$style.iconWrap">
            <IconCheckbox :class="$style.icon" />
          </span>

          <span v-text="t('all_categories')" />
        </NuxtLink>
      </li>

      <template v-if="categoryList">
        <li
          v-for="category in categoryList"
          :key="category.title"
          :class="$style.item"
        >
          <NuxtLink
            :to="category.route"
            :class="$style.link"
            @click="close"
          >
            <span :class="$style.iconWrap">
              <NuxtImg
                :src="category.img"
                :alt="category.title"
                :class="$style.icon"
                quality="70"
              />
            </span>

            <span v-text="category.title" />
          </NuxtLink>
        </li>
      </template>
    </ul>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-round-ui-elements;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  overflow-y: scroll;
  background-color: $ui-color-white;
}

.list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  padding-bottom: 10px;
}

.item {
  width: 100%;
  border-top: 1px solid $ui-color-transparent;
}

.link {
  display: flex;
  align-items: center;
  padding: 2px 20px;
  color: $ui-color-black;
}

.iconWrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: 16px;
}

.icon {
  width: auto;
  max-width: 40px;
  max-height: 40px;
}
</style>
