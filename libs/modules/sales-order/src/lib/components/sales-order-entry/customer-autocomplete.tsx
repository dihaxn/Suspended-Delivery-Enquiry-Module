import React from 'react';
import { FormInputAutoCompleteVirtualized } from '@cookers/ui';

interface CustomerAutoCompleteProps {
  label: string;
  name: string;
  options: { label: string; value: string | number; other?: any }[];
  readOnly?: boolean;
  searchPlaceholder?: string;
  height?: string;
}

export const CustomerAutoComplete: React.FC<CustomerAutoCompleteProps> = ({
  options,
  searchPlaceholder = "Search customer...",
  height = "300px",
  ...props
}) => {
  return (
    <FormInputAutoCompleteVirtualized
      {...props}
      options={options}
      searchPlaceholder={searchPlaceholder}
      height={height}
      emptyMessage="No results found..."
    />
  );
}; 