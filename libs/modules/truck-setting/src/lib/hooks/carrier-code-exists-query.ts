import { getAxiosInstance } from '@cookers/services';

export const checkCarrierCodeExists = async (carrierCode: string, selectedTruckSettingId: number) => {
  const response = await getAxiosInstance().get<boolean>(`truck-settings/${carrierCode}/${selectedTruckSettingId}`);
  return response.data;  // This will be the boolean value from the backend
};