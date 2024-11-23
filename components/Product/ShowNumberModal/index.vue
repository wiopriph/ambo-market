<script setup lang="ts">
import type { ShowNumberModalProps } from './types';
import IconCheckSquare from '~/assets/images/product/icon-check-square.svg?component';
import IconMan from '~/assets/images/product/icon-man.svg?component';
import IconBankCard from '~/assets/images/product/icon-bank-card.svg?component';


const props = withDefaults(defineProps<ShowNumberModalProps>(), {
  isLoading: false,
});

const { t } = useI18n();


const emit = defineEmits(['showNumber', 'close']);

const showNumber = () => {
  emit('showNumber');
};

const close = () => {
  emit('close');
};
</script>

<i18n>
{
  "en": {
    "tips": "Tips for a safer transaction:",
    "tips_list": {
      "check_condition": "Check the condition of the item",
      "meet_in_person": "Meet the seller in person",
      "dont_pay_online": "Don’t wire money online"
    }
  },
  "pt": {
    "tips": "Dicas para uma transação mais segura:",
    "tips_list": {
      "check_condition": "Verifique o estado do item",
      "meet_in_person": "Encontre o vendedor pessoalmente",
      "dont_pay_online": "Não faça transferências de dinheiro online"
    }
  }
}
</i18n>

<template>
  <UIModal
    maxWidth="500px"
    @close="close"
  >
    <div :class="$style.root">
      <UserInfo
        :user="props.user"
        :class="$style.profile"
      />

      <div :class="$style.controls">
        <a
          v-if="user.phone"
          :href="`tel:${user.phone}`"
          :class="[$style.button, $style.linkButton]"
        >{{ user.phone }}</a>

        <UIButton
          v-else
          :isLoading="isLoading"
          :text="t('show_number')"
          :class="$style.button"
          @click="showNumber"
        />
      </div>

      <div :class="$style.tips">
        <p v-text="t('tips')" />

        <ul :class="$style.tipsList">
          <li :class="$style.tipsItem">
            <IconCheckSquare :class="$style.tipsIcon" />

            <p v-text="t('tips_list.check_condition')" />
          </li>

          <li :class="$style.tipsItem">
            <IconMan :class="$style.tipsIcon" />

            <p v-text="t('tips_list.meet_in_person')" />
          </li>

          <li :class="$style.tipsItem">
            <IconBankCard :class="$style.tipsIcon" />

            <p v-text="t('tips_list.dont_pay_online')" />
          </li>
        </ul>
      </div>
    </div>
  </UIModal>
</template>

<style lang="scss" module>
.root {
  position: relative;
  height: calc(100% - 44px);
  padding: 20px;
}

.controls {
  margin-top: 20px;
}

.button {
  width: 100%;
}

.linkButton {
  @include ui-button-primary;
}

.tips {
  @include ui-round-content-blocks;
  margin-top: 20px;
  padding: 20px;
  color: $ui-color-blue;
  background-color: rgba($ui-color-blue-light, .15);
}

.tipsList {
  margin-top: 15px;
}

.tipsItem {
  display: flex;
  align-items: center;

  & + & {
    margin-top: 10px;
  }
}

.tipsIcon {
  width: 16px;
  height: 16px;
  margin-right: 10px;
}
</style>
