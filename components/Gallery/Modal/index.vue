<script setup lang="ts">
import type { GalleryModalProps } from './types';
import IconClose from '~/assets/images/galley/icon-close.svg?component';
import IconLeftButton from '~/assets/images/galley/icon-left-button.svg?component';
import IconRightButton from '~/assets/images/galley/icon-right-button.svg?component';
import formatCurrency from '~/utils/formatCurrency';
import { POST_STATUSES } from '~/constants/post-statuses';


const props = defineProps<GalleryModalProps>();


const images = computed(() => props.post?.images || []);
const hasThumbnails = computed(() => images.value.length > 1);


const { t } = useI18n();

const currentSlideIndex = ref<number>(0);

const slideCountInfo = computed(() => {
  const currentIndex = currentSlideIndex.value + 1;
  const totalImages = images.value.length;

  return t('of', { first: currentIndex, second: totalImages });
});


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


const hasControlButtons = computed(() => props.post?.status === POST_STATUSES.OPEN);

const formattedPrice = computed(() => formatCurrency(props.post?.price));


const emit = defineEmits([
  'close',
  'closePost',
  'showNumber',
  'createChatRoom',
]);

const closeModal = () => emit('close');
const closePost = () => emit('closePost');
const showNumber = () => emit('showNumber');
const createChatRoom = () => emit('createChatRoom');


const isScrollLocked = ref(false);

const keyDownHandler = (event: KeyboardEvent) => {
  if (event.code.toLowerCase() === 'escape') {
    closeModal();
  }
};

const lockScroll = () => {
  if (!isScrollLocked.value) {
    document.body.classList.add('scroll-locked');
    document.addEventListener('keydown', keyDownHandler);
    isScrollLocked.value = true;
  }
};

const unlockScroll = () => {
  if (isScrollLocked.value) {
    document.body.classList.remove('scroll-locked');
    document.removeEventListener('keydown', keyDownHandler);
    isScrollLocked.value = false;
  }
};

onMounted(lockScroll);
onBeforeUnmount(unlockScroll);
</script>

<i18n>
{
  "en": {
    "contact_seller": "Contact seller",
    "of": "{first} of {second}"
  },
  "pt": {
    "contact_seller": "Contatar vendedor",
    "of": "{first} de {second}"
  }
}
</i18n>

<template>
  <div :class="$style.modal">
    <div :class="$style.wrapper">
      <div :class="$style.main">
        <h2
          :class="$style.title"
          v-text="post.title"
        />

        <button
          :class="$style.exitButton"
          type="button"
          aria-label="Close gallery"
          @click="closeModal"
        >
          <IconClose />
        </button>

        <button
          v-show="hasPrevButton"
          :class="[$style.button, $style.buttonLeft]"
          type="button"
          aria-label="Previous slide"
          @click="prevSlide"
        >
          <IconLeftButton />
        </button>

        <button
          v-show="hasNextButton"
          :class="[$style.button, $style.buttonRight]"
          type="button"
          aria-label="Next slide"
          @click="nextSlide"
        >
          <IconRightButton />
        </button>

        <div
          v-if="hasThumbnails"
          :class="$style.thumbnails"
        >
          <GalleryThumbnails
            :images="images"
            :currentIndex="currentSlideIndex"
            @select="setCurrentImage"
          />
        </div>

        <div
          v-if="hasThumbnails"
          :class="$style.slideInfo"
          v-text="slideCountInfo"
        />

        <div :class="$style.content">
          <div :class="$style.images">
            <swiper-container
              ref="containerRef"
              :class="$style.swiper"
            >
              <swiper-slide
                v-for="(image, index) in images"
                :key="index"
              >
                <NuxtImg
                  :src="image"
                  :alt="`image_${index}`"
                  :class="$style.image"
                  loading="lazy"
                />
              </swiper-slide>
            </swiper-container>
          </div>
        </div>

        <div :class="$style.mobileCard">
          <div :class="$style.mobileCardInfo">
            <span
              :class="$style.mobileCardPrice"
              v-text="formattedPrice"
            />

            <span
              :class="$style.mobileCardTitle"
              v-text="post.title"
            />
          </div>

          <UIButton
            v-if="!isOwner"
            :isLoading="isChatLoading"
            :text="t('contact_seller')"
            :class="$style.mobileCardButton"
            @click="createChatRoom"
          />
        </div>
      </div>

      <div :class="$style.right">
        <span
          :class="$style.price"
          v-text="formattedPrice"
        />

        <ProductControls
          v-if="hasControlButtons"
          :phoneNumber="phoneNumber"
          :isOwner="isOwner"
          :isSafeDeal="isSafeDeal"
          :isNumberLoading="isNumberLoading"
          :isChatLoading="isChatLoading"
          :isClosePostLoading="isClosePostLoading"
          :class="$style.contacts"
          @close-post="closePost"
          @show-number="showNumber"
          @create-chat-room="createChatRoom"
        />

        <UserInfo
          :user="seller"
          :class="$style.profileInfo"
        />

        <AD
          :class="$style.ad"
          type="vertical"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
