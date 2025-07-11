import React, { ReactNode, useState } from 'react';
import { Button, Popover } from '@radix-ui/themes';

type VariantSize = 'soft' | 'classic' | 'solid' | 'surface' | 'outline' | 'ghost' | undefined;
type RadiusSize = 'small' | 'none' | 'full' | 'medium' | 'large' | undefined;

interface SearchComponentProps {
  buttonLabel: string | ReactNode | JSX.Element;
  radius: RadiusSize;
  variant: VariantSize;
  popoverContent: ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  width?: string;
}

export const PopOverControl: React.FC<SearchComponentProps> = ({
  isOpen,
  onOpenChange,
  buttonLabel,
  popoverContent,
  variant = 'soft',
  radius = 'full',
  width = '250px',
}) => {
  return (
    <Popover.Root open={isOpen} onOpenChange={onOpenChange}>
      <Popover.Trigger>
        {React.isValidElement(buttonLabel) ? (
          buttonLabel
        ) : (
          <Button variant={variant} radius={radius}>
            {buttonLabel}
          </Button>
        )}
      </Popover.Trigger>
      <Popover.Content width={width}>
        {popoverContent}
      </Popover.Content>
    </Popover.Root>
  );
};

export default PopOverControl;
