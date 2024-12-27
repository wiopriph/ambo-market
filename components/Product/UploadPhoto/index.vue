<script setup lang="ts">
import type { ProductUploadPhotoProps } from './types';
import IconCamera from '~/assets/images/create/icon-camera.svg?component';
import IconClose from '~/assets/images/create/icon-close.svg?component';


const props = withDefaults(defineProps<ProductUploadPhotoProps>(), {
  image: '',
});


const styles = useCssModule();

const rootClassNames = computed(() => ({
  [styles.root]: true,
  [styles.empty]: !props.image,
}));


const emit = defineEmits(['delete']);

const deleteProto = () => {
  emit('delete');
};
</script>

<template>
  <div :class="rootClassNames">
    <img
      v-if="image"
      :src="image"
      :class="$style.image"
      alt="Preview"
    >

    <div
      v-else
      :class="$style.add"
    >
      <IconCamera :class="$style.addIcon" />
    </div>

    <button
      v-if="image"
      :class="$style.closeButton"
      type="button"
      @click="deleteProto"
    >
      <IconClose :class="$style.closeIcon" />
    </button>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-round-ui-elements;

  position: relative;
  background: #F9F9F9;
  cursor: pointer;

  &::before {
    display: block;
    padding-bottom: 100%;
    content: '';
  }
}

.empty {
  border: 1px dashed $ui-color-transparent;
}

.add {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(0px, -50%);
}

.addIcon {
  width: 100%;
  max-width: 48px;
  height: 100%;
  max-height: 48px;
}

.image {
  @include ui-round-ui-elements;

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.closeButton {
  @include ui-button;

  position: absolute;
  top: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: $ui-color-white;
  box-shadow: $box-shadow;

  @include exclude-md {
    display: none;

    .root:hover & {
      display: flex;
    }
  }

  @include md {
    display: flex;
  }
}

.closeIcon {
  width: 18px;
  height: 18px;
}
</style>
