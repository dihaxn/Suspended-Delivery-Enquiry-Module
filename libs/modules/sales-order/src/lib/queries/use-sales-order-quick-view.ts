import { GlobalMasterData, SalesOrderView } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { store } from '@cookers/store';

export const fetchSalesOrderViewData = async (salesOrderId: number): Promise<SalesOrderView> => {
    // const storeData = store.getState().globalMaster.globalMasterData;
    const URL = `orders/quick-view`;
    const response = await getAxiosInstance().get<SalesOrderView>(URL + '/' + salesOrderId);
    return response.data;
};