$blurred-background: rgba(51, 51, 51, .8);

.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: $z-idx-modal;
  background: rgba($ui-color-black, .9);
}

.wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}

$column-width: 400px;

.main {
  position: relative;
  flex-grow: 1;
  background-color: $ui-color-text-main;

  @include md {
    width: 100%;
  }

  @include exclude-md {
    width: calc(100% - $column-width);
  }
}

.right {
  width: $column-width;
  overflow: auto;
  background-color: $ui-color-white;
  border: 1px solid $ui-color-transparent;

  @include md {
    display: none;
  }

  @include exclude-md {
    margin-right: 10px;
    padding: 30px 20px 20px;
  }
}

.price {
  @include ui-typo-36-bold;
}

.contacts {
  display: flex;
  margin-top: 20px;

  @include exclude-md {
    flex-direction: column;
  }

  @include md {
    flex-direction: row;
  }
}

.profileInfo {
  margin-top: 20px;
}

.ad {
  margin-top: 20px;
}

.title {
  @include ui-typo-32-medium;

  position: absolute;
  top: 24px;
  right: 80px;
  left: 80px;
  height: 40px;
  overflow: hidden;
  color: $ui-color-white;
  white-space: nowrap;
  text-align: center;
  text-overflow: ellipsis;

  @include md {
    display: none;
  }
}

.exitButton {
  @include ui-button;

  position: absolute;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: $ui-color-white;
  opacity: .6;
  transition: opacity .2s linear;

  &:hover {
    opacity: 1;
  }

  svg {
    width: 100%;
    height: 100%;
  }

  @include md {
    top: 4px;
    left: 4px;
    z-index: $z-idx-main;
    width: 36px;
    height: 36px;
  }

  @include exclude-md {
    top: 16px;
    left: 16px;
    width: 48px;
    height: 48px;
  }
}

.slideInfo {
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 44px;
  color: $ui-color-white;
  user-select: none;

  @include md {
    top: 0;
    z-index: 2;
    background-color: $blurred-background;
  }

  @include exclude-md {
    bottom: 100px;
  }
}

.button {
  @include ui-button;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: rgba($ui-color-black, .2);
  transform: translateY(-50%);

  @include md {
    display: none;
  }

  svg {
    flex-shrink: 0;
  }
}

.buttonRight {
  position: absolute;
  top: 50%;
  right: 0;
  z-index: $z-idx-main;
}

.buttonLeft {
  position: absolute;
  top: 50%;
  left: 0;
  z-index: $z-idx-main;
}

.buttonHide {
  display: none !important;
  opacity: 0;
}

.content {
  width: 100%;
  height: 100%;

  @include md {
    padding: 36px 0;
  }

  @include exclude-md {
    padding: 80px 80px 140px;
  }
}

.thumbnails {
  position: absolute;
  right: 0;
  bottom: 8px;
  left: 0;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;

  @include md {
    display: none;
  }
}

.images {
  width: 100%;
  height: 100%;
}

.swiper {
  height: 100%;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
}

.mobileCard {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: $blurred-background;

  @include exclude-md {
    display: none;
  }
}

$button-width: 140px;

.mobileCardButton {
  width: $button-width;
}

.mobileCardInfo {
  display: flex;
  flex-direction: column;
  width: calc(100% - $button-width);
  color: $ui-color-white;
}

.mobileCardPrice {
  @include ui-typo-18-bold;

  overflow: hidden;
  white-space: nowrap;
  text-decoration: none;
  text-overflow: ellipsis;
}

.mobileCardTitle {
  margin-top: 4px;
  overflow: hidden;
  white-space: nowrap;
  text-decoration: none;
  text-overflow: ellipsis;
}
</style>
