import { TruckSettingsViewModel } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';

// Function to fetch truck settings data by truck setting ID
export const fetchTruckSettingsFormData = async (truckSettingId: string): Promise<TruckSettingsViewModel> => {
    const response = await getAxiosInstance().get<TruckSettingsViewModel>(`truck-settings/${truckSettingId}`);
    return response.data;
};

