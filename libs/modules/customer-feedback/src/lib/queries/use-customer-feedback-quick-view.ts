import { GlobalMasterData, CustomerFeedbackView } from "@cookers/models";
import { getAxiosInstance } from '@cookers/services';
import { store } from '@cookers/store';
import { useSelector } from 'react-redux';


const mapCustomerFeedbackData = (data: CustomerFeedbackView, storeData: GlobalMasterData): CustomerFeedbackView => {
  const customerFeedbackObj = storeData.optionList.filter((opt) => opt.value === data.anyFurtherAction)[0];
  
  return { ...data, anyFurtherAction: customerFeedbackObj?.label ?? data.anyFurtherAction }; // Handle undefined case
};
export const fetchCustomerFeedbackViewData = async (complaintId: number): Promise<CustomerFeedbackView> => {
  const storeData = store.getState().globalMaster.globalMasterData; 
    const URL = `complaints/quick-view`;
  const response = await getAxiosInstance().get<CustomerFeedbackView>(URL + '?id=' + complaintId);
  return mapCustomerFeedbackData(response.data, storeData);
};