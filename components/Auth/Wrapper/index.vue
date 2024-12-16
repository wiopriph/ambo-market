<script setup lang="ts">
import IconBack from '~/assets/images/auth/icon-back.svg?component';
import IconClose from '~/assets/images/auth/icon-close.svg?component';
import type { AuthWrapperProps } from '~/components/Auth/Wrapper/types';


const props = withDefaults(defineProps<AuthWrapperProps>(), {
  hasBackButton: false,
});

const { t } = useI18n();


const emit = defineEmits(['close', 'back']);

const closeModal = () => {
  emit('close');
};

const goBack = () => {
  emit('back');
};
</script>

<i18n>
{
  "en": {
    "terms_privacy_agreement": "By creating an account, you agree to our {terms} and {policy}",
    "terms_of_service": "Terms of Service",
    "privacy_policy": "Privacy Policy"
  },
  "pt": {
    "terms_privacy_agreement": "Ao criar uma conta, você concorda com nossos {terms} e {policy}",
    "terms_of_service": "Termos de Serviço",
    "privacy_policy": "Política de Privacidade"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <div :class="$style.header">
      <div>
        <button
          v-if="props.hasBackButton"
          :class="[$style.button, $style.backButton]"
          type="button"
          @click="goBack"
        >
          <IconBack :class="$style.icon" />
        </button>
      </div>

      <button
        :class="$style.button"
        type="button"
        @click="closeModal"
      >
        <IconClose :class="$style.icon" />
      </button>
    </div>

    <slot />

    <div :class="$style.footer">
      <I18nT
        :class="$style.footerText"
        keypath="terms_privacy_agreement"
        tag="p"
      >
        <template #terms>
          <NuxtLink
            :to="{ name: 'terms' }"
            target="_blank"
          >
            {{ t('terms_of_service') }}
          </NuxtLink>
        </template>

        <template #policy>
          <NuxtLink
            :to="{ name: 'privacy' }"
            target="_blank"
          >
            {{ t('privacy_policy') }}
          </NuxtLink>
        </template>
      </I18nT>
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px 20px 30px 20px;
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
}

.button {
  @include ui-button;

  max-width: 32px;
  height: 32px;
  padding: 0;
  background-color: $ui-color-white;
}

.backButton {
  color: $ui-color-transparent;
}

.icon {
  width: 100%;
  height: 100%;
}

.footer {
  @include ui-typo-12;
  margin-top: auto;
  color: $ui-color-black;
  text-align: center;

  a {
    text-decoration: none;
  }
}

.footerText {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
