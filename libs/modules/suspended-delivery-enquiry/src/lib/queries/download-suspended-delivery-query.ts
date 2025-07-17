import { SupplierNcrFilters,DocDetailModel} from '@cookers/models';
import { getAxiosInstance } from "@cookers/services";

export const downloadSuspendedDeliveryCSV = async (data: SupplierNcrFilters) => {
    console.log(getAxiosInstance());

  try {
    const response = await getAxiosInstance().get<DocDetailModel>(`supplier-ncr/export`,  { params: data });
    
    return response.data;
  } catch (error) {
    console.error("Error in Downlading Data:", error);
    
  }
};
