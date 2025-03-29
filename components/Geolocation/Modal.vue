<script setup lang="ts">
import { CITIES, getCityIdByName } from '~/constants/cities';
import { usePosts } from '~/composables/usePosts';
import type { Location } from '~/composables/usePosts/types';


const emit = defineEmits(['close']);

const closeModal = () => emit('close');


const { t } = useI18n();

const modesList = computed(() => [
  { title: t('cities'), name: 'cities' },
  { title: t('map'), name: 'map' },
]);

const viewMode = ref<string>('cities');

const setMode = (mode: string) => {
  viewMode.value = mode;
};

const style = useCssModule();

const getButtonClassNames = (name: string) => ({
  [style.mode]: true,
  [style.activeMode]: viewMode.value === name,
});

const citiesList = computed(() => CITIES.map(city => ({
  id: city.id,
  name: city.name,
  route: {
    name: 'cityId',
    params: {
      cityId: city.id,
    },
  },
})));


const currentLocation = ref<Location | null>(null);

const setLocation = (payload: Location) => {
  currentLocation.value = payload;
};

const { setLocationInfo } = usePosts();

const route = useRoute();

const save = () => {
  if (currentLocation.value) {
    setLocationInfo(currentLocation.value);

    const cityId = getCityIdByName(currentLocation.value?.city);

    if (cityId && cityId !== route.params.cityId) {
      navigateTo({ name: 'cityId', params: { cityId } });
    }
  }

  closeModal();
};
</script>

<i18n>
{
  "en": {
    "location": "Location",
    "map": "Map",
    "cities": "Cities",
    "cancel": "Cancel",
    "ok": "OK"
  },
  "pt": {
    "location": "Localização",
    "map": "Mapa",
    "cities": "Cidades",
    "cancel": "Cancelar",
    "ok": "OK"
  }
}
</i18n>

<template>
  <UIModal
    :title="t('location')"
    maxWidth="900px"
    @close="closeModal"
  >
    <div :class="$style.root">
      <div :class="$style.header">
        <ul :class="$style.modesList">
          <li
            v-for="mode in modesList"
            :key="mode.name"
            :class="getButtonClassNames(mode.name)"
          >
            <button
              :class="$style.modeButton"
              type="button"
              @click="setMode(mode.name)"
              v-text="mode.title"
            />
          </li>
        </ul>
      </div>

      <template v-if="viewMode === 'map'">
        <LazyGeolocationSelector
          :class="$style.map"
          @select="setLocation"
        />

        <ul :class="$style.footer">
          <li :class="$style.footerButton">
            <UIButton
              :text="t('cancel')"
              :class="$style.button"
              type="secondary"
              @click="closeModal"
            />
          </li>

          <li :class="$style.footerButton">
            <UIButton
              :text="t('ok')"
              :class="$style.button"
              @click="save"
            />
          </li>
        </ul>
      </template>

      <ul
        v-if="viewMode === 'cities'"
        :class="$style.list"
      >
        <li
          v-for="city in citiesList"
          :key="city.id"
          :class="$style.item"
        >
          <NuxtLink
            :to="city.route"
            :class="$style.link"
            @click="closeModal"
          >
            {{ city.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </UIModal>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: column;

  @include md {
    height: calc(100% - 44px);
  }

  @include exclude-md {
    height: 640px;
  }
}

.header {
  padding: 15px 20px 0;
  border-bottom: 1px solid $ui-color-transparent;
}

.modesList {
  display: flex;
  flex-direction: row;
  margin-bottom: -1px;
}

.mode {

  & + & {
    margin-left: 16px;
  }
}

.activeMode {
  z-index: 11;
  border-bottom: 2px solid $ui-color-blue;
}

.modeButton {
  @include ui-button;

  padding-bottom: 8px;
}

.map {
  flex: 1 1;
}

.footer {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  padding: 0 15px 20px;
}

.footerButton {
  width: 50%;
  margin: 0 5px;
}

.button {
  width: 100%;
}

.list {
  padding: 20px;
}

.item {

  & + & {
    margin-top: 20px;
  }
}

.link {
  text-decoration: none;
}
</style>
