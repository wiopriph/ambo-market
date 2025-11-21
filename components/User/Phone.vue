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
      display_name: name.value.trim(),
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
    "your_phone_number": "Contact details",
    "your_name": "Your name",
    "description": "Before you publish your first ad, please tell us how buyers can contact you. Your name and phone number will be shown to other users next to your ads.",
    "phone_number": "Phone number",
    "name": "Name",
    "save": "Save and continue"
  },
  "pt": {
    "your_phone_number": "Dados de contacto",
    "your_name": "Seu nome",
    "description": "Antes de publicar o seu primeiro anúncio, diga-nos como os compradores podem falar com você. O seu nome e número de telefone serão mostrados aos outros utilizadores junto aos seus anúncios.",
    "phone_number": "Número de telefone",
    "name": "Nome",
    "save": "Guardar e continuar"
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
      @submit.prevent="saveProfile"
    >
      <div :class="$style.inputWrapper">
        <UIInput
          v-model="name"
          :label="t('your_name')"
          :error="errors.name"
          name="name"
          type="text"
        />

        <UIError :text="errors.name" />
      </div>

      <div :class="$style.inputWrapper">
        <UIInputPhone
          v-model="phone"
          v-maska="'+244 ### ### ###'"
          :label="t('phone_number')"
          :placeholder="t('phone_number')"
          :error="errors.phone"
          name="phone"
        />

        <UIError :text="errors.phone" />
      </div>
    </form>

    <UIError :text="backendError" />

    <UIButton
      :text="t('save')"
      :isLoading="isLoading"
      :class="$style.button"
      @click="saveProfile"
    />
  </div>
</template>

<style lang="scss" module>
.root {

  @include exclude-md {
    @include ui-round-content-blocks;

    background-color: $ui-color-white;
    padding: 24px 24px 20px;
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

.inputWrapper {

  & + & {
    margin-top: 16px;
  }
}

.button {
  width: 100%;
  margin-top: 30px;
}
</style>
