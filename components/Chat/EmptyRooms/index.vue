<script setup lang="ts">
import IconEmptyList from '~/assets/images/icon-empty-list.svg?component';


const { t } = useI18n();
</script>

<i18n>
{
  "en": {
    "no_messages": "No messages",
    "negotiate_buy_sell": "Negotiate buying or selling products through messages"
  },
  "pt": {
    "no_messages": "Sem mensagens",
    "negotiate_buy_sell": "Negociar a compra ou venda de produtos por meio de mensagens"
  }
}
</i18n>

<template>
  <div :class="$style.empty">
    <div :class="$style.content">
      <IconEmptyList :class="$style.icon" />

      <span
        :class="$style.title"
        v-text="t('no_messages')"
      />

      <span
        :class="$style.text"
        v-text="t('negotiate_buy_sell')"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  @include md {
    padding: 20px 0;
  }

  @include exclude-md {
    @include ui-round-content-blocks;

    padding: 30px 20px;
    background-color: $ui-color-white;
  }
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.icon {
  width: 100%;
}

.title {
  @include ui-typo-15-bold;

  margin-top: 24px;
  color: $ui-color-black;
}

.text {
  @include ui-typo-12;

  margin-top: 8px;
  color: $ui-color-text-main;
}
</style>
