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
    "email_sent": "An email has been sent to the registered email address",
    "password_recovery_instructions": "To reset your password, please follow the link in the email.",
    "need_assistance": "Need assistance? Contact {support}.",
    "support": "our support"
  },
  "pt": {
    "email_sent": "Um e-mail foi enviado para o endereço de e-mail registrado",
    "password_recovery_instructions": "Para redefinir sua senha, por favor, siga o link no e-mail.",
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
      v-text="t('email_sent')"
    />

    <div :class="$style.description">
      <p v-text="t('password_recovery_instructions')" />

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
