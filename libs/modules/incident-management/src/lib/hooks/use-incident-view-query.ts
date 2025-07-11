import { IncidentViewModel } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';

// Function to fetch incident data by incident ID
export const fetchIncidentFormData = async (incidentId: string): Promise<IncidentViewModel> => {
  const response = await getAxiosInstance().get<IncidentViewModel>(`incidents/${incidentId}`);
  return response.data;
};