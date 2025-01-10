<script setup lang="ts">
import type { GeolocationSelectorProps } from './types';
import { DISTANCE, getLabelByRadius } from '~/constants/distance';
import { usePosts } from '~/composables/usePosts';
import { useOpenStreetMap } from '~/composables/useOpenStreetMap';
import IconGeo from '~/assets/images/icon-geo.svg?component';


const DEFAULT_COORDINATES = [-8.8272699, 13.2439512];


const props = withDefaults(defineProps<GeolocationSelectorProps>(), {
  hideRadius: false,
});

const { t } = useI18n();


const latitude = ref<number>(DEFAULT_COORDINATES[0]);
const longitude = ref<number>(DEFAULT_COORDINATES[1]);


const radius = ref<string>('');
const selectedRadiusLabel = computed(() => getLabelByRadius(radius.value));


const selectedLocation = ref({});

const isLoading = ref(false);

const searchQuery = ref('');


const setCoordinates = (lat: number, lon: number) => {
  latitude.value = lat;
  longitude.value = lon;
};

const getCurrentLocation = async () => {
  if (!navigator.geolocation) {
    return;
  }

  try {
    isLoading.value = true;

    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;

    await fetchLocationInfo({ latitude, longitude });
  } catch (error) {
    console.error('Error determining current location:', error);

    await fetchLocationInfo({
      latitude: DEFAULT_COORDINATES[0],
      longitude: DEFAULT_COORDINATES[1],
    });
  } finally {
    isLoading.value = false;
  }
};


const emit = defineEmits(['select']);

const { getCityByGeo, searchCity } = useOpenStreetMap();

const fetchLocationInfo = async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
  isLoading.value = true;

  setCoordinates(latitude, longitude);

  try {
    const city = await getCityByGeo({ latitude, longitude });

    selectedLocation.value = {
      ...city,
      radius: radius.value,
    };

    emit('select', selectedLocation.value);
  } catch (error) {
    console.error('Error fetching location info:', error);
  } finally {
    isLoading.value = false;
  }
};

const searchForCity = async () => {
  try {
    isLoading.value = true;

    const firstCity = await searchCity(searchQuery.value);

    selectedLocation.value = {
      ...firstCity,
      radius: radius.value,
    };

    setCoordinates(firstCity?.lat, firstCity?.lon);

    emit('select', selectedLocation.value);
  } catch (error) {
    console.error('Error searching for city:', error);
  } finally {
    isLoading.value = false;
  }
};

const updateRadius = (value: string) => {
  radius.value = value;

  emit('select', {
    ...selectedLocation.value,
    radius: value,
  });
};


const { coords } = usePosts();

onMounted(() => {
  radius.value = coords.value?.radius ? `${coords.value.radius}` : '';

  if (coords.value.latitude && coords.value.longitude) {
    fetchLocationInfo({ latitude: coords.value.latitude, longitude: coords.value.longitude });
  } else {
    getCurrentLocation();
  }
});

const MAP_CONFIG = {
  OPTIONS: { zoomControl: false },
  URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
};


const zoom = ref<number>(15);

const zoomUpdated = (value: number) => {
  zoom.value = value;
};


const bounds = ref<number | null>(null);

const boundsUpdated = (value: number) => {
  bounds.value = value;
};

const handleMapClick = ({ latlng }) => {
  fetchLocationInfo({
    latitude: latlng.lat,
    longitude: latlng.lng,
  });
};
</script>

<i18n lang="json">
{
  "en": {
    "search": "Search",
    "select_location": "Select the location where you want to find the item, you can change the search radius",
    "radius": "Radius"
  },
  "pt": {
    "search": "Buscar",
    "select_location": "Selecione a localização onde deseja encontrar o item, você pode alterar o raio de pesquisa",
    "radius": "Raio"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <div :class="$style.search">
      <UIInput
        v-model="searchQuery"
        :placeholder="t('search')"
        :class="$style.searchInput"
        name="search"
        type="text"
      />

      <UIButton
        :text="t('search')"
        type="secondary"
        @click="searchForCity"
      />
    </div>

    <div :class="$style.map">
      <LMap
        :useGlobalLeaflet="false"
        :zoom="zoom"
        :center="[latitude, longitude]"
        :options="MAP_CONFIG.OPTIONS"
        @click="handleMapClick"
        @update:zoom="zoomUpdated"
        @update:bounds="boundsUpdated"
      >
        <LTileLayer :url="MAP_CONFIG.URL" />

        <LMarker :latLng="[latitude, longitude]" />

        <LControlZoom position="bottomright" />

        <LControl
          position="bottomright"
          :class="$style.mapControl"
        >
          <button
            :class="$style.mapButton"
            @click="getCurrentLocation"
          >
            <IconGeo />
          </button>
        </LControl>

        <LCircle
          v-if="radius"
          :latLng="[latitude, longitude]"
          :radius="+radius"
        />
      </LMap>

      <div
        v-if="isLoading"
        :class="$style.loadingOverlay"
      />
    </div>

    <div
      v-if="!props.hideRadius"
      :class="$style.radius"
    >
      <div :class="$style.desktopRadius">
        <span
          :class="$style.desktopRadiusDescription"
          v-text="t('select_location')"
        />

        <div :class="$style.desktopRadius">
          <span
            :class="$style.desktopRadiusText"
            v-text="t('radius')"
          />

          <UITabs
            v-model="radius"
            :options="DISTANCE"
            @input="updateRadius"
          />
        </div>
      </div>

      <div :class="$style.mobileRadius">
        <UIRangeSlider
          v-model="radius"
          :values="DISTANCE"
          :class="$style.mobileRadiusSlider"
          hideLabel
          @change="updateRadius"
        />

        <div :class="$style.mobileRadiusText">
          {{ t('radius') }}: {{ selectedRadiusLabel }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  position: relative;
  display: flex;
  flex-direction: column;
}

.search {
  position: absolute;
  top: 10px;
  left: 20px;
  z-index: 1001;
  display: flex;
  width: 100%;
  max-width: calc(100% - 40px);
  margin-bottom: 0;
}

.radius {
  margin: 20px;

  @include sm {
    margin: 10px 20px;
  }
}

.desktopRadius {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  @include sm {
    display: none;
  }
}

.desktopRadiusDescription {
  @include ui-typo-12;

  max-width: 320px;
  margin-right: 10px;
  color: $ui-color-text-main;
}

.desktopRadiusText {
  @include ui-typo-14;

  margin-right: 10px;
}

.mobileRadius {
  display: flex;
  flex-direction: column;
  align-items: center;

  @include exclude-md {
    display: none;
  }
}

.mobileRadiusSlider {
  margin: 0;
}

.mobileRadiusText {
  margin-top: 10px;
}

.searchInput {
  margin-right: 4px;
}

.map {
  position: relative;
  flex: 1 1;
}

.loadingOverlay {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, .8);
}

.mapButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  background: #FFFFFF;
  border: none;
  border-radius: 2px;

  &:hover {
    background-color: #F4F4F4;
    cursor: pointer;
  }
}

.mapControl {
  width: 34px;
  height: 34px;
  border: 2px solid rgba(0, 0, 0, .2);
  border-radius: 4px;
}
</style>
