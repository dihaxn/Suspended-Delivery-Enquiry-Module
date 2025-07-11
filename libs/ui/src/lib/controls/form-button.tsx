import { useReadOnlyContext } from '@cookers/providers';
import { Button } from '@radix-ui/themes';
import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

export interface ButtonProps {
  label: string;
  name: string;
  icon?: string;
  size?: '1' | '2' | '3';
  type?: 'button' | 'submit';
  onClick?: () => void; // Add the onClick prop here optional
}

export const FormButton = memo((props: Readonly<ButtonProps>) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  const { readOnly } = useReadOnlyContext();

  if (readOnly) {
    return null;
  }

  return (
    <Button
      radius="full"
      data-textid={props.name}
      disabled={isSubmitting}
      type={props.type ? props.type : 'button'}
      size={props.size ? props.size : '3'}
      onClick={props.onClick}
    >
      {isSubmitting ? 'Loading...' : props.label}
    </Button>
  );
});
