export const colorSelectorByStatusName = (statusName: string) => {
  switch (statusName.toLowerCase()) {
    case 'active':
      return 'green';
    case 'suspended':
      return 'red';
    case 'pending':
      return 'yellow';
    case 'confirmed':
      return 'blue';
    case 'medium':
      return 'yellow';
    case 'high':
      return 'red';
    case 'low':
      return 'green';
    default:
      return 'gray';
  }
};

export const custGroupSampleData = [
  { label: 'All', value: 'All' },
  { label: 'Retail', value: 'Retail' },
  { label: 'Wholesale', value: 'Wholesale' },
  { label: 'Corporate', value: 'Corporate' },
  { label: 'Government', value: 'Government' },
];
