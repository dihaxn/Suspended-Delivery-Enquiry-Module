import { SalesOrderFilters, SalesOrderList, SalesOrderMasterData, SalesOrderEntryInterface, SalesOrderEntryPermission, DefaultSalesOrderEntry, SalesOrderCustomerDetails, FilterItem } from '@cookers/models';
import { encodeArrayForQueryParam, GetCurrentDateISO, GetPeriodFromDate, getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { createSlice } from '@reduxjs/toolkit';
import { clearAllStates } from '../helper/clear-all-states-action';

export interface SalesOrderState {
  selectedSalesOrderId: number;
  selectedSalesOrderFormApiData: any;
  selectedSalesOrder: Partial<SalesOrderList>;
  filter: SalesOrderFilters;
  openEdit: boolean;
  masterData: SalesOrderMasterData;
  isOrderRefreshed: boolean;
  isproxyReadOnly: boolean;
  isNewOrder: boolean;
  orderDocUnsaved: number;
  isOrderDocDeleted: boolean;
  isDetailsBlockReadOnly: boolean;
  isCloseOutBlockReadOnly: boolean;
  isSaveButtonVisible: boolean;
  isReadyForCompletionButtonVisible: boolean;
  isCloseButtonVisible: boolean;
  isReadyForCompletionSectionReadOnly: boolean;
  isCloseOutSectionReadOnly: boolean;
  pendingUploadDocuments: {
    files: {
      id: string;
      file: File;
    }[];
    groupId: string;
  }[];
  permission: SalesOrderEntryPermission;
  salesOrderApiData: SalesOrderEntryInterface;
  customerList: any[];
  customerDetails: SalesOrderCustomerDetails | null;
    columnFilters: FilterItem[];
}

export const initialSalesOrderFilterState: SalesOrderFilters = {
  duration: 'week',
  dateFrom: GetPeriodFromDate('week'),
  dateTo: GetCurrentDateISO(),
  orderType: 'ONOF',
  productType: 'all',
  orderStatus: 'all',
  checkedOutstandingOrders: false,
  parentCustomer: 'all',
  carrierCode: 'all',
  custGroup: 'all',
  proxyUser: getProxyUserFromLocalStorage()?.userName || '',
  originator: getUserFromLocalStorage()?.originator || '',
   columnFilters: '',
  
};

const defaultPermission: SalesOrderEntryPermission = {
  canEditDetailsBlock: true,
  canViewDetailsBlock: true,
  canSaveEntry: true,
  canCloseEntry: false,
  canCancelOrder: true,
  canCancelPList: true,
};

export const initialSalesOrderState: SalesOrderState = {
  selectedSalesOrderId: 0,
  selectedSalesOrderFormApiData: {},
  selectedSalesOrder: { sOrderNo: 0 },
  pendingUploadDocuments: [],
  filter: initialSalesOrderFilterState,
  openEdit: false,
  masterData: {
    carrierList: [],
    depotList: [],
    catalogList: [],
    customerList: [],
    orderTypeList: [],
    marketStatusList: [],
    orderNoList: [],
    statusList: [],
    parentCustomerList: [],
    custGroupList: [],
    productTypeList: [],
    showCloseOrder: false,
    showUpdateOrder: false,
    showCreateOrder: false,
    showUpdateOrderWithSuppResponse: false,
    permissionLevel: {
      myRecordsOnly: false,
      myDepotOnly: false,
      myStateOnly: false,
      assignedDepotsOnly: false,
      nationalAccess: false,
      partialAccess: false,
      fullAccess: false,
      readOnly: false,
    },
    upperLevelUsers: {
      originator: '',
      name: '',
      reportToName: '',
      levelUpReportToName: '',
      defaultDepotCode: '',
      empId: 0
    },
  },
  isOrderRefreshed: false,
  isproxyReadOnly: false,
  isNewOrder: false,
  orderDocUnsaved: 0,
  isOrderDocDeleted: false,
  isDetailsBlockReadOnly: false,
  isCloseOutBlockReadOnly: false,
  isSaveButtonVisible: true,
  isReadyForCompletionButtonVisible: false,
  isCloseButtonVisible: false,
  isReadyForCompletionSectionReadOnly: false,
  isCloseOutSectionReadOnly: false,
  permission: defaultPermission,
  salesOrderApiData: DefaultSalesOrderEntry,
  customerList: [],
  customerDetails: null,
  columnFilters: [],
};

const updateEncodedColumnFilters = (state: SalesOrderState) => {
  state.filter.columnFilters = encodeArrayForQueryParam(state.columnFilters.map((filter) => ({ [filter.id]: filter.value })));
  console.log('updated filters', state.columnFilters.map((filter) => ({ [filter.id]: filter.value })))
};

const salesOrderSlice = createSlice({
  name: 'salesOrder',
  initialState: initialSalesOrderState,
  reducers: {
    setSelectedSalesOrderId: (state, action) => {
      if (action.payload === undefined) {
        state.selectedSalesOrderFormApiData = {};
        state.selectedSalesOrder = {};
      }
      state.selectedSalesOrderId = Number(action.payload);
    },
    setSelectedSalesOrderFormApiData: (state, action) => {
      state.selectedSalesOrderFormApiData = action.payload;
    },
    setSelectedSalesOrder: (state, action) => {
      state.selectedSalesOrder = action.payload;
    },
    salesOrderFilter: (state, action) => {
      state.filter = action.payload;
    },
    setDetailBlockReadOnly: (state, action) => {
      state.isDetailsBlockReadOnly = action.payload;
    },
    // setResponseBlockReadOnly: (state, action) => {
    //   state.isResponseBlockReadOnly = action.payload;
    // },
    // setCloseOutBlockReadOnly: (state, action) => {
    //   state.isCloseOutBlockReadOnly = action.payload;
    // },
    setCloseOutBlockReadOnly: (state, action) => {
      state.isCloseOutBlockReadOnly = action.payload;
    },
    setSaveButtonVisible: (state, action) => {
      state.isSaveButtonVisible = action.payload;
    },
    setReadyForCompletionButtonVisible: (state, action) => {
      state.isReadyForCompletionButtonVisible = action.payload;
    },
    setReadyForCompletionSectionReadonly: (state, action) => {
      state.isReadyForCompletionSectionReadOnly = action.payload;
    },
    setCloseOutSectionReadonly: (state, action) => {
      state.isCloseOutSectionReadOnly = action.payload;
    },
    setCloseButtonVisible: (state, action) => {
      state.isCloseButtonVisible = action.payload;
    },
    setSalesOrderPendingUploadDocuments: (state, action) => {
      const { groupId } = action.payload;
      const existingIndex = state.pendingUploadDocuments.findIndex((item) => item.groupId === groupId);

      if (existingIndex === -1) {
        state.pendingUploadDocuments.push(action.payload);
      } else {
        if (action.payload.files.length === 0) {
          state.pendingUploadDocuments.splice(existingIndex, 1);
        } else {
          state.pendingUploadDocuments[existingIndex] = action.payload;
        }
      }
    },
    removeSalesOrderResource: (state, action) => {
      const documentId = action.payload;
      if (state.selectedSalesOrderFormApiData?.SalesOrderResource) {
        state.selectedSalesOrderFormApiData.SalesOrderResource = 
          state.selectedSalesOrderFormApiData.SalesOrderResource.filter(
            (resource: any) => resource.documentId !== documentId
          );
      }
    },
    setSalesOrderMasterData: (state, action) => {
      state.masterData = action.payload;
    },
    updateSalesOrderPermission: (state, action) => {
      state.permission = { ...state.permission, ...action.payload };
    },
    setSalesOrderApiData: (state, action) => {
      state.salesOrderApiData = action.payload;
    },
    setSalesOrderCustomerList: (state, action) => {
      state.customerList = action.payload;
    },
    resetSelectedSalesOrder: (state) => {
      state.selectedSalesOrder = {};
      state.salesOrderApiData = DefaultSalesOrderEntry;
      state.permission = defaultPermission;
    },
    setCustomerDetails: (state, action) => {
      state.customerDetails = action.payload;
    },
    clearCustomerDetails: (state) => {
      state.customerDetails = null;
    },
    addColumnFilter1: (state, action) => {
      const newFilter = action.payload;
      const updatedFilters = state.columnFilters.filter((filter) => filter.id !== newFilter.id);
      state.columnFilters = updatedFilters;
      if (newFilter.value.length > 0) {
        state.columnFilters.push(newFilter);
      }
    },
    removeColumnFilter1: (state, action) => {
      const filterToRemove = action.payload;
      state.columnFilters = state.columnFilters.filter((filter) => filter.id !== filterToRemove.id);
    },
    removeAllColumnFilters1: (state) => {
      state.columnFilters = [];
    },
    setOrderFilters: (state, action) => {
          state.filter = action.payload;
          updateEncodedColumnFilters(state);
        },
    
  },
  extraReducers: (builder) => {
    builder.addCase(clearAllStates, () => initialSalesOrderState);
  },
});

export const {
  setSalesOrderMasterData,
  salesOrderFilter,
  setSelectedSalesOrderId,
  setSelectedSalesOrder,
  setSelectedSalesOrderFormApiData,
  setSalesOrderPendingUploadDocuments,
  removeSalesOrderResource,
  updateSalesOrderPermission,
  setSalesOrderApiData,
  setSalesOrderCustomerList,
  resetSelectedSalesOrder,
  setCustomerDetails,
  clearCustomerDetails,
  addColumnFilter1,
  removeAllColumnFilters1,
  removeColumnFilter1,
  setOrderFilters,
} = salesOrderSlice.actions;

export const salesOrderReducer = salesOrderSlice.reducer;