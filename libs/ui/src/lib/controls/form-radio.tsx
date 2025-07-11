import { Flex, RadioGroup } from '@radix-ui/themes';
import { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from './form-field';

type RadioItem = {
  value: string;
  label: string;
};

export interface RadioProps {
  label: string;
  name: string;
  desc?: string;
  type?: any;
  required?: string | boolean;
  defaultValue?: string;
  itemList: any[];
  readOnly?: boolean;
  onValueChange?: (value: string) => void;
}

export const FormRadio = memo((props: Readonly<RadioProps>) => {
  const { control } = useFormContext();

  return (
    <FormField {...props}>
      <Controller
        name={props.name}
        control={control}
        shouldUnregister={true}
        render={({ field: { onChange, name, ref, value, onBlur } }) => (
          <RadioGroup.Root name={name}  data-textid={props.name} ref={ref} value={value} defaultValue={props.defaultValue} onBlur={onBlur} onValueChange={onChange} disabled={props.readOnly}>
            <Flex direction="row" gap="2">
              {props.itemList.map((item) => (
                <RadioGroup.Item key={item.value} value={item.value}>
                  {item.label}
                </RadioGroup.Item>
              ))}
            </Flex>
          </RadioGroup.Root>
        )}
      />
    </FormField>
  );
});
