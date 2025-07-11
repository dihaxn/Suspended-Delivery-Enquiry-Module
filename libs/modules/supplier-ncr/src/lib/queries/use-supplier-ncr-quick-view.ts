import { GlobalMasterData, SupplierNcrView } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { store } from '@cookers/store';
import { useSelector } from 'react-redux';


const mapSupplierNcrData = (data: SupplierNcrView, storeData: GlobalMasterData): SupplierNcrView => {
  const supplierObj = storeData.optionList.filter((opt) => opt.value === data.anyFurtherAction)[0];
  
  return { ...data, anyFurtherAction: supplierObj?.label ?? data.anyFurtherAction }; // Handle undefined case
};
export const fetchSupplierNcrViewData = async (supplierNcrId: number): Promise<SupplierNcrView> => {
  const storeData = store.getState().globalMaster.globalMasterData; 
    const URL = `supplier-ncr/fetch-all`;
  const response = await getAxiosInstance().get<SupplierNcrView>(URL + '?id=' + supplierNcrId);
  return mapSupplierNcrData(response.data, storeData);
};
