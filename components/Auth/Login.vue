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
    password: '',
  },
  validationSchema: object({
    email: string()
      .email(t('validation.email'))
      .required(t('validation.required')),
    password: string().required(t('validation.required')),
  }),
});

const { value: email } = useField<string>('email');
const { value: password } = useField<string>('password');


const isLoading = ref(false);
const backendErrors = ref('');


const emit = defineEmits(['close', 'select']);

const closeModal = () => {
  emit('close');
};

const goToAuthWelcomeModal = () => {
  emit('select', AUTH_STATES.WELCOME);
};

const goToAuthRecoveryModal = () => {
  emit('select', AUTH_STATES.RECOVERY);
};


const { $fire } = useNuxtApp();

const authByEmail = handleSubmit.withControlled(async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  backendErrors.value = '';

  try {
    await $fire.auth.signIn(email.value, password.value);
    closeModal();
  } catch (error) {
    backendErrors.value = error?.message;
    isLoading.value = false;
  }
});
</script>

<i18n>
{
  "en": {
    "login": "Login",
    "email": "E-mail",
    "password": "Password",
    "forgot_password": "Forgot your password?"
  },
  "pt": {
    "login": "Login",
    "email": "E-mail",
    "password": "Senha",
    "forgot_password": "Esqueceu sua senha?"
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
      v-text="t('login')"
    />

    <form
      :class="$style.list"
      @submit.prevent="authByEmail"
    >
      <div :class="$style.inputWrapper">
        <UIInput
          v-model="email"
          :label="t('email')"
          :error="errors.email"
          isRequired
          name="email"
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
    </form>

    <UIError :text="backendErrors" />

    <button
      :class="$style.recovery"
      type="button"
      @click="goToAuthRecoveryModal"
      v-text="t('forgot_password')"
    />

    <UIButton
      :text="t('login')"
      :class="$style.button"
      :isLoading="isLoading"
      @click="authByEmail"
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

.recovery {
  @include ui-button;

  margin-top: 10px;
  margin-bottom: 30px;
  padding: 0;
  text-align: left;
  text-decoration: underline;
  background-color: $ui-color-white;
}

.button {
  margin-top: 16px;
  padding: 13px;
}
</style>
