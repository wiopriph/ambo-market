<script setup lang="ts">
import IconLocation from '~/assets/images/header/icon-location.svg?component';
import { getLabelByRadius } from '~/constants/distance';
import { usePosts } from '~/composables/usePosts';


const { t } = useI18n();

const { coords, locationName } = usePosts();

const hasRadius = computed(() => locationName.value && coords.value.radius);
const selectedRadiusLabel = computed(() => getLabelByRadius(`${coords.value?.radius || ''}`));

const locationNameOrDefault = computed(() => locationName.value || t('everywhere'));


const emit = defineEmits(['click']);

const click = () => {
  emit('click');
};
</script>

<i18n>
{
  "en": {
    "location": "Location:",
    "everywhere": "Everywhere"
  },
  "pt": {
    "location": "Localização:",
    "everywhere": "Em todos os lugares"
  }
}
</i18n>

<template>
  <button
    :class="$style.root"
    type="button"
    @click.prevent="click"
  >
    <span
      :class="$style.text"
      v-text="t('location')"
    />

    <IconLocation :class="$style.icon" />

    <span
      :class="$style.locationName"
      v-text="locationNameOrDefault"
    />

    <span
      v-if="hasRadius"
      :class="$style.radius"
    >, +{{ selectedRadiusLabel }}</span>
  </button>
</template>

<style lang="scss" module>
.root {
  @include ui-button;

  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 44px;
  padding: 10px 20px;
  color: $ui-color-black;
}

.text {
  margin-right: 10px;
  color: $ui-color-text-main;
}

.icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

.locationName {
  overflow: hidden;
  color: $ui-color-black;
  white-space: nowrap;
  text-decoration: underline;
  text-overflow: ellipsis;
}

.radius {
  white-space: nowrap;
}
</style>
