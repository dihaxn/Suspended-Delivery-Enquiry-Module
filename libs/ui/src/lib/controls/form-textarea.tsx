import { useReadOnlyContext } from '@cookers/providers';
import { TextArea } from '@radix-ui/themes';
import { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from './form-field';

type CustomSize = 's' | 'm' | 'l';
export interface TextAreaProps {
  label: string;
  name: string;
  desc?: string;
  required?: string | boolean;
  icon?: string;
  size?: CustomSize;
  readOnly?: boolean;
  placeHolder?: string;
  maxLength?:number;
  validateOnChange?: boolean;
}

const sizeMap: Record<CustomSize, '1' | '2' | '3'> = {
  s: '1',
  m: '2',
  l: '3',
};

export const FormTextArea: React.FC<TextAreaProps> = memo(({ size = 'm', ...props }) => {
  const {
    register,
    formState: { errors },
    control,
    trigger,
  } = useFormContext();

  const { readOnly } = useReadOnlyContext();
  const radixSize = sizeMap[size];

  const error = errors[props.name];

  return (
    <FormField {...props}>
      <Controller
        name={props.name}
        control={control}
        shouldUnregister={true}
        render={({ field: { onChange, name, ref, value, onBlur } }) => (
          <TextArea
            spellCheck={true}
            data-textid={props.name}
            rows={5}
            color={error ? 'red' : 'gray'}
            variant={error ? 'soft' : 'surface'}
            size={radixSize}
            placeholder={props.placeHolder ? props.placeHolder : ''}
            disabled={readOnly}
            readOnly={props.readOnly}
            value={value}
            maxLength={props.maxLength}
            className={error ? 'error' : ''}
            onChange={(event) => {
              onChange(event);
              if (props.validateOnChange) {
                trigger(name);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Prevent adding new line on Enter
              }
            }}
          ></TextArea>
        )}
      />
    </FormField>
  );
});
