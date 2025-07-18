import { DocDetailModel, SuspendedDeliveryFilters } from '@cookers/models';
import { getAxiosInstance } from "@cookers/services";

export const downloadSuspendedDeliveryCSV = async (
  data: SuspendedDeliveryFilters
): Promise<DocDetailModel | undefined> => {
  console.log(getAxiosInstance());

  try {
    const response = await getAxiosInstance().get<DocDetailModel>(
      `suspended-delivery/export`,
      { params: data }
    );

    return response.data;
  } catch (error) {
    console.error("Error in Downloading Data:", error);
    return undefined;
  }
};
