import { useReadOnlyContext } from '@cookers/providers';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { TextField } from '@radix-ui/themes';
import { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from './form-field';

type CustomSize = 's' | 'm' | 'l';
export interface InputProps {
  label: string;
  name: string;
  type?: 'text' | 'password' | any;
  desc?: string;
  required?: string | boolean;
  icon?: string;
  size?: CustomSize;
  readOnly?: boolean;
  placeHolder?: string;
  maxLength?: number;
  autoComplete?: string;
  validateOnChange?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  onCopy?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
}

const sizeMap: Record<CustomSize, '1' | '2' | '3'> = {
  s: '1',
  m: '2',
  l: '3',
};

export const FormInput: React.FC<InputProps> = memo(({ size = 'm', ...props }) => {
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
          <TextField.Root
            className={error ? 'error' : ''}
            color={error ? 'red' : 'indigo'}
            variant={error ? 'soft' : 'surface'}
            type={props.type === 'password' ? 'password' : 'text'} // Set type based on props
            size={radixSize}
            placeholder={props.placeHolder ? props.placeHolder : ''}
            disabled={readOnly}
            readOnly={props.readOnly}
            name={name}
            data-textid={name}
            value={value || ''}
            ref={ref}
            maxLength={props.maxLength}
            autoComplete={props.autoComplete ? props.autoComplete : 'on'}
            onChange={(event) => {
              onChange(event); // Call the onChange from the field
              if (props.onChange) {
                props.onChange(event); // Call the custom onChange if provided
              }
              if (props.validateOnChange) {
                trigger(name);
              }
            }}
            onBlur={(event) => {
              onBlur();
              if (props.onBlur) {
                props.onBlur(event);
              }
            }}
            onPaste={(e) => {
              if (props.onPaste) {
                e.preventDefault(); // Prevent paste if no handler is provided
              }
            }}
            onCopy={(e) => {
              if (props.onCopy) {
                e.preventDefault(); // Prevent copy if no handler is provided
              }
            }}
            //className={error ? 'error' : ''}
          >
            {props.icon && (
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
            )}
          </TextField.Root>
        )}
      />
    </FormField>
  );
});
