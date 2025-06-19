<script setup lang="ts">
import IconFb from '~/assets/images/auth/socials/icon-fb.svg?component';
import IconGoogle from '~/assets/images/auth/socials/icon-google.svg?component';
import IconEmail from '~/assets/images/auth/socials/icon-email.svg?component';
import { AUTH_STATES } from '~/constants/auth-states';
import { CLICK_CREATE_ACCOUNT, CLICK_EMAIL_LOGIN, CLICK_SOCIAL_LOGIN } from '~/constants/analytics-events';


const { t } = useI18n();

const emit = defineEmits(['close', 'select']);

const { pushEvent } = useAnalyticsEvent();

const closeModal = () => {
  emit('close');
};

const authByEmail = () => {
  pushEvent(CLICK_EMAIL_LOGIN);

  emit('select', AUTH_STATES.LOGIN);
};

const createAccount = () => {
  pushEvent(CLICK_CREATE_ACCOUNT);

  emit('select', AUTH_STATES.REGISTRATION);
};


const backendError = ref('');

const clearError = () => {
  backendError.value = '';
};


const { $fire } = useNuxtApp();

const authByFb = async () => {
  clearError();

  try {
    pushEvent(CLICK_SOCIAL_LOGIN, { platform: 'facebook' });

    await $fire.auth.signInWithFacebook();

    closeModal();
  } catch (error) {
    backendError.value = error?.message;
  }
};

const authByGoogle = async () => {
  clearError();

  try {
    pushEvent(CLICK_SOCIAL_LOGIN, { platform: 'google' });

    await $fire.auth.signInWithGoogle();

    closeModal();
  } catch (error) {
    backendError.value = error?.message;
  }
};
</script>

<i18n>
{
  "en": {
    "welcome": "Hello!",
    "sign_in": "Log in or create an account to continue.",
    "continue_with_facebook": "Continue with Facebook",
    "continue_with_google": "Continue with Google",
    "continue_with_email": "Continue with E-mail",
    "no_account_create_one": "Don't have an account? Create one"
  },
  "pt": {
    "welcome": "Olá!",
    "sign_in": "Faça login ou crie uma conta para continuar.",
    "continue_with_facebook": "Continuar com o Facebook",
    "continue_with_google": "Continuar com o Google",
    "continue_with_email": "Continuar com E-mail",
    "no_account_create_one": "Não possui uma conta? Crie uma"
  }
}
</i18n>

<template>
  <AuthWrapper @close="closeModal">
    <h2
      :class="$style.title"
      v-text="t('welcome')"
    />

    <p
      :class="$style.description"
      v-text="t('sign_in')"
    />

    <div :class="$style.list">
      <button
        :class="$style.button"
        type="button"
        @click="authByFb"
      >
        <IconFb :class="$style.icon" />

        <span v-text="t('continue_with_facebook')" />
      </button>

      <button
        :class="$style.button"
        type="button"
        @click="authByGoogle"
      >
        <IconGoogle :class="$style.icon" />

        <span v-text="t('continue_with_google')" />
      </button>

      <button
        :class="$style.button"
        type="button"
        @click="authByEmail"
      >
        <IconEmail :class="$style.icon" />

        <span v-text="t('continue_with_email')" />
      </button>

      <UIError :text="backendError" />

      <button
        :class="$style.registration"
        type="button"
        @click="createAccount"
        v-text="t('no_account_create_one')"
      />
    </div>
  </AuthWrapper>
</template>

<style lang="scss" module>
.title {
  @include ui-typo-36-medium;
}

.description {
  @include ui-typo-18;

  margin-top: 20px;
  color: $ui-color-text-main;
}

.list {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 30px;
}

.button {
  @include ui-button-secondary;

  height: 60px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  & + & {
    margin-top: 12px;
  }
}

.registration {
  @include ui-button;

  margin-top: 10px;
  padding: 20px;
  color: $ui-color-blue;
}

.icon {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
</style>
