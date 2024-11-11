<script setup lang="ts">
import type { BackButtonProps } from './types';
import IconBack from '~/assets/images/auth/icon-back.svg?component';


const props = defineProps<BackButtonProps>();

const { t } = useI18n();
</script>

<i18n>
{
  "en": {
    "messages": "Messages"
  },
  "pt": {
    "messages": "Mensagens"
  }
}
</i18n>

<template>
  <NuxtLink
    :to="props.to"
    :class="$style.link"
  >
    <IconBack :class="$style.icon" />

    <span
      :class="$style.text"
      v-text="t('back')"
    />
  </NuxtLink>
</template>

<style lang="scss" module>
.link {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 24px;
  text-decoration: none;
}

.icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.text {
  @include ui-typo-15;
  color: $ui-color-black;
}
</style>
