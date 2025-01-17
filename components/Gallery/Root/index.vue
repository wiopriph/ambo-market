<script setup lang="ts">
import type { GalleryRootProps } from './types';
import IconLeftButton from '~/assets/images/galley/icon-left-button.svg?component';
import IconRightButton from '~/assets/images/galley/icon-right-button.svg?component';
import { POST_STATUSES } from '~/constants/post-statuses';


const props = defineProps<GalleryRootProps>();

const images = computed(() => props.images || []);
const hasThumbnails = computed(() => images.value.length > 1);


const currentSlideIndex = ref<number>(0);

const slideCountInfo = computed(() => {
  const currentIndex = currentSlideIndex.value + 1;
  const totalImages = images.value.length;

  return `${currentIndex} / ${totalImages}`;
});

const emit = defineEmits(['openModal']);

const openPopup = () => emit('openModal', currentSlideIndex.value);

const isOpenPost = computed(() => props.status === POST_STATUSES.OPEN);

const containerRef = ref(null);
const swiper = useSwiper(containerRef);

onMounted(() => {
  swiper.instance.value?.on('slideChange', () => {
    currentSlideIndex.value = swiper.instance.value?.activeIndex || 0;
  });
});

const hasPrevButton = computed(() => currentSlideIndex.value > 0);
const hasNextButton = computed(() => currentSlideIndex.value < images.value.length - 1);

const setCurrentImage = (index: number) => swiper.to(index);
const nextSlide = () => swiper.next();
const prevSlide = () => swiper.prev();
</script>

<template>
  <div>
    <div :class="$style.gallery">
      <div :class="$style.wrapper">
        <swiper-container
          ref="containerRef"
          :class="$style.swiper"
        >
          <swiper-slide
            v-for="(image, index) in images"
            :key="index"
            @click="openPopup"
          >
            <NuxtImg
              :src="image"
              :alt="`image_${index}_blurred`"
              :class="$style.blurredImage"
              loading="lazy"
            />

            <NuxtImg
              :src="image"
              :alt="`image_${index}`"
              :class="$style.slide"
              loading="lazy"
            />
          </swiper-slide>
        </swiper-container>
      </div>

      <button
        v-show="hasPrevButton"
        :class="[$style.button, $style.buttonLeft]"
        type="button"
        aria-label="Previous slide"
        @click="prevSlide"
      >
        <IconLeftButton :class="$style.buttonIcon" />
      </button>

      <button
        v-show="hasNextButton"
        :class="[$style.button, $style.buttonRight]"
        type="button"
        aria-label="Next slide"
        @click="nextSlide"
      >
        <IconRightButton :class="$style.buttonIcon" />
      </button>

      <ProductStatus
        v-if="!isOpenPost"
        :status="status"
        :class="$style.status"
      />

      <span
        v-if="hasThumbnails"
        :class="$style.slideCount"
        v-text="slideCountInfo"
      />
    </div>

    <LazyGalleryThumbnails
      v-if="hasThumbnails"
      :currentIndex="currentSlideIndex"
      :images="images"
      :class="$style.thumbnails"
      @select="setCurrentImage"
    />
  </div>
</template>

<style lang="scss" module>
.gallery {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  overflow: hidden;
}

.wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.swiper {
  z-index: 0;
  height: 100%;
  user-select: none;
}

.blurredImage {
  @include ui-round-ui-elements;

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: $z-idx-under;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  filter: blur(13px);
  opacity: .4;
}

.slide {
  width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
}

.button {
  @include ui-button;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: rgba($ui-color-black, .5);
  transform: translateY(-50%);
  backdrop-filter: blur(1px);

  @include md {
    display: none;
  }
}

.buttonIcon {
  flex-shrink: 0;
}

.buttonRight {
  position: absolute;
  top: 50%;
  right: 10px;
  z-index: $z-idx-main;
}

.buttonLeft {
  position: absolute;
  top: 50%;
  left: 10px;
  z-index: $z-idx-main;
}

.buttonHide {
  display: none !important;
  opacity: 0;
}

.thumbnails {
  margin-top: 10px;
  margin-bottom: 10px;

  @include md {
    display: none;
  }
}

.status {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: $z-idx-main;
}

.slideCount {
  @include ui-round-ui-elements;
  @include ui-typo-12;

  position: absolute;
  bottom: 10px;
  z-index: $z-idx-main;
  padding: 4px;
  color: $ui-color-white;
  background-color: rgba($ui-color-black, .5);
  backdrop-filter: blur(1px);

  @include exclude-md {
    right: 10px;
  }

  @include md {
    left: 10px;
  }
}
</style>
