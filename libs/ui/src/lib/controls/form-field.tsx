import * as Label from '@radix-ui/react-label';
import { Flex, Text } from '@radix-ui/themes';
import get from 'lodash/get';
import { useFormContext } from 'react-hook-form';

import './form.css';

interface FormFieldProps {
  label: string;
  desc?: string;
  children: React.ReactNode;
  name: string;
  direction?: 'column' | 'row';
}

export const FormField: React.FC<FormFieldProps> = ({ children, label, name, desc, direction = 'column' }) => {
  const {
    formState: { errors },
  } = useFormContext();

  const error = get(errors, name);

  return (
    <div className="form-field">
      <Flex gap="1" direction={direction}>
        <Label.Root>{label}</Label.Root>
        {desc && <Text size="1">{desc}</Text>}
        {children}
        {error && (
          <Text size="1" className="error">
            {error?.message as string}
          </Text>
        )}
      </Flex>
    </div>
  );
};
