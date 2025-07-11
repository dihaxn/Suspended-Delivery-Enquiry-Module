import { Flex, Checkbox } from '@radix-ui/themes';
import { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormFieldHighlight } from './highlight-form-field';

type CustomSize = 's' | 'm' | 'l';

export interface CheckboxHighlightProps {
  label: string;
  name: string;
  desc?: string;
  required?: string | boolean;
  size?: CustomSize;
  readOnly?: boolean;
  onChange?: (checked: boolean) => void; // Optional custom change handler
  backgroundColor?: string; // Optional style props
  borderRadius?: string;
  border?: string;
}

const sizeMap: Record<CustomSize, '1' | '2' | '3'> = {
  s: '1',
  m: '2',
  l: '3',
};

export const FormCheckboxHighlight: React.FC<CheckboxHighlightProps> = memo(({ size = 'm', ...props }) => {
  const { control, formState: { errors } } = useFormContext();
  const radixSize = sizeMap[size];
  const error = errors[props.name];

  return (
    <FormFieldHighlight {...props}>
      <Controller
        name={props.name}
        control={control}
        shouldUnregister={true}
        render={({ field: { onChange, value } }) => (
          <Flex direction="row" gap="2" >
            <Checkbox
              checked={value}
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
    </FormFieldHighlight>
  );
});
