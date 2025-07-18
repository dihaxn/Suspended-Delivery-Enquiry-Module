import { DocDetailModel, SuspendedDeliveryList} from '@cookers/models';
import { getAxiosInstance } from "@cookers/services";

export const downloadSuspendedDeliveryCSV = async (data: SuspendedDeliveryList) => {
    console.log(getAxiosInstance());

  try {
    const response = await getAxiosInstance().get<DocDetailModel>(`suspended-delivery/export`,  { params: data });
    
    return response.data;
  } catch (error) {
    console.error("Error in Downlading Data:", error);
    
  }
};
