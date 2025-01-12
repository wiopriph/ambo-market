<script setup lang="ts">
import type { GalleryThumbnailsProps } from '~/components/Gallery/Thumbnails/types';


const props = defineProps<GalleryThumbnailsProps>();


const allThumbnailsWidth = computed(() => {
  const THUMBNAIL_WIDTH = 94;
  const THUMBNAIL_MARGIN = 10;

  const numImages = props.images.length;

  return numImages * THUMBNAIL_WIDTH + (numImages - 1) * THUMBNAIL_MARGIN;
});

const thumbnailsRef = ref<HTMLElement | null>(null);

const thumbnailsOffset = computed(() => {
  const currentIndex = props.currentIndex;
  const numImages = props.images.length;

  const containerWidth = thumbnailsRef.value?.offsetWidth || 0;

  const totalOffset = allThumbnailsWidth.value - containerWidth;

  if (totalOffset > 0) {
    const perImageOffset = totalOffset / (numImages - 1);
    const leftOffset = perImageOffset * currentIndex;

    return leftOffset.toFixed(2);
  }

  return '0';
});


const style = useCssModule();

const miniatureClassNames = (index: number) => ({
  [style.thumbnail]: true,
  [style.thumbnailActive]: index === props.currentIndex,
});

const thumbnailsStyles = computed(() => `transform: translate3d(-${thumbnailsOffset.value}px, 0, 0);`);


const emit = defineEmits(['select']);

const setCurrentImage = (index: number) => emit('select', index);
</script>

<template>
  <div :class="$style.root">
    <nav
      ref="thumbnailsRef"
      :style="thumbnailsStyles"
      :class="$style.container"
    >
      <button
        v-for="(image, index) in images"
        :key="index"
        :class="miniatureClassNames(index)"
        type="button"
        @click="setCurrentImage(index)"
      >
        <NuxtImg
          :src="image"
          :class="$style.thumbnailImage"
          :alt="`miniature_${index}`"
        />
      </button>
    </nav>
  </div>
</template>

<style lang="scss" module>
.root {
  overflow: hidden;
}

.container {
  display: flex;
  flex-direction: row;
  transition: all 300ms ease-out 0s;
}

.thumbnail {
  @include ui-button;

  width: 94px;
  min-width: 94px;
  height: 94px;
  padding: 0;

  & + & {
    margin-left: 10px;
  }
}

.thumbnailActive {
  cursor: default;
  opacity: .4;
}

.thumbnailImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
