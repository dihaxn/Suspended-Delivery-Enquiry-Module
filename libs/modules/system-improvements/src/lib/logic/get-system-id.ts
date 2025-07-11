import { helperService } from '@cookers/helpers';

export const getSystemId = (id: string): string => {
  // Simulate fetching customer ID
  return `SystemID-rooban-${id}`;
};

helperService.registerService('getSystemId', getSystemId);
