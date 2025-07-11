import { CustomerFeedbackAnalysis, DocDetailModel, CustomerFeedbackAnalysisFormData } from '@cookers/models';
import { formattoDate } from '@cookers/utils';
import { getAxiosInstance } from '@cookers/services';

export const downloadCustomerFeedbackAnalysisReport = async (data: CustomerFeedbackAnalysisFormData) => {
  try {
    const response = await getAxiosInstance().get<DocDetailModel>(`complaints/analysis`, { params: modifyJsonFields(data) });
    return response.data;
  } catch (error) {
    console.error('Error in Downloading Customer Feedback Analysis Report:', error);
  }
};

const modifyJsonFields = (data: CustomerFeedbackAnalysisFormData): CustomerFeedbackAnalysis => {
  const apiData = {} as CustomerFeedbackAnalysis;
  apiData.fromDate = formattoDate(data.dateFrom);
  apiData.toDate = formattoDate(data.dateTo);
  apiData.periodType = data.reportItem;
  apiData.currentYear = new Date().getFullYear().toString();

  apiData.depot = data.depot === 'all' ? '' : data.depot;
  //apiData.status = data.status === "all" ? "" : data.status;
  apiData.nature = data.nature === 'all' ? '' : data.nature;
  apiData.feedback = data.feedbackClassification === 'all' ? '' : data.feedbackClassification;
  apiData.issue = data.issueClassification === 'all' ? '' : data.issueClassification;
  apiData.isFpmu = data.isFpmu || 'N';

  return apiData;
};
