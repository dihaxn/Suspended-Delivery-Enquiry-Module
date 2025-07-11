import { SalesOrderFilters, DocDetailModel } from '@cookers/models';
import { getAxiosInstance } from "@cookers/services";

export const downloadSalesOrderCSV = async (data: SalesOrderFilters) => {
    console.log(getAxiosInstance());

  try {
    const response = await getAxiosInstance().get<DocDetailModel>(`orders/export`, { params: data });
    console.log("csvdata", data)
    return response.data;
  } catch (error) {
    console.error("Error in downloading data:", error);
  }
};