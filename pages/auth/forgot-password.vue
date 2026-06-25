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

const title = 'Recuperar senha do Ambo Market';
const description = 'Solicite um link para redefinir a senha da sua conta Ambo Market e volte a gerir seus classificados.';

useHead({
  title,
  meta: [
    { key: 'og:title', property: 'og:title', content: title },
    { key: 'twitter:title', property: 'twitter:title', content: title },
    { key: 'description', name: 'description', content: description },
    { key: 'og:description', property: 'og:description', content: description },
    { key: 'twitter:description', property: 'twitter:description', content: description },
  ],
});

const route = useRoute();
const { resetPassword } = useAuth();

const {
  errors,
  handleSubmit,
} = useForm({
  initialValues: { email: '' },
  validationSchema: object({
    email: string()
      .email('Formato de email incorreto')
      .required('Este campo é obrigatório'),
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

  successMessage.value = 'Se este e-mail estiver cadastrado, enviamos um link para redefinir sua senha.';
});

const goToLogin = () => {
  navigateTo({
    name: 'auth',
    query: { redirect: route.query.redirect as string },
  });
};
</script>

<template>
  <div class="mx-auto w-full max-w-md px-4 py-8 sm:py-16 space-y-3">
    <div class="rounded-2xl border border-default bg-default px-5 py-4">
      <h1 class="text-lg font-bold text-highlighted">
        Recuperação de senha
      </h1>

      <p class="mt-0.5 text-sm text-muted">
        Enviaremos um link para redefinir sua senha para o seu e-mail.
      </p>
    </div>

    <form
      class="space-y-3"
      @submit.prevent="resetPasswordForEmail"
    >
      <div class="rounded-2xl border border-default bg-default overflow-hidden">
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
      </div>

      <UAlert
        v-if="backendError"
        color="error"
        variant="soft"
        icon="i-lucide-circle-alert"
        :description="backendError"
      />

      <UAlert
        v-if="successMessage"
        color="success"
        variant="soft"
        icon="i-lucide-circle-check"
        :description="successMessage"
      />

      <UButton
        type="submit"
        label="Redefinir senha"
        :loading="isLoading"
        size="lg"
        block
      />
    </form>

    <div class="flex justify-center">
      <UButton
        type="button"
        color="primary"
        variant="link"
        size="sm"
        class="px-0"
        @click="goToLogin"
      >
        Voltar para login
      </UButton>
    </div>
  </div>
</template>
