export interface Props {
  modelValue: string | number;
  name?: string;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  errors?: string[];
}
