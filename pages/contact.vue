<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import IconSuccess from '~/assets/images/auth/icon-success.svg?component';
import { useUser } from '~/composables/useUser';


const { t } = useI18n();

const {
  errors,
  handleSubmit,
  handleReset,
} = useForm({
  initialValues: {
    email: '',
    name: '',
    subject: '',
    text: '',
  },
  validationSchema: object({
    email: string().email(t('validation.email'))
      .required(t('validation.required')),
    name: string().required(t('validation.required')),
    subject: string().required(t('validation.required')),
    text: string().required(t('validation.required')),
  }),
});

const { value: email } = useField<string>('email');
const { value: name } = useField<string>('name');
const { value: subject } = useField<string>('subject');
const { value: text } = useField<string>('text');


const {
  isLoggedIn,
  uid,
  currentUser,
} = useUser();


watch(isLoggedIn, (state) => {
  if (state && currentUser.value) {
    email.value = currentUser.value.email;
    name.value = currentUser.value.name;
  }
});


const isLoading = ref(false);
const isSent = ref(false);
const backendError = ref('');

const { $fire } = useNuxtApp();

const submit = handleSubmit.withControlled(async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  backendError.value = '';

  try {
    await $fire.https('sendEmail', {
      userId: uid.value || 'anonymous',
      name: name.value,
      email: email.value,
      subject: subject.value,
      text: text.value,
    });

    isSent.value = true;
    resetForm();
  } catch (error) {
    backendError.value = error?.message;
  }

  isLoading.value = false;
});

const resetForm = () => {
  subject.value = '';
  text.value = '';

  handleReset();
};
</script>

<i18n>
{
  "en": {
    "contact": "How can we help you?",
    "name": "Name",
    "email": "Your email address",
    "subject": "Subject",
    "text": "Tell us what happened",
    "notice": "Please enter the details of your request. A member of our support staff will respond as soon as possible.",
    "submit": "Submit",
    "submitted": "Your request was successfully submitted!"
  },
  "pt": {
    "contact": "Como podemos ajudar você?",
    "name": "Nome",
    "email": "Seu endereço de e-mail",
    "subject": "Assunto",
    "text": "Conte-nos o que aconteceu",
    "notice": "Por favor, forneça os detalhes do seu pedido. Um membro da nossa equipe de suporte responderá o mais rápido possível.",
    "submit": "Enviar",
    "submitted": "Seu pedido foi enviado com sucesso!"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <div
      v-if="isSent"
      :class="$style.submitted"
    >
      <IconSuccess />

      <span
        :class="$style.submittedText"
        v-text="t('submitted')"
      />
    </div>

    <template v-else>
      <h1
        :class="$style.title"
        v-text="t('contact')"
      />

      <form
        :class="$style.form"
        @submit.prevent="submit"
      >
        <div :class="$style.input">
          <UIInput
            v-model="email"
            :error="errors.email"
            :label="t('email')"
            isRequired
            name="email"
          />

          <UIError :text="errors.email" />
        </div>

        <div :class="$style.input">
          <UIInput
            v-model="name"
            :error="errors.name"
            :label="t('name')"
            isRequired
            name="name"
          />

          <UIError :text="errors.name" />
        </div>

        <div :class="$style.input">
          <UIInput
            v-model="subject"
            :error="errors.subject"
            :label="t('subject')"
            isRequired
            name="subject"
          />

          <UIError :error="errors.subject" />
        </div>

        <div :class="$style.input">
          <UIInputTextArea
            v-model="text"
            :error="errors.text"
            :label="t('text')"
            isRequired
            name="text"
          />

          <UIError :error="errors.text" />

          <p
            :class="$style.notice"
            v-text="t('notice')"
          />
        </div>

        <UIError :text="backendError" />

        <div :class="$style.buttonWrap">
          <UIButton
            :class="$style.button"
            :text="t('send')"
            :isDisabled="isLoading"
            :isLoading="isLoading"
            type="primary"
            @click="submit"
          />
        </div>
      </form>
    </template>
  </div>
</template>

<style lang="scss" module>
.root {
  width: 100%;
  padding: 20px;

  @include exclude-md {
    @include ui-round-content-blocks;

    max-width: 600px;
    margin: 30px auto;
    background-color: $ui-color-white;
    box-shadow: $box-shadow;
  }
}

.submitted {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 30px;
}

.submittedText {
  margin-top: 30px;
}

.form {
  margin-top: 20px;
}

.title {
  @include ui-typo-24-bold;
}

.input {

  & + & {
    margin-top: 20px;
  }
}

.notice {
  @include ui-typo-12;

  margin-top: 10px;
  color: $ui-color-text-main;
}

.buttonWrap {
  width: 100%;
  margin-top: 20px;
}

.button {
  width: 100%;
}
</style>
