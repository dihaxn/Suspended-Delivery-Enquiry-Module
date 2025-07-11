export const colorSelectorByStatusName = (status: string): 'blue' | 'amber' | 'red' | 'green' | 'violet' | 'gray' | 'orange' => {
  switch (status) {
    case 'New':
      return 'blue';
    case 'Printed':
      return 'amber';
    case 'Cancelled':
      return 'red';
    case 'Invoiced':
      return 'violet';
    case 'On Truck':
      return 'green';
    case 'Standing Order':
      return 'orange';
    default:
      return 'gray'; 
  }
};

interface SelectOption {
  label: string;
  value: string;
}

export function getValueFromObj(
  input: SelectOption | string,
  key: keyof SelectOption
): string {
  if (typeof input === 'object' && input !== null) {
    return input[key];
  }
  return input;
} 