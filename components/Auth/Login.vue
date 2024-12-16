<script setup lang="ts">
import { AUTH_STATES } from '~/constants/auth-states';


const { t } = useI18n();


const email = ref('');
const password = ref('');

const isLoading = ref(false);
const backendErrors = ref([]);


const errors = ref({});


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

const authByEmail = async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  backendErrors.value = [];

  try {
    await $fire.auth.signIn(email.value, password.value);
    closeModal();
  } catch (error) {
    backendErrors.value = [error?.message];
    isLoading.value = false;
  }
};
</script>

<i18n>
{
  "en": {
    "login_with_email": "Login with e-mail",
    "username_and_email": "Username or e-mail",
    "password": "Password",
    "forgot_password": "Forgot your password?",
    "login": "Login"
  },
  "pt": {
    "login_with_email": "Login com e-mail",
    "username_and_email": "Nome de usuário ou e-mail",
    "password": "Senha",
    "forgot_password": "Esqueceu sua senha?",
    "login": "Login"
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
      v-text="t('login_with_email')"
    />

    <form
      :class="$style.list"
      @submit.prevent="authByEmail"
    >
      <div :class="$style.inputWrapper">
        <UIInput
          v-model="email"
          :label="t('username_and_email')"
          :errors="errors.email"
          isRequired
          name="email"
          placeholder="Alex Cortess"
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
          placeholder="irfdLajfk1349"
          name="password"
          type="password"
        />

        <UIErrors :errors="errors.password" />
      </div>
    </form>

    <UIErrors :errors="backendErrors" />

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
