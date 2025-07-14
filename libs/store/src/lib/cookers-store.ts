import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import incidentManagementReducer from './slices/incident-management.slice';
import truckSettingsReducer from './slices/truck-settings.slice';
import customeFeedbackReducer from './slices/customer-feedback.slice';
import supplierNcrReducer from './slices/supplier-ncr.slice';
import tabsControlReducer from './slices/tabscontrol.slice';
import globalMasterReducer from './slices/global-master-slice';
import invoiceReducer from './slices/invoice.slice';
import carrierMasterReducer from './slices/carrier-master-slice';
import { salesOrderReducer } from './slices/sales-order.slice';
import { masterFileLogReducer } from './slices/master-file-log.slice';
import suspendedDeliveryReducer from './slices/suspended-delivery-slice';
export const store = configureStore({
  reducer: {
    incidentManagement: incidentManagementReducer,
    customerFeedback: customeFeedbackReducer,
    invoice: invoiceReducer,
    supplierNcr: supplierNcrReducer,
    tabsControl: tabsControlReducer,
    wso2Auth: authReducer,
    truckSetting: truckSettingsReducer,
    globalMaster: globalMasterReducer,
    carrierMaster: carrierMasterReducer,
    salesOrder: salesOrderReducer,
    masterFileLog: masterFileLogReducer,
    suspendedDelivery: suspendedDeliveryReducer
  },
});
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
