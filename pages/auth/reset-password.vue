<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';


const { t } = useI18n();
const route = useRoute();
const client = useSupabaseClient();
const { updateUser } = useAuth();

const isCheckingToken = ref(true);
const isTokenInvalid = ref(false);

const isLoading = ref(false);
const backendError = ref('');
const successMessage = ref('');

onMounted(async () => {
  const { data, error } = await client.auth.getUser();

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
    :class="$style.root"
  >
    <div :class="$style.card">
      <template v-if="isTokenInvalid">
        <h2
          :class="$style.title"
          v-text="t('invalid_link_title')"
        />

        <p
          :class="$style.subtitle"
          v-text="t('invalid_link_text')"
        />

        <button
          type="button"
          :class="$style.backButton"
          @click="goToLogin"
        >
          {{ t('back_to_login') }}
        </button>
      </template>

      <template v-else>
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
          @submit.prevent="submitNewPassword"
        >
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
        </form>

        <UIError :text="backendError" />

        <p
          v-if="successMessage"
          :class="$style.success"
          v-text="successMessage"
        />

        <UIButton
          :text="t('save')"
          :class="$style.submitButton"
          :isLoading="isLoading"
          @click="submitNewPassword"
        />

        <button
          type="button"
          :class="$style.backButton"
          @click="goToLogin"
        >
          {{ t('back_to_login') }}
        </button>
      </template>
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
