import { CustomerFeedbackFilter, DocDetailModel } from "@cookers/models";
import { getAxiosInstance } from "@cookers/services";

export const downloadCustomerFeedbackCSV = async (data: CustomerFeedbackFilter) => {
  try {
    const response = await getAxiosInstance().get<DocDetailModel>(`complaints/export`, { params: data });
    return response.data;
  } catch (error) {
    console.error("Error in Downloading Feedback CSV Data:", error);
  }
};