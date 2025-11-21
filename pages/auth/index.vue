<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import IconFb from 'assets/images/auth/socials/icon-fb.svg?component';
import IconGoogle from 'assets/images/auth/socials/icon-google.svg?component';
import { useUser } from '~/composables/useUser';
import {
  CLICK_CREATE_ACCOUNT,
  CLICK_EMAIL_LOGIN,
  CLICK_SOCIAL_LOGIN,
} from '~/constants/analytics-events';


definePageMeta({
  middleware: defineNuxtRouteMiddleware(() => {
    const { isLoggedIn } = useUser();

    if (isLoggedIn.value) {
      return navigateTo('/');
    }
  }),
});

const { isLoggedIn, isAuthChecking } = useUser();


const route = useRoute();

watch(
  isLoggedIn,
  (state) => {
    if (state) {
      const redirectTo = (route.query.redirect as string) || '/';

      navigateTo(redirectTo, { replace: true });
    }
  },
  { immediate: true },
);


const { t } = useI18n();

const {
  errors,
  handleSubmit,
} = useForm({
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema: object({
    email: string()
      .email(t('validation.email'))
      .required(t('validation.required')),
    password: string()
      .required(t('validation.required')),
  }),
});

const { value: email } = useField<string>('email');
const { value: password } = useField<string>('password');


const { pushEvent } = useAnalyticsEvent();
const { signInWithProvider, signIn } = useAuth();

const isLoading = ref(false);

const backendError = ref('');

const clearError = () => {
  backendError.value = '';
};

const authByEmail = handleSubmit.withControlled(async () => {
  if (isLoading.value) {
    return;
  }

  clearError();
  pushEvent(CLICK_EMAIL_LOGIN);

  isLoading.value = true;

  try {
    const { error } = await signIn(email.value, password.value);

    if (error) {
      backendError.value = error.message || 'Login error';
      isLoading.value = false;
    }
  } catch (error: any) {
    isLoading.value = false;
  }
});

const authByFb = async () => {
  clearError();

  try {
    pushEvent(CLICK_SOCIAL_LOGIN, { platform: 'facebook' });
    await signInWithProvider('facebook');
  } catch (error: any) {
    backendError.value = error?.message;
  }
};

const authByGoogle = async () => {
  clearError();

  try {
    pushEvent(CLICK_SOCIAL_LOGIN, { platform: 'google' });
    await signInWithProvider('google');
  } catch (error: any) {
    backendError.value = error?.message;
  }
};


const goToForgotPassword = () => {
  navigateTo({
    name: 'auth-forgot-password',
    query: { redirect: route.query.redirect as string },
  });
};

const createAccount = () => {
  clearError();

  pushEvent(CLICK_CREATE_ACCOUNT);

  navigateTo({
    name: 'auth-register',
    query: { redirect: route.query.redirect as string },
  });
};
</script>

<i18n lang="json">
{
  "en": {
    "title": "Log in",
    "subtitle": "Log in to continue and manage your ads.",
    "email": "E-mail",
    "password": "Password",
    "login": "Log in",
    "forgot_password": "Forgot your password?",
    "social_block_title": "Or continue with",
    "no_account": "Don't have an account?",
    "create_one": "Create one now"
  },
  "pt": {
    "title": "Entrar",
    "subtitle": "Entre para continuar e gerenciar seus anúncios.",
    "email": "E-mail",
    "password": "Senha",
    "login": "Entrar",
    "forgot_password": "Esqueceu sua senha?",
    "social_block_title": "Ou continuar com",
    "no_account": "Ainda não tem uma conta?",
    "create_one": "Crie uma agora"
  }
}
</i18n>

<template>
  <UILoader v-if="isAuthChecking" />

  <div
    v-else
    :class="$style.root"
  >
    <div :class="$style.card">
      <h2
        :class="$style.title"
        v-text="t('title')"
      />

      <p
        :class="$style.description"
        v-text="t('subtitle')"
      />

      <form
        :class="$style.form"
        @submit.prevent="authByEmail"
      >
        <div :class="$style.inputWrapper">
          <UIInput
            v-model="email"
            :label="t('email')"
            :error="errors.email"
            isRequired
            name="email"
            type="email"
          />

          <UIError :text="errors.email" />
        </div>

        <div :class="$style.inputWrapper">
          <UIInput
            v-model="password"
            :label="t('password')"
            :error="errors.password"
            isRequired
            name="password"
            type="password"
          />

          <UIError :text="errors.password" />
        </div>

        <UIError :text="backendError" />

        <div :class="$style.row">
          <button
            type="button"
            :class="$style.forgot"
            @click="goToForgotPassword"
            v-text="t('forgot_password')"
          />
        </div>


        <UIButton
          :text="t('login')"
          :class="$style.submitButton"
          :isLoading="isLoading"
          @click="authByEmail"
        />
      </form>

      <div :class="$style.panel">
        <p :class="$style.panelTitle">
          {{ t('social_block_title') }}
        </p>

        <div :class="$style.socials">
          <button
            type="button"
            :class="$style.socialButton"
            @click="authByFb"
          >
            <IconFb :class="$style.socialIcon" />
          </button>

          <button
            type="button"
            :class="$style.socialButton"
            @click="authByGoogle"
          >
            <IconGoogle :class="$style.socialIcon" />
          </button>
        </div>
      </div>

      <div :class="$style.registerRow">
        <span v-text="t('no_account')" />

        <button
          type="button"
          :class="$style.registerLink"
          @click="createAccount"
          v-text="t('create_one')"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  width: 100%;
  max-width: 480px;
  padding: 20px;

  @include exclude-md {
    margin-top: 80px;
    margin-bottom: 60px;
  }
}

.card {
  @include exclude-md {
    @include ui-round-content-blocks;

    background-color: $ui-color-white;
    padding: 24px 24px 20px;
    box-shadow: $box-shadow;
  }
}

.title {
  @include ui-typo-24-medium;
}

.description {
  @include ui-typo-14;

  margin-top: 8px;
  margin-bottom: 20px;
  color: $ui-color-text-main;
}

.form {
  display: flex;
  flex-direction: column;
}

.inputWrapper {

  & + & {
    margin-top: 16px;
  }
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}

.forgot {
  @include ui-button-link-view;
  text-decoration: underline;
}

.submitButton {
  margin-top: 16px;
  padding: 12px;
}

.panel {
  margin-top: 20px;

  @include exclude-md {
    padding: 16px 16px 14px;
    border-radius: 16px;
    background-color: #FAFAFA;
  }
}

.panelTitle {
  margin-bottom: 12px;
}

.socials {
  display: flex;
  gap: 8px;
}

.socialButton {
  @include ui-button-secondary;

  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.socialIcon {
  width: 24px;
  height: 24px;
}

.registerRow {
  @include ui-typo-14;

  margin-top: 20px;
  display: flex;
  gap: 6px;
}

.registerLink {
  @include ui-button-link-view;
  @include ui-typo-14;
  padding: 0;
  text-decoration: underline;
}
</style>
