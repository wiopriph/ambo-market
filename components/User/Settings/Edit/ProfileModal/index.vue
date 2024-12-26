<script setup lang="ts">
import type { UserSettingsEditProfileProps } from './types';
import { useUser } from '~/composables/useUser';


const props = withDefaults(defineProps<UserSettingsEditProfileProps>(), {
  name: '',
  photoUrl: '',
});

const { t } = useI18n();

const innerName = ref(props.name);
const formattedName = computed(() => innerName.value || t('your_name'));


const innerPhotoUrl = ref(props.photoUrl);
const uploadedPhoto = ref('');

const isLoading = ref(false);
const backendError = ref('');


const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};


const handleFileUpload = (imgObj) => {
  uploadedPhoto.value = imgObj;
  innerPhotoUrl.value = imgObj.base64;
};

const { updateProfile } = useUser();

const saveProfileInformation = async () => {
  backendError.value = '';

  try {
    isLoading.value = true;

    await updateProfile({
      image: uploadedPhoto.value,
      displayName: innerName.value,
    });

    closeModal();
  } catch (error) {
    backendError.value = error?.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<i18n>
{
  "en": {
    "profile": "Profile",
    "your_name": "Your name",
    "name": "Name"
  },
  "pt": {
    "profile": "Perfil",
    "your_name": "Seu nome",
    "name": "Nome"
  }
}
</i18n>

<template>
  <UIModal
    :title="t('profile')"
    maxWidth="500px"
    @close="closeModal"
  >
    <div :class="$style.root">
      <div :class="$style.avatar">
        <UIAvatar
          :size="95"
          :img="innerPhotoUrl"
          :name="formattedName"
          uploadable
          @upload="handleFileUpload"
        />
      </div>

      <h2
        :class="$style.title"
        v-text="formattedName"
      />

      <div :class="$style.list">
        <UIInput
          v-model="innerName"
          :placeholder="t('name')"
          name="name"
          type="text"
        />
      </div>

      <UIError :text="backendError" />

      <UIButton
        :text="t('save')"
        :isDisabled="!innerName"
        :isLoading="isLoading"
        :class="$style.button"
        @click="saveProfileInformation"
      />
    </div>
  </UIModal>
</template>

<style lang="scss" module>
.root {
  padding: 20px;
}

.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  @include ui-typo-24-bold;

  margin-top: 30px;
  text-align: center;
}

.list {
  margin-top: 20px;
}

.button {
  width: 100%;
  margin-top: 30px;
}
</style>
