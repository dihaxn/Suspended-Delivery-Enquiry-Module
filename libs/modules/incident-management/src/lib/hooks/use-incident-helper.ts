import { DocDetailModel} from '@cookers/models';
import { getAxiosInstance } from "@cookers/services";
export const downloadIncidentHelperDoc = async () => {
    console.log(getAxiosInstance());
   

  try {
    const response = await getAxiosInstance().get<DocDetailModel>(`incident-docs/helper`);
    
    return response.data;
  } catch (error) {
    console.error("Error in Downlading Data:", error);
    
  }
};