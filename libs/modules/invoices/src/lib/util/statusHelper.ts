export const invoiceStatusColorSelectorByStatusName = (status: 'N' | 'P' | 'T' | 'C' | string): 'blue' | 'amber' | 'red' | 'green' | 'violet' | 'gray' => {
  switch (status) {
    case 'N':
      return 'green';
    case 'P':
      return 'amber';
    case 'T':
      return 'blue';
    case 'C':
      return 'red';
    default:
      return 'gray'; 
  }
};

export const invoiceStatusLabelSelectorByStatusName = (status: 'N' | 'P' | 'T' | 'C' | string): string => {
  switch (status) {
    case 'N':
      return 'New';
    case 'P':
      return 'Printed';
    case 'T':
      return 'Transferred';
    case 'C':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};