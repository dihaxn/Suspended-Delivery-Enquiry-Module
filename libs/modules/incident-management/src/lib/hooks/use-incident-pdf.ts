import { DocDetailModel} from '@cookers/models';
import { getAxiosInstance } from "@cookers/services";
export const downloadIncidentReport = async (incidentId: number) => {
    console.log(getAxiosInstance());
   

  try {
    const response = await getAxiosInstance().get<DocDetailModel>(`incidents/report?id=${incidentId}`);
    
    return response.data;
  } catch (error) {
    console.error("Error in Downlading Data:", error);
    
  }
};