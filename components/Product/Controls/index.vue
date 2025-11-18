<script setup lang="ts">
import type { ControlsProps } from './types';


const props = defineProps<ControlsProps>();


const { t } = useI18n();

const emit = defineEmits(['closePost']);

const closePost = () => {
  emit('closePost');
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

    <a
      v-else-if="props.phoneNumber"
      :href="`tel:${phoneNumber}`"
      :class="[$style.button, $style.numberButton]"
    >{{ phoneNumber }}</a>
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
