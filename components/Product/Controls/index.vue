<script setup lang="ts">
import type { ControlsProps } from './types';


const props = defineProps<ControlsProps>();


const { t } = useI18n();

const emit = defineEmits([
  'closePost',
  'showNumber',
  'createChatRoom',
  'createOrder',
]);

const closePost = () => {
  emit('closePost');
};

const showNumber = () => {
  emit('showNumber');
};

const createChatRoom = () => {
  emit('createChatRoom');
};

const createOrder = () => {
  emit('createOrder');
};
</script>

<i18n>
{
  "en": {
    "contact_seller": "Contact seller",
    "buy": "Buy",
    "close_post": "Close Ad"
  },
  "pt": {
    "contact_seller": "Contatar vendedor",
    "buy": "Comprar",
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

      <UIButton
        v-if="false"
        :isLoading="isChatLoading"
        :text="t('contact_seller')"
        :class="$style.button"
        type="secondary"
        @click="createChatRoom"
      />

      <UIButton
        v-if="false"
        :text="t('buy')"
        :class="$style.button"
        type="tertiary"
        @click="createOrder"
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
