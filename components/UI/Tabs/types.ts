export interface Option {
  value: string | number;
  label: string;
}

export interface Props {
  modelValue: string | number;
  options: Option[];
}
