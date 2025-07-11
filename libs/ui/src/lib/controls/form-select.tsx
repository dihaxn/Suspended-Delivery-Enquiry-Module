import { Select } from '@radix-ui/themes';
import { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from './form-field';

interface SelectItem {
  value: string;
  label: string;
  // disabled?: boolean;
}
export interface SelectProps {
  label: string;
  name: string;
  type?: any;
  required?: string | boolean;
  icon?: string;
  size?: '1' | '2' | '3';
  data: any[];
  defaultValue?: string;
  readOnly?: boolean;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  setDefaultToPlaceholder?: boolean;
  direction?: 'column' | 'row';
  errorMsgPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export const FormSelect = memo((props: Readonly<SelectProps>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[props.name];
  const defaultValue =
    props.setDefaultToPlaceholder && props.data.length > 0
      ? 'Select' // Use placeholder value
      : props.data.length > 0
      ? props.data[0].value // Default to the first item
      : 'Select';
  return (
    <FormField {...props}>
      <Controller
        name={props.name}
        control={control}
        defaultValue={defaultValue}
        shouldUnregister={true}
        render={({ field: { onChange, name, ref, value, onBlur } }) => (
          <Select.Root name={name} value={value}  data-textid={props.name} onValueChange={(newValue) => {
            onChange(newValue); // React Hook Form's handler
            props.onValueChange?.(newValue); // Custom handler passed as prop
          }} disabled={props.readOnly}>
            <Select.Trigger placeholder={props.placeholder} color={error ? 'red' : 'indigo'} />
            <Select.Content position="popper" side="bottom" ref={ref} onChange={onChange} color={error ? 'red' : 'indigo'}>
              {props.setDefaultToPlaceholder && <Select.Item value="Select">{props.placeholder || 'Select an action...'}</Select.Item>}
              {props.data.map((item) => (
                <Select.Item key={item.value} value={item.value}>
                  {item.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        )}
      />
    </FormField>
  );
});
