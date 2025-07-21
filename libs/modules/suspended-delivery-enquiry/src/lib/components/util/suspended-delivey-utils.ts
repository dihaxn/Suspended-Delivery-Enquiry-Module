
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
