<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import { vMaska } from 'maska/vue';
import { useUser } from '~/composables/useUser';
import { PHONE_REG_EXP } from '~/constants/reg-exps';


const { t } = useI18n();
const { currentUser, updateProfile } = useUser();

const {
  errors,
  handleSubmit,
  setFieldValue,
} = useForm({
  initialValues: {
    name: '',
    phone: '',
  },
  validationSchema: object({
    name: string()
      .required(t('validation.required')),
    phone: string()
      .required(t('validation.required'))
      .matches(PHONE_REG_EXP, t('validation.phone')),
  }),
});

const { value: name } = useField<string>('name');
const { value: phone } = useField<string>('phone');

watch(
  currentUser,
  (user) => {
    if (!user) {
      return;
    }

    setFieldValue('name', user.name ?? '');
    setFieldValue('phone', user.phone ?? '');
  },
  { immediate: true },
);

const isLoading = ref(false);
const backendError = ref('');

const saveProfile = handleSubmit.withControlled(async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  backendError.value = '';

  try {
    const formattedPhone = phone.value.replace(/\s+/g, '');

    await updateProfile({
      'display_name': name.value.trim(),
      phone: formattedPhone,
    });
  } catch (error: any) {
    backendError.value = error?.message || 'Error';
  } finally {
    isLoading.value = false;
  }
});
</script>

<i18n lang="json">
{
  "en": {
    "title": "Add contact details",
    "description": "Buyers need your name and phone number before you can publish an ad.",
    "phone_number": "Phone number",
    "phone_placeholder": "+244 900 000 000",
    "name": "Name",
    "name_placeholder": "Your name",
    "save": "Save and continue"
  },
  "pt": {
    "title": "Adicionar dados de contacto",
    "description": "Os compradores precisam do seu nome e número de telefone antes de você publicar um anúncio.",
    "phone_number": "Número de telefone",
    "phone_placeholder": "+244 900 000 000",
    "name": "Nome",
    "name_placeholder": "Seu nome",
    "save": "Guardar e continuar"
  }
}
</i18n>

<template>
  <div class="space-y-5">
    <div class="space-y-2">
      <h2
        class="text-xl font-semibold text-highlighted"
        v-text="t('title')"
      />

      <p
        class="text-sm leading-6 text-muted"
        v-text="t('description')"
      />
    </div>

    <form
      class="space-y-4"
      @submit.prevent="saveProfile"
    >
      <UFormField
        :label="t('name')"
        :error="errors.name"
        name="name"
        required
      >
        <UInput
          v-model="name"
          name="name"
          type="text"
          autocomplete="name"
          :placeholder="t('name_placeholder')"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UFormField
        :label="t('phone_number')"
        :error="errors.phone"
        name="phone"
        required
      >
        <UInput
          v-model="phone"
          v-maska="'+244 ### ### ###'"
          name="phone"
          type="tel"
          autocomplete="tel-national"
          inputmode="tel"
          :placeholder="t('phone_placeholder')"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UAlert
        v-if="backendError"
        color="error"
        variant="soft"
        :description="backendError"
      />

      <UButton
        type="submit"
        color="primary"
        size="lg"
        block
        :loading="isLoading"
      >
        {{ t('save') }}
      </UButton>
    </form>
  </div>
</template>
