<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import IconFb from 'assets/images/auth/socials/icon-fb.svg?component';
import IconGoogle from 'assets/images/auth/socials/icon-google.svg?component';
import { useUser } from '~/composables/useUser';
import { CLICK_CREATE_ACCOUNT, CLICK_EMAIL_LOGIN, CLICK_SOCIAL_LOGIN } from '~/constants/analytics-events';


definePageMeta({
  middleware: defineNuxtRouteMiddleware(() => {
    const { isLoggedIn } = useUser();

    if (isLoggedIn.value) {
      return navigateTo('/');
    }
  }),
});

const { isLoggedIn } = useUser();

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

const title = 'Entrar no Ambo Market';
const description = 'Acesse sua conta Ambo Market para gerir anúncios, mensagens e favoritos.';

useHead({
  title,
  meta: [
    { key: 'description', name: 'description', content: description },
    { key: 'og:title', property: 'og:title', content: title },
    { key: 'og:description', property: 'og:description', content: description },
    { key: 'twitter:title', property: 'twitter:title', content: title },
    { key: 'twitter:description', property: 'twitter:description', content: description },
    { key: 'robots', name: 'robots', content: 'noindex, nofollow' },
  ],
});

const {
  errors,
  handleSubmit,
} = useForm({
  initialValues: { email: '', password: '' },
  validationSchema: object({
    email: string()
      .email('Formato de email incorreto')
      .required('Este campo é obrigatório'),
    password: string()
      .required('Este campo é obrigatório'),
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
  } catch {
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

<template>
  <div class="mx-auto w-full max-w-md space-y-3">
    <div class="rounded-2xl border border-default bg-default px-5 py-4">
      <h1 class="text-lg font-bold text-highlighted">
        Entrar
      </h1>

      <p class="mt-0.5 text-sm text-muted">
        Entre para continuar e gerenciar seus anúncios.
      </p>
    </div>

    <div class="rounded-2xl border border-default bg-default divide-y divide-default overflow-hidden">
      <button
        type="button"
        class="flex w-full items-center gap-3 px-5 py-3.5 text-sm font-medium text-highlighted transition hover:bg-elevated"
        @click="authByGoogle"
      >
        <IconGoogle class="size-5 shrink-0" />
        Google
      </button>

      <button
        type="button"
        class="flex w-full items-center gap-3 px-5 py-3.5 text-sm font-medium text-highlighted transition hover:bg-elevated"
        @click="authByFb"
      >
        <IconFb class="size-5 shrink-0" />
        Facebook
      </button>
    </div>

    <USeparator label="Ou continuar com" />

    <form
      class="space-y-3"
      @submit.prevent="authByEmail"
    >
      <div class="rounded-2xl border border-default bg-default divide-y divide-default overflow-hidden">
        <div class="px-5 py-4">
          <UFormField
            label="E-mail"
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
        </div>

        <div class="px-5 py-4">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-sm font-medium text-highlighted">Senha</span>

            <UButton
              type="button"
              color="primary"
              variant="link"
              size="xs"
              class="px-0 h-auto"
              @click="goToForgotPassword"
            >
              Esqueceu sua senha?
            </UButton>
          </div>

          <UInput
            v-model="password"
            name="password"
            type="password"
            autocomplete="current-password"
            size="lg"
            class="w-full"
          />

          <p
            v-if="errors.password"
            class="mt-1 text-sm text-error"
            v-text="errors.password"
          />
        </div>
      </div>

      <UAlert
        v-if="backendError"
        color="error"
        variant="soft"
        icon="i-lucide-circle-alert"
        :description="backendError"
      />

      <UButton
        type="submit"
        label="Entrar"
        :loading="isLoading"
        size="lg"
        block
      />
    </form>

    <div class="flex items-center justify-center gap-2 text-sm">
      <span class="text-muted">Ainda não tem uma conta?</span>

      <UButton
        type="button"
        color="primary"
        variant="link"
        size="sm"
        class="px-0"
        @click="createAccount"
      >
        Crie uma agora
      </UButton>
    </div>
  </div>
</template>
