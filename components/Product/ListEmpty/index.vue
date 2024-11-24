<script setup lang="ts">
import type { ListEmptyProps } from './types';
import IconEmptyProductList from '~/assets/images/icon-empty-product-list.svg?component';


const props = defineProps<ListEmptyProps>();

const { t } = useI18n();

const title = computed(() => props.customTitle || t('default_title'));
const text = computed(() => props.customText || t('default_text'));
</script>

<i18n>
{
  "en": {
    "default_title": "Nothing found",
    "default_text": "We couldn't find what you were looking for. Please modify the search criteria, selected filters, or category."
  },
  "pt": {
    "default_title": "Nada encontrado",
    "default_text": "Não encontramos o que você estava procurando. Por favor, modifique os critérios de busca, os filtros selecionados ou a categoria."
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <IconEmptyProductList :class="$style.icon" />

    <p
      v-if="title"
      :class="$style.title"
      v-text="title"
    />

    <p
      v-if="text"
      :class="$style.text"
      v-text="text"
    />
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 450px;
  height: 300px;
  margin-top: 20px;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
}

.icon {
  width: 100%;
  max-width: 280px;
  height: auto;
}

.title {
  @include ui-typo-20-bold;

  margin-top: 20px;
}

.text {
  @include ui-typo-15;

  margin-top: 10px;
  color: $ui-color-text-main;
}
</style>
