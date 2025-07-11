import { Select } from '@radix-ui/themes';

export interface SelectFieldProps {
  defaultValue?: string;
  data: any[];
  readOnly?: boolean;
  size?: '1' | '2' | '3';
  placeholder?: string;
  setDefaultToPlaceholder?: boolean;
  onValueChange?: (e: string) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  defaultValue,
  data,
  readOnly,
  size,
  onValueChange,
  placeholder = '',
  setDefaultToPlaceholder,
}) => {
  const defaultPlaceholder =
    setDefaultToPlaceholder && data.length > 0
      ? 'Select' // Use placeholder value
      : data.length > 0
      ? data[0].value // Default to the first item
      : 'Select';
  return (
    <Select.Root defaultValue={defaultValue} size={size ? size : '2'} disabled={readOnly ? readOnly : false} onValueChange={onValueChange}>
      <Select.Trigger placeholder={placeholder} />
      <Select.Content position="popper" side="bottom">
        {setDefaultToPlaceholder && <Select.Item value="Select">{placeholder || 'Select'}</Select.Item>}
        {data.map((item) => (
          <Select.Item key={item.value} value={item.value}>
            {item.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};
