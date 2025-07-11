import { useSelector } from 'react-redux';
import { RootState } from '../cookers-store';

export enum STORE {
  IncidentManagement = 'incidentManagement',
  TruckSettings = "truckSettings",
  CustomerFeedback = 'customerFeedback',
  SupplierNcr = 'supplierNcr',
  TabsControl = 'tabsControl',
  Wso2Auth = 'wso2',
  GlobalMaster = 'globalMaster',
  CarrierMaster = 'carrierMaster',
  SalesOrder = 'salesOrder',
  Invoice = 'invoice',
  MasterFileLog = 'masterFileLog',
  // Add other keys here as needed
}

const stateSelectors = {
  [STORE.IncidentManagement]: (state: RootState) => state.incidentManagement,
  [STORE.CustomerFeedback]: (state: RootState) => state.customerFeedback,
  [STORE.SupplierNcr]: (state: RootState) => state.supplierNcr,
  [STORE.TabsControl]: (state: RootState) => state.tabsControl,
  [STORE.Wso2Auth]: (state: RootState) => state.wso2Auth,
  [STORE.TruckSettings]: (state: RootState) => state.truckSetting,
  [STORE.GlobalMaster]: (state: RootState) => state.globalMaster,
  [STORE.CarrierMaster]: (state: RootState) => state.carrierMaster,
  [STORE.SalesOrder]: (state: RootState) => state.salesOrder,
  [STORE.Invoice]: (state: RootState) => state.invoice,
  [STORE.MasterFileLog]: (state: RootState) => state.masterFileLog,

  
  // Add other selectors here as needed
};

type StateSelectorMap = {
  [K in keyof typeof stateSelectors]: ReturnType<(typeof stateSelectors)[K]>;
};

export const useStoreSelector = <K extends keyof typeof stateSelectors>(key: K): StateSelectorMap[K] => {
  return useSelector(stateSelectors[key] as (state: RootState) => StateSelectorMap[K]);
};
