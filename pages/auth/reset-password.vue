<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';


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
const client = useSupabaseClient();
const { updateUser } = useAuth();

const isCheckingToken = ref(true);
const isTokenInvalid = ref(false);

const isLoading = ref(false);
const backendError = ref('');
const successMessage = ref('');

onMounted(async () => {
  const { data, error } = await client.auth.verifyOtp({
    ['token_hash']: route.query.token,
    type: route.query.type,
  });

  if (error || !data.user) {
    isTokenInvalid.value = true;
  }

  isCheckingToken.value = false;
});

const {
  errors,
  handleSubmit,
} = useForm({
  initialValues: {
    password: '',
    confirmPassword: '',
  },
  validationSchema: object({
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

const { value: password } = useField<string>('password');
const { value: confirmPassword } = useField<string>('confirmPassword');

const submitNewPassword = handleSubmit.withControlled(async () => {
  if (isLoading.value || isTokenInvalid.value) {
    return;
  }

  backendError.value = '';
  successMessage.value = '';
  isLoading.value = true;

  const { error } = await updateUser({ password: password.value });

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
    "meta_title": "Set a new Ambo Market password",
    "meta_description": "Create a new password for your Ambo Market account and restore secure access to your classifieds.",
    "title": "Set a new password",
    "subtitle": "Enter a new password for your account.",
    "password": "New password",
    "confirm_password": "Confirm password",
    "save": "Save new password",
    "back_to_login": "Back to login",
    "invalid_link_title": "The link is invalid or has expired",
    "invalid_link_text": "Request a new password reset link and try again.",
    "success_message": "Your password has been updated. You can now log in with the new password."
  },
  "pt": {
    "meta_title": "Definir nova senha do Ambo Market",
    "meta_description": "Crie uma nova senha para sua conta Ambo Market e recupere o acesso seguro aos seus classificados.",
    "title": "Definir uma nova senha",
    "subtitle": "Digite uma nova senha para sua conta.",
    "password": "Nova senha",
    "confirm_password": "Confirmar senha",
    "save": "Salvar nova senha",
    "back_to_login": "Voltar para login",
    "invalid_link_title": "O link é inválido ou expirou",
    "invalid_link_text": "Solicite um novo link de redefinição de senha e tente novamente.",
    "success_message": "Sua senha foi atualizada. Agora você pode entrar com a nova senha."
  }
}
</i18n>

<template>
  <UILoader v-if="isCheckingToken" />

  <div
    v-else
    class="mx-auto flex w-full max-w-md px-0 py-4 sm:py-12"
  >
    <UCard
      :title="isTokenInvalid ? t('invalid_link_title') : t('title')"
      :description="isTokenInvalid ? undefined : t('subtitle')"
      class="w-full"
    >
      <div
        v-if="isTokenInvalid"
        class="space-y-4"
      >
        <UAlert
          color="warning"
          variant="soft"
          icon="i-lucide-triangle-alert"
          :description="t('invalid_link_text')"
        />

        <UButton
          type="button"
          color="primary"
          variant="link"
          class="justify-center px-0"
          block
          @click="goToLogin"
        >
          {{ t('back_to_login') }}
        </UButton>
      </div>

      <template v-else>
        <form
          class="space-y-4"
          @submit.prevent="submitNewPassword"
        >
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

          <UAlert
            v-if="successMessage"
            color="success"
            variant="soft"
            icon="i-lucide-circle-check"
            :description="successMessage"
          />

          <UButton
            type="submit"
            :label="t('save')"
            :loading="isLoading"
            size="lg"
            block
          />
        </form>

        <UButton
          type="button"
          color="primary"
          variant="link"
          class="mt-5 justify-center px-0"
          block
          @click="goToLogin"
        >
          {{ t('back_to_login') }}
        </UButton>
      </template>
    </UCard>
  </div>
</template>
