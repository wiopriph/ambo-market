<script setup lang="ts">
import type { SliderValue, UIRangeSliderProps } from './types';


const props = withDefaults(defineProps<UIRangeSliderProps>(), {
  modelValue: '',
  values: () => [],
  min: '0',
  max: '100',
  step: '1',
  hideLabel: false,
});


const sliderValues = ref<SliderValue[]>([]);
const sliderValue = ref<string | number>('');

const sliderLabel = computed(() => {
  if (sliderValues.value.length > 0) {
    return sliderValues.value[Number(sliderValue.value) - 1]?.label;
  }

  return sliderValue.value;
});

const sliderOutputValue = computed(() => {
  if (sliderValues.value.length > 0) {
    return sliderValues.value[Number(sliderValue.value) - 1]?.value;
  }

  return sliderValue.value;
});


const sliderWidth = ref(0);
const sliderMax = ref<string | number>('');
const sliderMin = ref<string | number>('');

const positionStyle = computed(() => {
  const val = Number(sliderValue.value);
  const width = sliderWidth.value - 20;
  const percent = (val - Number(sliderMin.value)) / (Number(sliderMax.value) - Number(sliderMin.value));
  const offset = -2;

  return { left: `${width * percent + offset}px` };
});

const changeValues = () => {
  if (props.values.length > 0) {
    sliderValues.value = props.values;
    sliderMin.value = 1;
    sliderMax.value = props.values.length;

    const index = props.values.findIndex(item => item.value === props.modelValue);

    sliderValue.value = index !== -1 ? index + 1 : '';
  } else {
    sliderMin.value = props.min;
    sliderMax.value = props.max;
    sliderValue.value = props.modelValue;
  }

  update();
};


const emit = defineEmits(['update:modelValue', 'change']);

const update = () => {
  emit('update:modelValue', sliderOutputValue.value);
};

const change = () => {
  emit('change', sliderOutputValue.value);
};

const click = (event: Event) => {
  if (sliderValue.value === '') {
    sliderValue.value = (event.target as HTMLInputElement).value;
    update();
  }
};


const sliderRef = ref<HTMLInputElement | null>(null);

const resizeHandler = () => {
  if (sliderRef.value) {
    sliderWidth.value = sliderRef.value.clientWidth;
  }
};

watch(() => props.values, changeValues, { immediate: true });
watch(() => props.modelValue, changeValues, { immediate: true });


const isMounted = ref<boolean>(false);

onMounted(() => {
  changeValues();

  nextTick(() => resizeHandler());

  window.addEventListener('resize', resizeHandler);
  isMounted.value = true;
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler);
});
</script>

<template>
  <div :class="$style.slider">
    <div :class="$style.wrapper">
      <div
        v-if="!hideLabel && isMounted"
        :style="positionStyle"
        :class="$style.label"
        v-text="sliderLabel"
      />

      <div :class="$style.track" />

      <input
        ref="sliderRef"
        v-model="sliderValue"
        :max="sliderMax"
        :min="sliderMin"
        :step="step"
        :class="$style.input"
        type="range"
        @input="update"
        @change="change"
        @click="click"
      >
    </div>
  </div>
</template>

<style lang="scss" module>
.slider {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.label {
  @include ui-round-ui-elements;
  @include ui-typo-12;

  position: absolute;
  top: -23px;
  margin-left: 1em;
  min-width: 30px;
  font-weight: bold;
  padding: 3px 6px;
  text-align: center;
  background: $ui-color-white;
  color: $ui-color-black;
  box-shadow: 0 10px 20px -5px rgba(45, 45, 45, 0.25);
  white-space: nowrap;
  transform: translateX(-50%);

  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    height: 0;
    width: 0;
    left: 0;
    right: 0;
    margin: auto;
    border: 5px solid transparent;
    border-top-color: $ui-color-white;
  }
}

.track {
  width: 100%;
  position: absolute;
  z-index: 0;
  height: 3px;
  background: $ui-color-transparent;
}


$thumb-size: 20px;

.input {
  -webkit-appearance: none;
  margin: 10px 0;
  width: 100%;
  background: none;
  padding: 0;
  z-index: 1;
  position: relative;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 10px;
    cursor: pointer;
    background: transparent;
    border-radius: 0;
    border: none;
  }

  &::-webkit-slider-thumb {
    height: $thumb-size;
    width: $thumb-size;
    border-radius: 50%;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -5px;
    background-color: $ui-color-white;
    box-shadow: inset 0 0 0 3px $ui-color-blue;
  }

  &::-moz-range-thumb {
    height: $thumb-size;
    width: $thumb-size;
    border-radius: 50%;
    background-color: $ui-color-white;
    box-shadow: inset 0 0 0 3px $ui-color-blue;
    cursor: pointer;
    border: none;
  }

  &::-ms-thumb {
    height: $thumb-size;
    width: $thumb-size;
    border-radius: 50%;
    background-color: $ui-color-white;
    box-shadow: inset 0 0 0 3px $ui-color-blue;

    cursor: pointer;
  }

  &:focus::-webkit-slider-runnable-track {
    background: transparent;
  }

  &::-moz-range-track {
    width: 100%;
    height: 10px;
    cursor: pointer;
    background: transparent;
    border-radius: 0;
  }

  &::-ms-track {
    width: 100%;
    height: 10px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    border-width: 10px 0;
    border-radius: 0;
    color: transparent;
  }

  &::-ms-fill-lower {
    background: transparent;
    border: none;
    border-radius: 0;
  }

  &::-ms-fill-upper {
    background: transparent;
    border: none;
    border-radius: 0;
  }
}
</style>
