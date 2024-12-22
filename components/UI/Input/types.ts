export interface InputProps {
  modelValue: string | number;
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isSuccess?: boolean;
  error?: string | null;
}
