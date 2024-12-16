<script setup lang="ts">
import { AUTH_STATES } from '~/constants/auth-states';


const { t } = useI18n();

const email = ref('');
const username = ref('');
const password = ref('');
const confirmPassword = ref('');

const isLoading = ref(false);
const backendErrors = ref([]);
const errors = ref({});

// @todo: добавить валидацию, чтобы оба пароля совпадали
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

const signUp = async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  backendErrors.value = [];

  try {
    await $fire.auth.signUp(email.value, password.value, username.value);

    goToSuccessModal();
  } catch (error) {
    backendErrors.value = [error?.message];
    isLoading.value = false;
  }
};
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
          :errors="errors.username"
          isRequired
          name="name"
          placeholder="Name"
          type="text"
        />

        <UIErrors :errors="errors.username" />
      </div>

      <div :class="$style.inputWrapper">
        <UIInput
          v-model="email"
          :errors="errors.email"
          isRequired
          name="email"
          label="E-mail"
          placeholder="info@example.com"
          type="email"
        />

        <UIErrors :errors="errors.email" />
      </div>

      <div :class="$style.inputWrapper">
        <UIInput
          v-model="password"
          :label="t('password')"
          :errors="errors.password"
          isRequired
          name="password"
          placeholder="*********"
          type="password"
        />

        <UIErrors :errors="errors.password" />
      </div>

      <div :class="$style.inputWrapper">
        <UIInput
          v-model="confirmPassword"
          :label="t('confirm_password')"
          :isSuccess="arePasswordsEqual"
          :errors="errors.confirmPassword"
          isRequired
          name="confirmPassword"
          placeholder="*********"
          type="password"
        />

        <UIErrors :errors="errors.confirmPassword" />
      </div>
    </form>

    <UIErrors :errors="backendErrors" />

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
