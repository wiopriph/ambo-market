<script setup lang="ts">
import type { Props } from './types';
import IconEmptyPhoto from '~/assets/images/icon-empty-photo.svg?component';


const props = withDefaults(defineProps<Props>(), {
  size: 50,
});


const isImageLoaded = ref(false);
const isImageError = ref(false);

const iconStyles = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}));

const handleImageLoad = () => {
  isImageLoaded.value = true;
};

const handleImageError = () => {
  // @todo: это не работает при ssr, нужно переписать на https://image.nuxt.com/
  isImageError.value = true;
};
</script>

<template>
  <div :class="$style.root">
    <img
      v-if="props.img && !isImageError"
      :src="props.img"
      :alt="props.name"
      :class="$style.image"
      @load="handleImageLoad"
      @error="handleImageError"
    >

    <IconEmptyPhoto
      v-else
      :style="iconStyles"
      :class="$style.icon"
    />
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: $ui-color-transparent;
}

.icon {
  fill: $ui-color-white;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
