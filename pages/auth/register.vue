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

const title = computed(() => t('meta_title'));

const description = computed(() => t('meta_description'));

const meta = computed(() => [
  { key: 'og:title', property: 'og:title', content: title.value },
  { key: 'twitter:title', property: 'twitter:title', content: title.value },
  { key: 'description', name: 'description', content: description.value },
  { key: 'og:description', property: 'og:description', content: description.value },
  { key: 'twitter:description', property: 'twitter:description', content: description.value },
]);

useHead({ title: title.value, meta: meta.value });

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
    "meta_title": "Create an Ambo Market account",
    "meta_description": "Sign up for Ambo Market to post free classifieds, manage your ads, and connect with buyers in Angola.",
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
    "meta_title": "Criar conta no Ambo Market",
    "meta_description": "Crie uma conta no Ambo Market para publicar classificados grátis, gerir anúncios e falar com compradores em Angola.",
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
    class="mx-auto flex w-full max-w-md px-0 py-4 sm:py-12"
  >
    <UCard
      :title="t('title')"
      :description="t('subtitle')"
      class="w-full"
    >
      <form
        class="space-y-4"
        @submit.prevent="register"
      >
        <UFormField
          :label="t('email')"
          :error="errors.email"
          name="email"
          required
        >
          <UInput
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UFormField
          :label="t('password')"
          :error="errors.password"
          name="password"
          required
        >
          <UInput
            v-model="password"
            name="password"
            type="password"
            autocomplete="new-password"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UFormField
          :label="t('confirm_password')"
          :error="errors.confirmPassword"
          name="confirmPassword"
          required
        >
          <UInput
            v-model="confirmPassword"
            name="confirmPassword"
            type="password"
            autocomplete="new-password"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UAlert
          v-if="backendError"
          color="error"
          variant="soft"
          icon="i-lucide-circle-alert"
          :description="backendError"
        />

        <UButton
          type="submit"
          :label="t('register')"
          :loading="isLoading"
          size="lg"
          block
        />
      </form>

      <div class="mt-5 flex flex-col items-center gap-2 text-center text-sm sm:flex-row sm:justify-center">
        <span class="text-muted">{{ t('login_text') }}</span>

        <UButton
          :to="{ name: 'auth', query: { redirect: route.query.redirect as string } }"
          color="primary"
          variant="link"
          size="sm"
          class="justify-center px-0"
        >
          {{ t('login_link') }}
        </UButton>
      </div>

      <USeparator class="my-5" />

      <I18nT
        keypath="terms_privacy_agreement"
        tag="p"
        class="text-center text-xs leading-relaxed text-muted"
      >
        <template #terms>
          <ULink
            :to="{ name: 'terms' }"
            target="_blank"
            class="font-medium text-primary"
          >
            {{ t('terms_of_service') }}
          </ULink>
        </template>

        <template #policy>
          <ULink
            :to="{ name: 'privacy' }"
            target="_blank"
            class="font-medium text-primary"
          >
            {{ t('privacy_policy') }}
          </ULink>
        </template>
      </I18nT>
    </UCard>
  </div>
</template>
