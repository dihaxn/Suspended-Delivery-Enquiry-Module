import { createSlice } from '@reduxjs/toolkit';
import { CustomerFeedbackEntryInterface, CustomerFeedbackEntryPermission, CustomerFeedbackFilter, CustomerFeedbackMasterData, DefaultCustomerFeedbackEntry, CustomerFeedbackListInterface, DefaultCustomerFeedbackMasterData, CustomerInterface } from '@cookers/models';
import { GetPeriodFromDate, getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';

interface CustomerFeedbackState {
  value: number;
  searchBy: string;
  filter: CustomerFeedbackFilter;
  selectedCustomerFeedback: Partial<CustomerFeedbackListInterface>;
  openEdit: boolean;
  masterData: CustomerFeedbackMasterData;
  gridCheckboxOn: boolean;
  gridMenuOn: boolean;
  isproxyReadOnly: boolean;
  permission: CustomerFeedbackEntryPermission;
  customerFeedbackApiData: CustomerFeedbackEntryInterface;
  customerList: CustomerInterface[];
}

export const initialCustomerFeedbackFilterState: CustomerFeedbackFilter = {
  duration: 'week',
  dateFrom: GetPeriodFromDate('week'),
  dateTo: new Date().toISOString(),
  type: 'all',
  status: 'all',
  depot: 'all',
  dateRange: '',
  originator: getUserFromLocalStorage()?.originator ?? '',
  proxyUser: getProxyUserFromLocalStorage()?.userName ?? '',
  search: '',
  CustomerSearch: '', 
  feedbackClassification: 'all',
  issueClassification: 'all',
  feedbackStatus: 'all',
  nature: 'all',
};

const defaultPermission = {
    //Details Block
    canEditDetailsBlock: true,
    canViewDetailsBlock: true,
    //Actions Block
    canEditActionsBlock: false,
    canViewActionsBlock: false,
    //Close Out Block
    canEditCloseOutBlock: false,
    canViewCloseOutBlock: false,
    //Footer
    canSaveEntry: true,
    canCloseEntry:false,
    canInvestigateEntry: false,
  }

const initialState: CustomerFeedbackState = {
  selectedCustomerFeedback: { complaintId: 0 },
  value: 0,
  searchBy: '',
  filter: initialCustomerFeedbackFilterState,
  openEdit: false,
  customerFeedbackApiData: DefaultCustomerFeedbackEntry,
  masterData: DefaultCustomerFeedbackMasterData,
  gridCheckboxOn: false,
  gridMenuOn: false,
  isproxyReadOnly: false,
  customerList: [],
  permission: defaultPermission
};

const customerFeedbackSlice = createSlice({
  name: 'customerFeedback',
  initialState,
  reducers: {
    setCustomerFeedbackFilter: (state, action) => {
      state.filter = action.payload;
    },
    setCustomerFeedbackMasterData: (state, action) => {
      state.masterData = action.payload;
    },
    setSelectedCustomerFeedback: (state, action) => {
      if (action.payload === undefined) {
        state.selectedCustomerFeedback = {complaintId: 0};
      }
      state.selectedCustomerFeedback = action.payload;
    },
    resetSelectedCustomerFeedback:(state, action) => {
        state.selectedCustomerFeedback = {};
        state.customerFeedbackApiData = DefaultCustomerFeedbackEntry;
        state.permission = defaultPermission
    },
    updateCustomerFeedbackPermission: (state, action) => {
      state.permission = { ...state.permission, ...action.payload };
    },
    setCustomerFeedbackApiData: (state, action) => {
      state.customerFeedbackApiData = action.payload;
    },
    setCustomerList: (state, action) => {
      state.customerList = action.payload;
    },
    removeCustomerFeedbackResource: (state, action) => {
          const documentId = action.payload;
          console.log('documentId', documentId)
          if (state.customerFeedbackApiData?.complaintResource) {
          state.customerFeedbackApiData.complaintResource = 
            state.customerFeedbackApiData.complaintResource.filter(
            (resource :any) => resource.documentId !== documentId
            );
          }
        }
  },
});

export const { 
  setCustomerFeedbackMasterData, 
  setCustomerFeedbackFilter, 
  updateCustomerFeedbackPermission, 
  setCustomerFeedbackApiData, 
  setSelectedCustomerFeedback,
  setCustomerList,
  removeCustomerFeedbackResource,
  resetSelectedCustomerFeedback
} = customerFeedbackSlice.actions;

export default customerFeedbackSlice.reducer;
