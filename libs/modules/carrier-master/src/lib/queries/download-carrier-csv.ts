import { CarrierFilters,DocDetailModel} from '@cookers/models';
import { getAxiosInstance } from "@cookers/services";

export const downloadcarrierCSV = async (data: CarrierFilters) => {
    console.log(getAxiosInstance());
   

  try {
    const response = await getAxiosInstance().get<DocDetailModel>(`carrier/export`,  { params: data });
    
    return response.data;
  } catch (error) {
    console.error("Error in Downlading Data:", error);
    
  }
};
