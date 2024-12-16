<script setup lang="ts">
import IconFb from '~/assets/images/auth/socials/icon-fb.svg?component';
import IconGoogle from '~/assets/images/auth/socials/icon-google.svg?component';
import IconEmail from '~/assets/images/auth/socials/icon-email.svg?component';
import { AUTH_STATES } from '~/constants/auth-states';
import type { AuthModalStateValue } from '~/constants/auth-states';
import { useUser } from '~/composables/useUser';


const route = useRoute();

definePageMeta({
  middleware: defineNuxtRouteMiddleware(() => {
    const { isLoggedIn } = useUser();

    if (isLoggedIn.value) {
      return navigateTo('/');
    }
  }),
});

const { isLoggedIn } = useUser();

watch(isLoggedIn, (state) => {
  if (state) {
    const redirectTo = route.query.redirect as string || '/';

    navigateTo(redirectTo, { replace: true });
  }
});


const { t } = useI18n();
const isAuthModalVisible = ref(false);
const backendErrors = ref([]);

const showAuthModal = () => {
  isAuthModalVisible.value = true;
};

const hideAuthModal = () => {
  isAuthModalVisible.value = false;
};


const clearError = () => {
  backendErrors.value = [];
};

const { $fire } = useNuxtApp();

const authByFb = async () => {
  clearError();

  try {
    await $fire.auth.signInWithFacebook();
  } catch (error) {
    backendErrors.value = [error?.message];
  }
};

const authByGoogle = async () => {
  clearError();

  try {
    await $fire.auth.signInWithGoogle();
  } catch (error) {
    backendErrors.value = [error?.message];
  }
};


const currentState = ref<AuthModalStateValue>(AUTH_STATES.WELCOME);

const authByEmail = () => {
  clearError();

  currentState.value = AUTH_STATES.LOGIN;

  showAuthModal();
};

const createAccount = () => {
  clearError();

  currentState.value = AUTH_STATES.REGISTRATION;

  showAuthModal();
};
</script>

<i18n>
{
  "en": {
    "welcome": "Welcome",
    "sign_in": "Sign in to continue",
    "continue_with_facebook": "Continue with Facebook",
    "continue_with_google": "Continue with Google",
    "continue_with_email": "Continue with E-mail",
    "no_account_create_one": "Don't have an account? Create one"
  },
  "pt": {
    "welcome": "Bem-vindo",
    "sign_in": "Faça login para continuar",
    "continue_with_facebook": "Continuar com o Facebook",
    "continue_with_google": "Continuar com o Google",
    "continue_with_email": "Continuar com E-mail",
    "no_account_create_one": "Não possui uma conta? Crie uma"
  }
}
</i18n>

<template>
  <div :class="$style.root">
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

      <UIErrors :errors="backendErrors" />

      <button
        :class="$style.registration"
        type="button"
        @click="createAccount"
        v-text="t('no_account_create_one')"
      />
    </div>

    <transition name="fade">
      <LazyAuthModal
        v-if="isAuthModalVisible"
        :state="currentState"
        @close="hideAuthModal"
      />
    </transition>
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
  @include ui-typo-14;

  margin-top: 10px;
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
    margin-top: 10px;
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
