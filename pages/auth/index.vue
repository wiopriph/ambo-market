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
    "meta_title": "Log in to Ambo Market",
    "meta_description": "Access your Ambo Market account to manage ads, messages, and saved listings.",
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
    "meta_title": "Entrar no Ambo Market",
    "meta_description": "Acesse sua conta Ambo Market para gerir anúncios, mensagens e favoritos.",
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
    class="mx-auto flex w-full max-w-md px-0 py-4 sm:py-12"
  >
    <UCard
      :title="t('title')"
      :description="t('subtitle')"
      class="w-full"
    >
      <form
        class="space-y-4"
        @submit.prevent="authByEmail"
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
            autocomplete="current-password"
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

        <div class="flex justify-end">
          <UButton
            type="button"
            color="primary"
            variant="link"
            class="px-0"
            @click="goToForgotPassword"
          >
            {{ t('forgot_password') }}
          </UButton>
        </div>


        <UButton
          type="submit"
          :label="t('login')"
          :loading="isLoading"
          size="lg"
          block
        />
      </form>

      <template #footer>
        <div class="space-y-5">
          <USeparator :label="t('social_block_title')" />

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <UButton
              type="button"
              color="neutral"
              variant="outline"
              size="lg"
              block
              @click="authByFb"
            >
              <template #leading>
                <IconFb class="size-5" />
              </template>

              Facebook
            </UButton>

            <UButton
              type="button"
              color="neutral"
              variant="outline"
              size="lg"
              block
              @click="authByGoogle"
            >
              <template #leading>
                <IconGoogle class="size-5" />
              </template>

              Google
            </UButton>
          </div>

          <div class="flex flex-col items-center gap-2 text-center text-sm sm:flex-row sm:justify-center">
            <span class="text-muted">{{ t('no_account') }}</span>

            <UButton
              type="button"
              color="primary"
              variant="link"
              size="sm"
              class="justify-center px-0"
              @click="createAccount"
            >
              {{ t('create_one') }}
            </UButton>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>
