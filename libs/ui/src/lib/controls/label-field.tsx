import { Flex } from '@radix-ui/themes';
import * as Label from '@radix-ui/react-label';

import './form.css';

interface LabelFieldProps {
  label: string;
  children?: React.ReactNode;
  htmlFor?: string;
}

export const LabelField: React.FC<LabelFieldProps> = ({label, children, htmlFor}) => {
  return (
    <div className="form-field">
      <Flex gap="1" direction="column">
        <Label.Root htmlFor={htmlFor ? htmlFor : ''} >{label}</Label.Root>
        {children}
      </Flex>
    </div>
  );
};
