<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import type { UserSettingsEditPhoneProps } from './types';
import { useUser } from '~/composables/useUser';
import { PHONE_REG_EXP } from '~/constants/reg-exps';


const props = withDefaults(defineProps<UserSettingsEditPhoneProps>(), {
  phone: '',
});

const { t } = useI18n();

const {
  errors,
  handleSubmit,
} = useForm({
  initialValues: {
    phone: props.phone.replace('+', ''),
  },
  validationSchema: object({
    phone: string()
      .required(t('validation.required'))
      .matches(PHONE_REG_EXP, t('validation.phone')),
  }),
});

const { value: phone } = useField<string>('phone');


const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};


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
    await updateProfile({ phoneNumber: `+${phone.value}` });

    closeModal();
  } catch (error: any) {
    backendError.value = error.message;
  } finally {
    isLoading.value = false;
  }
});
</script>

<i18n>
{
  "en": {
    "phone_number": "Phone number",
    "your_phone_number": "Your phone number"
  },
  "pt": {
    "phone_number": "Número de telefone",
    "your_phone_number": "Seu número de telefone"
  }
}
</i18n>

<template>
  <UIModal
    :title="t('phone_number')"
    maxWidth="500px"
    @close="closeModal"
  >
    <div :class="$style.root">
      <h2
        :class="$style.title"
        v-text="t('phone_number')"
      />

      <p
        :class="$style.description"
        v-text="t('your_phone_number')"
      />

      <form
        :class="$style.list"
        @submit.prevent="savePhone"
      >
        <UIInputPhone
          v-model="phone"
          :placeholder="t('phone_number')"
          :error="errors.phone"
          name="phone"
        />

        <UIError :text="errors.phone" />
      </form>

      <UIError :text="backendError" />

      <UIButton
        :text="t('save')"
        :isLoading="isLoading"
        :class="$style.button"
        @click="savePhone"
      />
    </div>
  </UIModal>
</template>

<style lang="scss" module>
.root {
  padding: 20px;
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
