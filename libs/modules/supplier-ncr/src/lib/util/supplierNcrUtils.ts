export const colorSelectorByStatusName = (status: string) => {
  return status === 'Completed' ? 'green' : status === 'Raised' ? 'amber' : status === 'Ready for Completion' ? 'teal' : status === 'Response Received' ? 'blue' : 'gray';
};