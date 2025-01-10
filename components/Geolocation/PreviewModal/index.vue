<script setup lang="ts">
import type { GeolocationPreviewModalProps } from './types';


const MAP_CONFIG = {
  OPTIONS: { zoomControl: false },
  URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
};

const props = defineProps<GeolocationPreviewModalProps>();


const markerLatLng = computed<[number, number]>(() => [props.latitude, props.longitude]);


const zoom = ref<number>(15);

const zoomUpdated = (value: number) => {
  zoom.value = value;
};


const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<template>
  <UIModal
    :title="displayName"
    maxWidth="800px"
    @close="closeModal"
  >
    <div :class="$style.map">
      <LMap
        :useGlobalLeaflet="false"
        :zoom="zoom"
        :center="markerLatLng"
        :options="MAP_CONFIG.OPTIONS"
        @update:zoom="zoomUpdated"
      >
        <LTileLayer :url="MAP_CONFIG.URL" />

        <LMarker :latLng="markerLatLng" />

        <LControlZoom position="bottomright" />
      </LMap>
    </div>
  </UIModal>
</template>

<style lang="scss" module>
.map {
  flex: 1 1;

  @include md {
    height: calc(100% - 44px);
  }

  @include exclude-md {
    height: 640px;
  }
}
</style>
