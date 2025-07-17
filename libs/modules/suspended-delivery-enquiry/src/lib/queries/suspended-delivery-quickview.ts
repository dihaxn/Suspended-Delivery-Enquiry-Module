import { GlobalMasterData, SuspendedDeliveryList } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { store } from '@cookers/store';

const mapSuspendedDeliveryData = (data: SuspendedDeliveryList, storeData: GlobalMasterData): SuspendedDeliveryList => {
  const supplierObj = storeData.optionList.filter((opt) => opt.value === data.anyFurtherAction)[0];
  
  return { ...data, anyFurtherAction: supplierObj?.label ?? data.anyFurtherAction }; // Handle undefined case
};
export const fetchSuspendedDeliveryData = async (customerNumber: number): Promise<SuspendedDeliveryList> => {
  const storeData = store.getState().globalMaster.globalMasterData; 
    const URL = `suspended-delivery-list/fetch-all`;
  const response = await getAxiosInstance().get<SuspendedDeliveryList>(URL + '?id=' + customerNumber);
  return mapSuspendedDeliveryData(response.data, storeData);
};
