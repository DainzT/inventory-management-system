export interface SelectFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  disabled?: boolean;
  error: string;
}
