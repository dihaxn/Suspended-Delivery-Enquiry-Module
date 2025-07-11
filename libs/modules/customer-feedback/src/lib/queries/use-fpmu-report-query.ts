import { DocDetailModel, CustomerFeedbackFPMUFormData } from "@cookers/models";
import { getAxiosInstance } from "@cookers/services";
import { formattoDate } from "@cookers/utils";


export const downloadFPMUReport = async (data: CustomerFeedbackFPMUFormData) => {
  try {
    const response = await getAxiosInstance().get<DocDetailModel>(`complaints/analysis`, {
      params: modifyJsonFields(data),
    });
    return response.data;
  } catch (error) {
    console.error('Error in Downloading FPMU Report:', error);
    throw error;
  }
};

const modifyJsonFields = (data: CustomerFeedbackFPMUFormData) => {
  return {
    fromDate: formattoDate(data.dateFrom),
    toDate: formattoDate(data.dateTo),
    depot: data.depot === 'all' ? '' : data.depot,
    isFpmu: 'Y',
    periodType: 0,
  };
};