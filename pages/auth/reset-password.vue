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
  <div
    v-if="isCheckingToken"
    class="flex justify-center py-12"
  >
    <UIcon
      name="i-lucide-loader-circle"
      class="size-8 animate-spin text-muted"
    />
  </div>

  <div
    v-else
    class="mx-auto w-full max-w-md px-4 py-8 sm:py-16 space-y-3"
  >
    <div class="rounded-2xl border border-default bg-default px-5 py-4">
      <h1
        class="text-lg font-bold text-highlighted"
        v-text="isTokenInvalid ? t('invalid_link_title') : t('title')"
      />

      <p
        v-if="!isTokenInvalid"
        class="mt-0.5 text-sm text-muted"
        v-text="t('subtitle')"
      />
    </div>

    <template v-if="isTokenInvalid">
      <UAlert
        color="warning"
        variant="soft"
        icon="i-lucide-triangle-alert"
        :description="t('invalid_link_text')"
      />

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
    </template>

    <template v-else>
      <form
        class="space-y-3"
        @submit.prevent="submitNewPassword"
      >
        <div class="rounded-2xl border border-default bg-default divide-y divide-default overflow-hidden">
          <div class="px-5 py-4">
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
          </div>

          <div class="px-5 py-4">
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
          :label="t('save')"
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
    </template>
  </div>
</template>
