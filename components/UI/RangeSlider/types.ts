export interface SliderValue {
  value: string | number;
  label: string;
}

export interface UIRangeSliderProps {
  modelValue: string,
  values?: SliderValue[],
  min?: string,
  max?: string,
  step?: string,
  hideLabel?: boolean,
}
