export type SelectSize  = 'sm' | 'md' | 'lg';
export type SelectColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}
