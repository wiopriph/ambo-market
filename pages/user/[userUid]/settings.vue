<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import { type ProfileImageInput, type ProfileUpdateInput, useUser } from '~/composables/useUser';
import { PHONE_REG_EXP } from '~/constants/reg-exps';


definePageMeta({
  middleware: defineNuxtRouteMiddleware((to) => {
    const { isLoggedIn, uid } = useUser();

    if (!isLoggedIn.value) {
      return navigateTo({ name: 'auth', query: { redirect: to.path } });
    }

    if (uid.value !== to.params.userUid) {
      return navigateTo({
        name: 'user-userUid-settings',
        params: {
          userUid: uid.value,
        },
      });
    }
  }),
});


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

const photoFile = ref<File | null>(null);
const photoInputRef = ref<HTMLInputElement | null>(null);
const photoPreviewUrl = ref('');
const uploadedPhoto = ref<ProfileImageInput | null>(null);

const formatPhone = (value: string) => {
  let digits = value.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  if (digits.startsWith('244')) {
    digits = digits.slice(3);
  }

  digits = digits.slice(0, 9);

  const parts = [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 9),
  ].filter(Boolean);

  return ['+244', ...parts].join(' ');
};

const fileToImage = (file: File) => new Promise<ProfileImageInput>((resolve, reject) => {
  const reader = new FileReader();

  reader.onload = (event_) => {
    resolve({
      base64: event_.target?.result as string,
      mimeType: file.type,
    });
  };

  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(file);
});

watch(
  currentUser,
  (user) => {
    if (!user) {
      return;
    }

    setFieldValue('name', user.name ?? '');
    setFieldValue('phone', formatPhone(user.phone ?? ''));
    photoPreviewUrl.value = user.photoURL ?? '';
  },
  { immediate: true },
);

watch(phone, (value) => {
  const formattedPhone = formatPhone(value);

  if (formattedPhone !== value) {
    phone.value = formattedPhone;
  }
});

watch(photoFile, async (file) => {
  if (!file) {
    uploadedPhoto.value = null;
    photoPreviewUrl.value = currentUser.value?.photoURL ?? '';

    return;
  }

  const image = await fileToImage(file);

  uploadedPhoto.value = image;
  photoPreviewUrl.value = image.base64;
});

const openPhotoDialog = () => {
  photoInputRef.value?.click();
};

const selectPhoto = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) {
    return;
  }

  photoFile.value = file;
  input.value = '';
};

const isLoading = ref(false);
const backendError = ref('');

const saveSettings = handleSubmit.withControlled(async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  backendError.value = '';

  try {
    const payload: ProfileUpdateInput = {
      'display_name': name.value.trim(),
      phone: phone.value.replace(/\s+/g, ''),
    };

    if (uploadedPhoto.value) {
      payload.image = uploadedPhoto.value;
    }

    await updateProfile(payload);
    photoFile.value = null;
  } catch (error: any) {
    backendError.value = error?.message || 'Error';
  } finally {
    isLoading.value = false;
  }
});
</script>

<i18n>
{
  "en": {
    "title": "Settings",
    "description": "Edit the contact details buyers see next to your ads.",
    "photo": "Photo",
    "change_photo": "Change photo",
    "name": "Name",
    "name_placeholder": "Your name",
    "phone_number": "Phone number",
    "phone_placeholder": "+244 900 000 000",
    "save": "Save changes",
    "error_title": "Could not save settings"
  },
  "pt": {
    "title": "Configurações",
    "description": "Edite os dados de contacto que os compradores veem nos seus anúncios.",
    "photo": "Foto",
    "change_photo": "Alterar foto",
    "name": "Nome",
    "name_placeholder": "Seu nome",
    "phone_number": "Número de telefone",
    "phone_placeholder": "+244 900 000 000",
    "save": "Guardar alterações",
    "error_title": "Não foi possível guardar as configurações"
  }
}
</i18n>

<template>
  <form
    v-if="currentUser"
    class="space-y-3"
    @submit.prevent="saveSettings"
  >
    <div class="rounded-2xl border border-default bg-default p-5">
      <input
        ref="photoInputRef"
        class="hidden"
        type="file"
        accept="image/jpg,image/jpeg,image/png,image/bmp"
        @change="selectPhoto"
      >

      <button
        type="button"
        :aria-label="t('change_photo')"
        class="flex w-full items-center gap-4 text-left"
        @click="openPhotoDialog"
      >
        <div class="relative shrink-0">
          <UAvatar
            :src="photoPreviewUrl || undefined"
            :alt="name || t('photo')"
            :text="name"
            size="2xl"
            class="ring-2 ring-default"
          />

          <span
            class="absolute bottom-0 right-0 flex size-6 items-center justify-center rounded-full bg-primary shadow-sm"
          >
            <UIcon
              name="i-lucide-camera"
              class="size-3.5 text-white"
            />
          </span>
        </div>

        <div class="min-w-0">
          <p
            class="text-sm font-semibold text-highlighted"
            v-text="t('photo')"
          />

          <p
            class="mt-0.5 text-xs text-muted"
            v-text="t('change_photo')"
          />
        </div>

        <UIcon
          name="i-lucide-chevron-right"
          class="ml-auto size-4 shrink-0 text-muted"
        />
      </button>
    </div>

    <div class="rounded-2xl border border-default bg-default divide-y divide-default overflow-hidden">
      <div class="px-5 py-4">
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
      </div>

      <div class="px-5 py-4">
        <UFormField
          :label="t('phone_number')"
          :error="errors.phone"
          name="phone"
          required
        >
          <UInput
            v-model="phone"
            name="phone"
            type="tel"
            autocomplete="tel-national"
            inputmode="tel"
            :placeholder="t('phone_placeholder')"
            size="lg"
            class="w-full"
          />
        </UFormField>
      </div>
    </div>

    <UAlert
      v-if="backendError"
      color="error"
      variant="soft"
      :title="t('error_title')"
      :description="backendError"
    />

    <UButton
      type="submit"
      color="primary"
      size="lg"
      :loading="isLoading"
      block
      :label="t('save')"
    />
  </form>
</template>
