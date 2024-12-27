export interface Option {
  text: string;
  value: string;
}

export interface Props {
  modelValue: string;
  options: Option[];
  label?: string;
  sort?: boolean;
  isRequired?: boolean;
  placeholder?: string;
  isDisabled?: boolean;
  error?: string;
}
