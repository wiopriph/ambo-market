<script setup lang="ts">
import type { ControlsProps } from './types';


const props = defineProps<ControlsProps>();


const { t } = useI18n();

const emit = defineEmits([
  'closePost',
  'showNumber',
]);

const closePost = () => {
  emit('closePost');
};

const showNumber = () => {
  emit('showNumber');
};
</script>

<i18n>
{
  "en": {
    "contact_seller": "Contact seller",
    "close_post": "Close Ad"
  },
  "pt": {
    "contact_seller": "Contatar vendedor",
    "close_post": "Anúncio Fechado"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <UIButton
      v-if="isOwner"
      :isLoading="isClosePostLoading"
      :text="t('close_post')"
      :class="$style.button"
      @click="closePost"
    />

    <template v-else>
      <a
        v-if="props.phoneNumber"
        :href="`tel:${phoneNumber}`"
        :class="[$style.button, $style.numberButton]"
      >{{ phoneNumber }}</a>

      <UIButton
        v-else
        :isLoading="isNumberLoading"
        :text="t('show_number')"
        :class="$style.button"
        @click="showNumber"
      />
    </template>
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: column;
}

.numberButton {
  @include ui-button-primary;
}

.button {
  width: 100%;

  & + & {
    margin-top: 8px;
  }
}
</style>
