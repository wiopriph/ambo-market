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
  },
  validationSchema: object({
    email: string()
      .email(t('validation.email'))
      .required(t('validation.required')),
  }),
});

const { value: email } = useField<string>('email');


const isLoading = ref(false);
const backendErrors = ref('');


const emit = defineEmits(['close', 'select']);

const closeModal = () => {
  emit('close');
};

const goToAuthLoginModal = () => {
  emit('select', AUTH_STATES.LOGIN);
};

const goToSuccessModal = () => {
  emit('select', AUTH_STATES.RECOVERY_SUCCESS);
};


const { $fire } = useNuxtApp();

const resetPassword = handleSubmit.withControlled(async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  backendErrors.value = '';

  try {
    await $fire.auth.sendPasswordResetEmail(email.value);

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
    "password_recovery": "Password recovery",
    "send_link_to_reset": "We will send a link to reset your password to your e-mail",
    "reset_password": "Reset password"
  },
  "pt": {
    "password_recovery": "Recuperação de senha",
    "send_link_to_reset": "Enviaremos um link para redefinir sua senha para o seu e-mail",
    "reset_password": "Redefinir senha"
  }
}
</i18n>

<template>
  <AuthWrapper
    hasBackButton
    @back="goToAuthLoginModal"
    @close="closeModal"
  >
    <h2
      :class="$style.title"
      v-text="t('password_recovery')"
    />

    <p
      :class="$style.description"
      v-text="t('send_link_to_reset')"
    />

    <form
      :class="$style.list"
      @submit.prevent="resetPassword"
    >
      <UIInput
        v-model="email"
        :error="errors.email"
        isRequired
        label="E-mail"
        name="email"
        type="email"
      />

      <UIError :text="errors.email" />
    </form>

    <UIError :text="backendErrors" />

    <UIButton
      :text="t('reset_password')"
      :class="$style.button"
      :isLoading="isLoading"
      @click="resetPassword"
    />
  </AuthWrapper>
</template>

<style lang="scss" module>
.title {
  @include ui-typo-36-medium;
}

.description {
  @include ui-typo-14;

  margin-top: 10px;
  color: $ui-color-text-main;
}

.list {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 24px;
}

.button {
  margin-top: 16px;
}
</style>
