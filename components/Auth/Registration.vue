<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import { AUTH_STATES } from '~/constants/auth-states';


const { t } = useI18n();

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
    username: string().required(t('validation.required')),
    password: string().required(t('validation.passwordRequired'))
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

const { value: email } = useField<string>('email');
const { value: username } = useField<string>('username');
const { value: password } = useField<string>('password');
const { value: confirmPassword } = useField<string>('confirmPassword');


const isLoading = ref(false);
const backendErrors = ref('');

const arePasswordsEqual = computed(() => !!password.value && (password.value === confirmPassword.value));


const emit = defineEmits(['close', 'select']);

const closeModal = () => {
  emit('close');
};

const goToAuthWelcomeModal = () => {
  emit('select', AUTH_STATES.WELCOME);
};

const goToSuccessModal = () => {
  emit('select', AUTH_STATES.REGISTRATION_SUCCESS);
};


const { $fire } = useNuxtApp();

const signUp = handleSubmit.withControlled(async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  backendErrors.value = '';

  try {
    await $fire.auth.signUp(email.value, password.value, username.value);

    goToSuccessModal();
  } catch (error) {
    backendErrors.value = error?.message;
    isLoading.value = false;
  }
});
</script>

<i18n>
{
  "en": {
    "registration": "Registration",
    "username": "Username",
    "password": "Password",
    "confirm_password": "Confirm password",
    "register": "Register"
  },
  "pt": {
    "registration": "Registro",
    "username": "Nome de usuário",
    "password": "Senha",
    "confirm_password": "Confirmar senha",
    "register": "Registrar-se"
  }
}
</i18n>

<template>
  <AuthWrapper
    hasBackButton
    @back="goToAuthWelcomeModal"
    @close="closeModal"
  >
    <h2
      :class="$style.title"
      v-text="t('registration')"
    />

    <form
      :class="$style.list"
      @submit.prevent="authByEmail"
    >
      <div :class="$style.inputWrapper">
        <UIInput
          v-model="username"
          :label="t('username')"
          :error="errors.username"
          isRequired
          name="name"
          type="text"
        />

        <UIError :text="errors.username" />
      </div>

      <div :class="$style.inputWrapper">
        <UIInput
          v-model="email"
          :error="errors.email"
          isRequired
          name="email"
          label="E-mail"
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
          :isSuccess="arePasswordsEqual"
          :error="errors.confirmPassword"
          isRequired
          name="confirmPassword"
          type="password"
        />

        <UIError :text="errors.confirmPassword" />
      </div>
    </form>

    <UIError :text="backendErrors" />

    <UIButton
      :text="t('register')"
      :class="$style.button"
      :isLoading="isLoading"
      @click="signUp"
    />
  </AuthWrapper>
</template>

<style lang="scss" module>
.title {
  @include ui-typo-36-medium;
}

.list {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 24px;
}

.inputWrapper {

  & + & {
    margin-top: 16px;
  }
}

.button {
  margin-top: 16px;
}
</style>
