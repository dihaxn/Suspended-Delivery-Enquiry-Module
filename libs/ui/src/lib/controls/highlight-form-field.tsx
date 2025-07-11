import * as Label from '@radix-ui/react-label';
import { Flex, Text ,Box} from '@radix-ui/themes';
import { useFormContext } from 'react-hook-form';

import './form.css';

interface FormFieldHighlightProps {
  label: string;
  desc?: string;
  children: React.ReactNode;
  name: string;
  direction?: 'column' | 'row';
  backgroundColor?: string; // Individual style props
  borderRadius?: string;
  border?: string;
}

export const FormFieldHighlight: React.FC<FormFieldHighlightProps> = ({
  children,
  label,
  name,
  desc,
  direction = 'column',
  backgroundColor = 'var(--red-a7)', // Default value
  borderRadius = 'var(--radius-3)',
  border = '1px solid var(--red-a9)',
}) => {
  const {
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="form-field">
      <Flex
        gap="1"
        direction={direction}
        
      >
        <Box style={{
          backgroundColor,
          borderRadius,
          border,
        }}>
        <Label.Root>{label}</Label.Root>
        {desc && <Text size="1">{desc}</Text>}
        {children}
        </Box>
       
        {error && (
          <Text size="1" className="error">
            {error?.message as string}
          </Text>
        )}
      </Flex>
    </div>
  );
};
