<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import { useUser } from '~/composables/useUser';


definePageMeta({
  middleware: defineNuxtRouteMiddleware(() => {
    const { isLoggedIn } = useUser();

    if (isLoggedIn.value) {
      return navigateTo('/');
    }
  }),
});

const { t } = useI18n();
const route = useRoute();
const { resetPassword } = useAuth();
const { isAuthChecking } = useUser();

const {
  errors,
  handleSubmit,
} = useForm({
  initialValues: {
    email: '',
  },
  validationSchema: object({
    email: string()
      .email(t('validation.email'))
      .required(t('validation.required')),
  }),
});

const { value: email } = useField<string>('email');

const isLoading = ref(false);
const backendError = ref('');
const successMessage = ref('');

const resetPasswordForEmail = handleSubmit.withControlled(async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  backendError.value = '';
  successMessage.value = '';

  const { error } = await resetPassword(email.value);

  isLoading.value = false;

  if (error) {
    backendError.value = error.message || 'Error';

    return;
  }

  successMessage.value = t('success_message');
});

const goToLogin = () => {
  navigateTo({
    name: 'auth',
    query: { redirect: route.query.redirect as string },
  });
};
</script>

<i18n lang="json">
{
  "en": {
    "title": "Password recovery",
    "subtitle": "We will send a link to reset your password to your e-mail.",
    "email": "E-mail",
    "reset_password": "Reset password",
    "back_to_login": "Back to login",
    "success_message": "If this e-mail is registered, we have sent a link to reset your password."
  },
  "pt": {
    "title": "Recuperação de senha",
    "subtitle": "Enviaremos um link para redefinir sua senha para o seu e-mail.",
    "email": "E-mail",
    "reset_password": "Redefinir senha",
    "back_to_login": "Voltar para login",
    "success_message": "Se este e-mail estiver cadastrado, enviamos um link para redefinir sua senha."
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
        :class="$style.subtitle"
        v-text="t('subtitle')"
      />

      <form
        :class="$style.form"
        @submit.prevent="resetPasswordForEmail"
      >
        <UIInput
          v-model="email"
          :label="t('email')"
          :error="errors.email"
          isRequired
          name="email"
          type="email"
        />

        <UIError :text="errors.email" />

        <UIError :text="backendError" />

        <p
          v-if="successMessage"
          :class="$style.success"
          v-text="successMessage"
        />

        <UIButton
          :text="t('reset_password')"
          :class="$style.submitButton"
          :isLoading="isLoading"
          @click="resetPasswordForEmail"
        />
      </form>

      <button
        type="button"
        :class="$style.backButton"
        @click="goToLogin"
      >
        {{ t('back_to_login') }}
      </button>
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

.subtitle {
  @include ui-typo-14;
  margin-top: 8px;
  margin-bottom: 20px;
  color: $ui-color-text-main;
}

.form {
  display: flex;
  flex-direction: column;
}

.submitButton {
  margin-top: 20px;
}

.success {
  @include ui-typo-12;
  margin-top: 10px;
  color: $ui-color-add;
}

.backButton {
  @include ui-button-link-view;
  @include ui-typo-14;
  margin-top: 12px;
  padding: 0;
  text-decoration: underline;
}
</style>
