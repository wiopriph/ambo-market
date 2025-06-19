<script setup lang="ts">
import IconFb from '~/assets/images/auth/socials/icon-fb.svg?component';
import IconGoogle from '~/assets/images/auth/socials/icon-google.svg?component';
import IconEmail from '~/assets/images/auth/socials/icon-email.svg?component';
import { useUser } from '~/composables/useUser';
import { AUTH_STATES } from '~/constants/auth-states';
import type { AuthModalStateValue } from '~/constants/auth-states';
import { CLICK_CREATE_ACCOUNT, CLICK_EMAIL_LOGIN, CLICK_SOCIAL_LOGIN } from '~/constants/analytics-events';


definePageMeta({
  middleware: defineNuxtRouteMiddleware(() => {
    const { isLoggedIn } = useUser();

    if (isLoggedIn.value) {
      return navigateTo('/');
    }
  }),
});


const {
  isLoggedIn,
  isAuthChecking,
} = useUser();

const route = useRoute();

watch(isLoggedIn, (state) => {
  if (state) {
    const redirectTo = route.query.redirect as string || '/';

    navigateTo(redirectTo, { replace: true });
  }
});


const { pushEvent } = useAnalyticsEvent();

const isAuthModalVisible = ref(false);

const showAuthModal = () => {
  isAuthModalVisible.value = true;
};

const hideAuthModal = () => {
  isAuthModalVisible.value = false;
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
  } catch (error) {
    backendError.value = error?.message;
  }
};

const authByGoogle = async () => {
  clearError();

  try {
    pushEvent(CLICK_SOCIAL_LOGIN, { platform: 'google' });

    await $fire.auth.signInWithGoogle();
  } catch (error) {
    backendError.value = error?.message;
  }
};


const currentState = ref<AuthModalStateValue>(AUTH_STATES.WELCOME);

const authByEmail = () => {
  clearError();

  pushEvent(CLICK_EMAIL_LOGIN);

  currentState.value = AUTH_STATES.LOGIN;

  showAuthModal();
};

const createAccount = () => {
  clearError();

  pushEvent(CLICK_CREATE_ACCOUNT);

  currentState.value = AUTH_STATES.REGISTRATION;

  showAuthModal();
};

const { t } = useI18n();


const authPromptMessage = computed(() => {
  const action = route.query.action as string;

  switch (action) {
    case 'favorites':
      return t('sign_in_to_add_favorites');
    case 'chat':
      return t('sign_for_chat');
    case 'call':
      return t('sign_for_call');
    case 'order':
      return t('sign_for_order');
    default:
      return t('sign_in');
  }
});
</script>

<i18n lang="json">
{
  "en": {
    "welcome": "Hello!",
    "sign_in": "Log in or create an account to continue.",
    "sign_in_to_add_favorites": "Log in to save this item and keep track of your favorites.",
    "sign_for_chat": "Log in to ask questions and chat with the seller.",
    "sign_for_call": "Log in to see the seller’s phone number.",
    "sign_for_order": "Log in to complete your order safely.",
    "continue_with_facebook": "Log in with Facebook",
    "continue_with_google": "Log in with Google",
    "continue_with_email": "Log in with E-mail",
    "no_account_create_one": "Don’t have an account? Create one now"
  },
  "pt": {
    "welcome": "Olá!",
    "sign_in": "Faça login ou crie uma conta para continuar.",
    "sign_in_to_add_favorites": "Faça login para salvar este item e acompanhar seus favoritos.",
    "sign_for_chat": "Faça login para tirar dúvidas e conversar com o vendedor.",
    "sign_for_call": "Faça login para ver o número de telefone do vendedor.",
    "sign_for_order": "Faça login para concluir seu pedido com segurança.",
    "continue_with_facebook": "Entrar com Facebook",
    "continue_with_google": "Entrar com Google",
    "continue_with_email": "Entrar com E-mail",
    "no_account_create_one": "Ainda não tem uma conta? Crie uma agora"
  }
}
</i18n>

<template>
  <UILoader v-if="isAuthChecking" />

  <div
    v-else
    :class="$style.root"
  >
    <h2
      :class="$style.title"
      v-text="t('welcome')"
    />

    <p
      :class="$style.description"
      v-text="authPromptMessage"
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

    <LazyAuthModal
      v-if="isAuthModalVisible"
      :state="currentState"
      @close="hideAuthModal"
    />
  </div>
</template>

<style lang="scss" module>
.root {
  width: 100%;
  max-width: 440px;
  padding: 20px;

  @include md {
    margin-top: 60px;
  }

  @include exclude-md {
    margin-top: 100px;
    margin-bottom: 60px;
  }
}

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

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  height: 60px;

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
