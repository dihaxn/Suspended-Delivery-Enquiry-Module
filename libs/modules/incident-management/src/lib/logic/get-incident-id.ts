import { helperService } from '@cookers/helpers';

export const getIncidentId = (id?: string): string => {
  // Simulate fetching incident ID
  return `IncidentID-${id ? id : ''}`;
};

helperService.registerService('getIncidentId', getIncidentId);
