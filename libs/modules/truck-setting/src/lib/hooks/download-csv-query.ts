//import { SupplierNcrFilters,DocDetailModel} from '@cookers/models';
import { TruckSettingsFilters, DocDetailModel } from "@cookers/models";
import { getAxiosInstance } from "@cookers/services";

export const downloadTruckSettingsCSV = async (data: TruckSettingsFilters) => {
    console.log(getAxiosInstance());
  try {
    const response = await getAxiosInstance().get<DocDetailModel>(`truck-settings/export`,  { params: data });
    
    return response.data;
  } catch (error) {
    console.error("Error in Downlading Data:", error); 
  }
};
