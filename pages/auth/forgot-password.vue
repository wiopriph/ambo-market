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
const { resetPassword } = useAuth();

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
    "meta_title": "Recover your Ambo Market password",
    "meta_description": "Request a password reset link for your Ambo Market account and get back to managing your classifieds.",
    "title": "Password recovery",
    "subtitle": "We will send a link to reset your password to your e-mail.",
    "email": "E-mail",
    "reset_password": "Reset password",
    "back_to_login": "Back to login",
    "success_message": "If this e-mail is registered, we have sent a link to reset your password."
  },
  "pt": {
    "meta_title": "Recuperar senha do Ambo Market",
    "meta_description": "Solicite um link para redefinir a senha da sua conta Ambo Market e volte a gerir seus classificados.",
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
  <div class="mx-auto w-full max-w-md px-4 py-8 sm:py-16 space-y-3">
    <div class="rounded-2xl border border-default bg-default px-5 py-4">
      <h1
        class="text-lg font-bold text-highlighted"
        v-text="t('title')"
      />

      <p
        class="mt-0.5 text-sm text-muted"
        v-text="t('subtitle')"
      />
    </div>

    <form
      class="space-y-3"
      @submit.prevent="resetPasswordForEmail"
    >
      <div class="rounded-2xl border border-default bg-default overflow-hidden">
        <div class="px-5 py-4">
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
        :label="t('reset_password')"
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
        {{ t('back_to_login') }}
      </UButton>
    </div>
  </div>
</template>
