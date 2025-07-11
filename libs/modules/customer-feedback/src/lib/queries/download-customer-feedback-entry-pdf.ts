import { DocDetailModel } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
export const downloadCustomerFeedbackReport = async (customerFeebackId: number) => {

  try {
    const response = await getAxiosInstance().get<DocDetailModel>(`complaints/report?id=${customerFeebackId}`);

    return response.data;
  } catch (error) {
    console.error('Error in Downlading Data:', error);
  }
};
