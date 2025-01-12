<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import { vMaska } from 'maska/vue';
import { useUser } from '~/composables/useUser';
import { PHONE_REG_EXP } from '~/constants/reg-exps';


const { t } = useI18n();

const {
  errors,
  handleSubmit,
} = useForm({
  initialValues: {
    phone: '',
  },
  validationSchema: object({
    phone: string()
      .required(t('validation.required'))
      .matches(PHONE_REG_EXP, t('validation.phone')),
  }),
});

const { value: phone } = useField<string>('phone');


const isLoading = ref<boolean>(false);
const backendError = ref<string>('');

const { updateProfile } = useUser();

const savePhone = handleSubmit.withControlled(async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  backendError.value = '';

  try {
    const formattedPhone = phone.value.replace(/\s+/g, '');

    await updateProfile({ phoneNumber: formattedPhone });
  } catch (error) {
    backendError.value = error?.message;
  } finally {
    isLoading.value = false;
  }
});
</script>

<i18n>
{
  "en": {
    "your_phone_number": "Your phone number",
    "description": "Before posting your ad, please enter your phone number. This number will be available to other users, so they can contact you."
  },
  "pt": {
    "your_phone_number": "Seu número de telefone",
    "description": "Antes de publicar seu anúncio, por favor, insira seu número de telefone. Este número estará disponível para outros usuários para que eles possam entrar em contato com você."
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <h2
      :class="$style.title"
      v-text="t('your_phone_number')"
    />

    <p
      :class="$style.description"
      v-text="t('description')"
    />

    <form
      :class="$style.list"
      @submit.prevent="savePhone"
    >
      <div>
        <UIInputPhone
          v-model="phone"
          v-maska="'+244 ### ### ###'"
          :placeholder="t('phone_number')"
          :error="errors.phone"
          name="phone"
        />

        <UIError :text="errors.phone" />
      </div>
    </form>

    <UIError :error="backendError" />

    <UIButton
      :text="t('save')"
      :isLoading="isLoading"
      :class="$style.button"
      @click="savePhone"
    />
  </div>
</template>

<style lang="scss" module>
.root {

  @include exclude-md {

    @include ui-round-content-blocks;

    padding: 20px;
    background-color: $ui-color-white;
    box-shadow: $box-shadow;
  }
}

.title {
  @include ui-typo-24-bold;
}

.description {
  margin-top: 24px;
  color: $ui-color-text-main;
}

.list {
  margin-top: 20px;
}

.button {
  width: 100%;
  margin-top: 30px;
}
</style>
