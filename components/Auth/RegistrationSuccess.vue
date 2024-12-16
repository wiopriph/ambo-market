<script setup lang="ts">
import IconSuccess from '~/assets/images/auth/icon-success.svg?component';
import { AUTH_STATES } from '~/constants/auth-states';
import { SUPPORT_EMAIL } from '~/constants/contacts';


const { t } = useI18n();


const emit = defineEmits(['close', 'select']);

const closeModal = () => {
  emit('close');
};

const goBack = () => {
  emit('select', AUTH_STATES.WELCOME);
};
</script>

<i18n>
{
  "en": {
    "confirmation_email_sent": "We've sent you a confirmation email!",
    "confirm_account_email": "Click the link in your email to confirm your account",
    "need_assistance": "Need assistance? Contact {support}.",
    "support": "our support"
  },
  "pt": {
    "confirmation_email_sent": "Enviamos um e-mail de confirmação para você!",
    "confirm_account_email": "Clique no link do seu e-mail para confirmar sua conta",
    "need_assistance": "Precisa de ajuda? Entre em contato com {support}.",
    "support": "nosso suporte"
  }
}
</i18n>

<template>
  <AuthWrapper
    hasBackButton
    @back="goBack"
    @close="closeModal"
  >
    <h2
      :class="$style.title"
      v-text="t('confirmation_email_sent')"
    />

    <div :class="$style.description">
      <p v-text="t('confirm_account_email')" />

      <br>

      <I18nT
        keypath="need_assistance"
        tag="p"
      >
        <template #support>
          <a :href="`mailto:${SUPPORT_EMAIL}`">{{ t('support') }}</a>
        </template>
      </I18nT>
    </div>

    <div :class="$style.success">
      <IconSuccess />
    </div>
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

.success {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 90px;
}
</style>
