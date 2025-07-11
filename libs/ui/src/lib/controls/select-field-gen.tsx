import { Select } from '@radix-ui/themes';
import { ReactNode } from 'react';

export interface SelectFieldGenProps<T> {
  defaultVal?: string;
  itemList: T[];
  readOnly?: boolean;
  size?: '1' | '2' | '3';
  onValueChange: (e: string) => void;
  getLabel: (item: T) => ReactNode; // or ReactNode
  getValue: (item: T) => string;
}

export const SelectFieldGen = <T,>({ defaultVal, itemList, readOnly, size, onValueChange, getValue, getLabel }: SelectFieldGenProps<T>) => {
  return (
    <Select.Root defaultValue={defaultVal} size={size ? size : '2'} disabled={readOnly ? readOnly : false} onValueChange={onValueChange}>
      <Select.Trigger />
      <Select.Content position="popper" side="bottom">
        {itemList &&
          itemList.map((item) => (
            <Select.Item key={getValue(item)} value={getValue(item)}>
              {getLabel(item)}
            </Select.Item>
          ))}
      </Select.Content>
    </Select.Root>
  );
};
