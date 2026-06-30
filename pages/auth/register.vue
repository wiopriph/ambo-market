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

const title = 'Criar conta no Ambo Market';
const description = 'Crie uma conta no Ambo Market para publicar classificados grátis, gerir anúncios e falar com compradores em Angola.';

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

const route = useRoute();
const { signUp } = useAuth();
const { isLoggedIn } = useUser();

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
  initialValues: { email: '', username: '', password: '', confirmPassword: '' },
  validationSchema: object({
    email: string()
      .email('Formato de email incorreto')
      .required('Este campo é obrigatório'),
    password: string()
      .required('A senha não pode estar vazia')
      .min(6, 'A senha é muito curta')
      .max(20, 'A senha é muito longa'),
    confirmPassword: string()
      .required('Este campo é obrigatório')
      .when('password', {
        is: () => !arePasswordsEqual.value,
        then: schema => schema
          .test('password-match', 'As senhas não coincidem', value => value === password.value),
      }),
  }),
});

const arePasswordsEqual = computed(() => !!password.value && (password.value === confirmPassword.value));

const { value: email } = useField<string>('email');
const { value: password } = useField<string>('password');
const { value: confirmPassword } = useField<string>('confirmPassword');

const register = handleSubmit.withControlled(async () => {
  if (isLoading.value) return;

  backendError.value = '';
  isLoading.value = true;

  try {
    const { error } = await signUp(email.value, password.value);

    if (error) {
      backendError.value = error.message || 'Registration error';
      isLoading.value = false;
    }
  } catch {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="mx-auto w-full max-w-md space-y-3">
    <div class="rounded-2xl border border-default bg-default px-5 py-4">
      <h1 class="text-lg font-bold text-highlighted">
        Criar uma conta
      </h1>

      <p class="mt-0.5 text-sm text-muted">
        Cadastre-se com seu e-mail e comece a usar a plataforma.
      </p>
    </div>

    <form
      class="space-y-3"
      @submit.prevent="register"
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
          <UFormField
            label="Senha"
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
        </div>

        <div class="px-5 py-4">
          <UFormField
            label="Confirmar senha"
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
        label="Criar conta"
        :loading="isLoading"
        size="lg"
        block
      />
    </form>

    <p class="text-center text-xs leading-relaxed text-muted">
      Ao criar uma conta, você concorda com nossos
      <ULink
        :to="{ name: 'terms' }"
        target="_blank"
        class="font-medium text-primary"
      >
        Termos de Serviço
      </ULink>
      e
      <ULink
        :to="{ name: 'privacy' }"
        target="_blank"
        class="font-medium text-primary"
      >
        Política de Privacidade
      </ULink>
      .
    </p>

    <div class="flex items-center justify-center gap-2 text-sm">
      <span class="text-muted">Já tem uma conta?</span>

      <UButton
        :to="{ name: 'auth', query: { redirect: route.query.redirect as string } }"
        color="primary"
        variant="link"
        size="sm"
        class="px-0"
      >
        Entrar
      </UButton>
    </div>
  </div>
</template>
