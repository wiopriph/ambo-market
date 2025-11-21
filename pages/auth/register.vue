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
const { signUp } = useAuth();
const { isLoggedIn, isAuthChecking } = useUser();

const backendError = ref('');
const isLoading = ref(false);

watch(isLoggedIn, (state) => {
  if (state) {
    const redirectTo = (route.query.redirect as string) || '/';

    navigateTo(redirectTo, { replace: true });
  }
});

const {
  errors,
  handleSubmit,
} = useForm({
  initialValues: {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  },
  validationSchema: object({
    email: string()
      .email(t('validation.email'))
      .required(t('validation.required')),
    password: string()
      .required(t('validation.passwordRequired'))
      .min(6, t('validation.passwordMinLength'))
      .max(20, t('validation.passwordMaxLength')),
    confirmPassword: string()
      .required(t('validation.required'))
      .when('password', {
        is: () => !arePasswordsEqual.value,
        then: schema => schema
          .test('password-match', t('validation.matchPassword'), value => value === password.value),
      }),
  }),
});

const arePasswordsEqual = computed(() => !!password.value && (password.value === confirmPassword.value));


const { value: email } = useField<string>('email');
const { value: password } = useField<string>('password');
const { value: confirmPassword } = useField<string>('confirmPassword');

const register = handleSubmit.withControlled(async () => {
  if (isLoading.value) {
    return;
  }

  backendError.value = '';
  isLoading.value = true;

  try {
    const { error } = await signUp(email.value, password.value);

    if (error) {
      backendError.value = error.message || 'Registration error';
      isLoading.value = false;
    }
  } catch (error: any) {
    isLoading.value = false;
  }
});
</script>

<i18n lang="json">
{
  "en": {
    "title": "Create an account",
    "subtitle": "Sign up with your e-mail and start using the platform.",
    "email": "E-mail",
    "password": "Password",
    "confirm_password": "Confirm password",
    "register": "Create an account",
    "login_text": "Already have an account?",
    "login_link": "Log in",
    "terms_privacy_agreement": "By creating an account, you agree to our {terms} and {policy}.",
    "terms_of_service": "Terms of Service",
    "privacy_policy": "Privacy Policy"
  },
  "pt": {
    "title": "Criar uma conta",
    "subtitle": "Cadastre-se com seu e-mail e comece a usar a plataforma.",
    "email": "E-mail",
    "password": "Senha",
    "confirm_password": "Confirmar senha",
    "register": "Criar conta",
    "login_text": "Já tem uma conta?",
    "login_link": "Entrar",
    "terms_privacy_agreement": "Ao criar uma conta, você concorda com nossos {terms} e {policy}.",
    "terms_of_service": "Termos de Serviço",
    "privacy_policy": "Política de Privacidade"
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
        @submit.prevent="register"
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

        <div :class="$style.inputWrapper">
          <UIInput
            v-model="confirmPassword"
            :label="t('confirm_password')"
            :error="errors.confirmPassword"
            isRequired
            name="confirmPassword"
            type="password"
          />

          <UIError :text="errors.confirmPassword" />
        </div>

        <UIError :text="backendError" />

        <UIButton
          :text="t('register')"
          :class="$style.submitButton"
          :isLoading="isLoading"
          @click="register"
        />
      </form>

      <div :class="$style.bottom">
        <span>{{ t('login_text') }}</span>

        <NuxtLink
          :to="{ name: 'auth', query: { redirect: route.query.redirect as string } }"
          :class="$style.loginLink"
        >
          {{ t('login_link') }}
        </NuxtLink>
      </div>
    </div>

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

.inputWrapper {

  & + & {
    margin-top: 16px;
  }
}

.submitButton {
  margin-top: 20px;
}

.bottom {
  margin-top: 20px;
  display: flex;
  gap: 6px;
  font-size: 14px;
}

.loginLink {
  @include ui-button-link-view;
  @include ui-typo-14;
  padding: 0;
  text-decoration: underline;
}

.footer {
  @include ui-typo-12;
  margin-top: 20px;
  color: $ui-color-black;
  text-align: center;

  a {
    text-decoration: none;
  }
}

.footerText {
  margin-top: 10px;
  margin-bottom: 10px;
  color: $ui-color-text-main;
}
</style>
