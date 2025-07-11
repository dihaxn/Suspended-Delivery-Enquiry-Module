import { useReadOnlyContext } from '@cookers/providers';
import { Select } from '@radix-ui/themes';
import { memo } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from './form-field';

export interface SelectGenProps<T> {
  label: string;
  name: string;
  type?: any;
  required?: string | boolean;
  icon?: string;
  size?: '1' | '2' | '3';
  data: T[];
  defaultVal?: string;
  getLabel: (item: T) => string; // or ReactNode
  getValue: (item: T) => string;
}

export const FormSelectGen = memo(<T,>(props: Readonly<SelectGenProps<T>>) => {
  const { register } = useFormContext();

  const { readOnly } = useReadOnlyContext();

  return (   
    <FormField {...props}>
      <Select.Root defaultValue={props.defaultVal}  data-textid={props.name} {...register(props.name, { required: props.required })}>
        <Select.Trigger />
        <Select.Content position="popper" side="bottom">
          {props.data.map((item) => (
            <Select.Item key={props.getValue(item)} value={props.getValue(item)}>
              {props.getLabel(item)}
            </Select.Item>
          ))}
          {/* <Select.Item value="apple">Month</Select.Item> */}
        </Select.Content>
      </Select.Root>
    </FormField>    
  );
});