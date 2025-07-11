import React from 'react';
import { FormInputAutoCompleteVirtualized } from '@cookers/ui';

interface CarrierAutoCompleteProps {
  label: string;
  name: string;
  options: { label: string; value: string | number; other?: any }[];
  readOnly?: boolean;
  searchPlaceholder?: string;
  height?: string;
}

export const CarrierAutoComplete: React.FC<CarrierAutoCompleteProps> = ({
  options,
  searchPlaceholder = "Search carrier...",
  height = "200px",
  ...props
}) => {
  // Show different placeholder based on whether options are available
  const emptyMessage = options.length === 0 
    ? "No carriers found..."
    : "No carriers found...";

  return (
    <FormInputAutoCompleteVirtualized
      {...props}
      options={options}
      searchPlaceholder={searchPlaceholder}
      height={height}
      emptyMessage={emptyMessage}
    />
  );
}; 