<script setup lang="ts">
import type { Props } from './types';
import IconUserAvatar from '~/assets/images/profile/icon-user-avatar.svg?component';


const props = withDefaults(defineProps<Props>(), {
  size: 36,
});

const emit = defineEmits<{(event_: 'upload', data: { base64: string; mimeType: string }): void; }>();


const isImageLoaded = ref(false);
const isImageError = ref(false);


const rootStyles = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}));


function handleImageLoad() {
  isImageLoaded.value = true;
}

function handleImageError() {
  isImageError.value = true;
}

const fileInputRef = ref<HTMLInputElement | null>(null);

function openFileInput() {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
}

function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (event_) => {
      emit('upload', {
        base64: (event_.target as FileReader).result as string,
        mimeType: file.type,
      });
    };

    reader.readAsDataURL(file);
  }
}
</script>

<template>
  <div
    :style="rootStyles"
    :class="$style.root"
  >
    <img
      v-if="img && !isImageError"
      :src="img"
      :alt="name"
      :class="$style.image"
      @load="handleImageLoad"
      @error="handleImageError"
    >

    <IconUserAvatar
      v-else
      :class="$style.icon"
    />

    <template v-if="uploadable">
      <input
        ref="fileInputRef"
        type="file"
        style="display: none;"
        @change="handleFileUpload"
      >

      <button
        :class="$style.button"
        type="button"
        @click="openFileInput"
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 16 16"
        >
          <path
            fill="#FFFFFF"
            fill-rule="evenodd"
            d="M5 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h.436c.892 0 1.215.093 1.54.267.327.174.583.43.757.756.174.326.267.65.267 1.54v4.873c0 .892-.093 1.215-.267 1.54a1.81 1.81 0 0 1-.756.757c-.326.174-.65.267-1.54.267H4.563c-.892 0-1.215-.093-1.54-.267a1.817 1.817 0 0 1-.757-.756c-.174-.326-.267-.65-.267-1.54V5.563c0-.892.093-1.215.267-1.54a1.81 1.81 0 0 1 .756-.757c.326-.174.65-.267 1.54-.267H5zm3 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-1a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
          />
        </svg>
      </button>
    </template>
  </div>
</template>

<style lang="scss" module>
.root {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid $ui-color-blue;
  border-radius: 50%;
}

.icon {
  width: 100%;
  height: 100%;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.button {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  background-color: rgba(51, 51, 51, .7);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0;
  transition: opacity .2s;
}

.root:hover .button {
  opacity: 1;
}
</style>
