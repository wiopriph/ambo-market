<script setup lang="ts">
import type { Props } from './types';
import IconClose from '~/assets/images/header/icon-close.svg?component';


const { isDesktopOrTablet } = useDevice();

const props = withDefaults(defineProps<Props>(), {
  maxWidth: '992px',
  title: '',
});


const rootStyles = computed(() => ({
  'max-width': isDesktopOrTablet ? props.maxWidth : 'auto',
}));


const emit = defineEmits(['close']);

const closeModal = () => {
  unlockScroll();
  emit('close');
};

const keyDownHandler = (event: KeyboardEvent) => {
  if (event.code.toLowerCase() === 'escape') {
    closeModal();
  }
};


const isScrollLocked = ref(false);

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

<template>
  <Teleport to="body">
    <div
      :class="$style.modal"
      @click.self="closeModal"
    >
      <div :class="$style.wrapper">
        <div
          :class="$style.content"
          :style="rootStyles"
        >
          <div :class="$style.mobileHeader">
            <button
              :class="$style.button"
              type="button"
              @click="closeModal"
            >
              <IconClose :class="$style.icon" />
            </button>

            <span
              :class="$style.title"
              v-text="title"
            />

            <div :class="$style.button" />
          </div>

          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" module>
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: $z-idx-modal;
  overflow: auto;
  background: rgba($ui-color-black, .9);
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 100%;
  pointer-events: none;

  @include exclude-md {
    padding: 15px;
  }
}

.content {
  position: relative;
  width: 100%;
  max-width: 992px;
  margin: 0 auto;
  overflow: hidden;
  background-color: $ui-color-white;
  pointer-events: auto;

  @include md {
    height: 100%;
  }

  @include exclude-md {
    @include ui-round-content-blocks;
  }
}

.mobileHeader {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 20px;
  background-color: #FAFAFA;

  @include exclude-md {
    display: none;
  }
}

.title {
  @include ui-typo-15-medium;
  text-transform: uppercase;
}

.button {
  @include ui-button;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
}

.icon {
  width: 100%;
  height: 100%;
}
</style>
