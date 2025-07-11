import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { TextField as RadixTextField } from '@radix-ui/themes';
import { LegacyRef } from 'react';

interface TextFieldProps {
  radius?: string;
  value?: string;
  size?: string;
  name?: string;
  className?: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: string;
  refType?: LegacyRef<HTMLInputElement>;
  type?: any;
}

export const TextField: React.FC<TextFieldProps> = ({ radius, value, size, placeholder, icon, type, refType, onChange, className, name }) => {
  return (
    <RadixTextField.Root
      radius="large"
      value={value}
      size="2"
      placeholder={placeholder}
      type={type || 'text'}
      onChange={onChange}
      ref={refType}
      multiple
      className={className ?? ''}
      name={name ?? ''}
    >
      {icon && (
        <RadixTextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </RadixTextField.Slot>
      )}
    </RadixTextField.Root>
  );
};
