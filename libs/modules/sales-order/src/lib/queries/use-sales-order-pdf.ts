import { DocDetailModel } from '@cookers/models';
import { getAxiosInstance } from "@cookers/services";

export const downloadSalesOrderReport = async (salesOrderId: number) => {
    console.log(getAxiosInstance());

    try {
        const response = await getAxiosInstance().get<DocDetailModel>(`sales-order/report?id=${salesOrderId}`);
        return response.data;
    } catch (error) {
        console.error("Error in downloading data:", error);
    }
};