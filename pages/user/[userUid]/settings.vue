<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { object, string } from 'yup';
import { useUser, type ProfileImageInput, type ProfileUpdateInput } from '~/composables/useUser';
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
  <section
    v-if="currentUser"
    class="max-w-3xl space-y-6 py-4 sm:py-8"
  >
    <div class="space-y-3">
      <h1
        class="text-3xl font-bold text-highlighted sm:text-4xl"
        v-text="t('title')"
      />

      <p
        class="max-w-2xl text-base leading-7 text-muted"
        v-text="t('description')"
      />
    </div>

    <form
      class="space-y-5"
      @submit.prevent="saveSettings"
    >
      <UCard>
        <div class="space-y-6">
          <UFormField
            name="photo"
          >
            <input
              ref="photoInputRef"
              class="hidden"
              type="file"
              accept="image/jpg,image/jpeg,image/png,image/bmp"
              @change="selectPhoto"
            >

            <div class="flex justify-center">
              <div class="relative">
                <button
                  type="button"
                  :aria-label="t('change_photo')"
                  class="block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  @click="openPhotoDialog"
                >
                  <UAvatar
                    :src="photoPreviewUrl || undefined"
                    :alt="name || t('photo')"
                    :text="name"
                    size="3xl"
                    class="size-28"
                  />
                </button>

                <UButton
                  type="button"
                  color="primary"
                  variant="solid"
                  size="sm"
                  icon="i-lucide-camera"
                  :aria-label="t('change_photo')"
                  class="absolute bottom-0 right-0 rounded-full shadow"
                  @click="openPhotoDialog"
                />
              </div>
            </div>
          </UFormField>

          <div class="space-y-4">
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

          <UAlert
            v-if="backendError"
            color="error"
            variant="soft"
            :title="t('error_title')"
            :description="backendError"
          />
        </div>
      </UCard>

      <div>
        <UButton
          type="submit"
          color="primary"
          size="lg"
          :loading="isLoading"
          class="w-full justify-center"
        >
          {{ t('save') }}
        </UButton>
      </div>
    </form>
  </section>
</template>
