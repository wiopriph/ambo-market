<script setup lang="ts">
import type { CreateModalProps } from './types';
import IconSuccess from '~/assets/images/auth/icon-success.svg?component';


const props = defineProps<CreateModalProps>();

const { t } = useI18n();

const emit = defineEmits(['close']);

const closeModal = () => emit('close');
</script>

<i18n>
{
  "en": {
    "successfully_created": "{title} has been successfully created.",
    "ok": "OK",
    "close": "close"
  },
  "pt": {
    "successfully_created": "{title} foi criado com sucesso.",
    "ok": "OK"
  }
}
</i18n>

<template>
  <UIModal
    maxWidth="500px"
    @close="closeModal"
  >
    <div :class="$style.root">
      <IconSuccess />

      <I18nT
        :class="$style.title"
        keypath="successfully_created"
        tag="p"
      >
        <template #title>
          <NuxtLink :to="props.route">
            {{ title }}
          </NuxtLink>
        </template>
      </I18nT>

      <UIButton
        :text="t('ok')"
        :class="$style.button"
        @click="closeModal"
      />
    </div>
  </UIModal>
</template>

<style lang="scss" module>
.root {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.title {
  margin-top: 30px;
  margin-bottom: 20px;
  text-align: center;
}

.button {
  width: 100%;
}
</style>
