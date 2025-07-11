import { Flex, Text, Switch } from '@radix-ui/themes';
import { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface FormSwitchProps {
  name: string;
  label: string;
  size?: '1' | '2' | '3'; // Size for the switch
  disabled?: boolean;
  onChange?: (checked: boolean) => void; // Optional custom change handler
}

export const FormSwitch: React.FC<FormSwitchProps> = memo(({ name, label, size = '1', disabled = false, onChange }) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div>
      <Flex direction="row" gap="2" align="center">
        <Text size="2">{label}</Text>
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange: formOnChange, value } }) => (
            <Switch
            data-textid={name}
              size={size}
              checked={value}
              disabled={disabled}
              className={error ? 'error' : ''}
              onCheckedChange={(checked) => {
                formOnChange(checked);
                if (onChange) onChange(!!checked);
              }}
            />
          )}
        />
      </Flex>
      {error && (
        <Text size="1" className="error">
          {error.message as string}
        </Text>
      )}
    </div>
  );
});
