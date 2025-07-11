import { Flex, Checkbox } from '@radix-ui/themes';
import { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from './form-field';

type CustomSize = 's' | 'm' | 'l';

export interface CheckboxProps {
  label: string;
  name: string;
  desc?: string;
  required?: string | boolean;
  size?: CustomSize;
  readOnly?: boolean;
  onChange?: (checked: boolean) => void; // Optional custom change handler
}

const sizeMap: Record<CustomSize, '1' | '2' | '3'> = {
  s: '1',
  m: '2',
  l: '3',
};

export const FormCheckbox: React.FC<CheckboxProps> = memo(({ size = 'm', ...props }) => {
  const { control, formState: { errors } } = useFormContext();
  const radixSize = sizeMap[size];
  const error = errors[props.name];

  return (
    <FormField {...props}>
      <Controller
        name={props.name}
        control={control}
        shouldUnregister={true}
        render={({ field: { onChange, value } }) => (
          <Flex direction="row" gap="2">
            <Checkbox
              checked={value}
              data-textid={props.name}
              disabled={props.readOnly}
              size={radixSize}
              className={error ? 'error' : ''}
              onCheckedChange={(checked) => {
                onChange(checked);
                if (props.onChange) props.onChange(!!checked);
              }}
            />
          </Flex>
        )}
      />
    </FormField>
  );
});
