import { IncidentsFilters,DocDetailModel} from '@cookers/models';
import { getAxiosInstance } from "@cookers/services";

export const downloadIncidentCSV = async (data: IncidentsFilters) => {
    console.log(getAxiosInstance());
   

  try {
    const response = await getAxiosInstance().get<DocDetailModel>(`incidents/export`,  { params: data });
    
    return response.data;
  } catch (error) {
    console.error("Error in Downlading Data:", error);
    
  }
};
