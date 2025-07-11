import { DocDetailModel} from '@cookers/models';
import { getAxiosInstance } from "@cookers/services";
export const downloadSupplierNcrReport = async (supplierncrId: number) => {
    console.log(getAxiosInstance());
   

  try {
    const response = await getAxiosInstance().get<DocDetailModel>(`supplier-ncr/report?id=${supplierncrId}`);
    
    return response.data;
  } catch (error) {
    console.error("Error in Downlading Data:", error);
    
  }
};