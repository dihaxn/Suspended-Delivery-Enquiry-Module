import { SupplierNcrFilters, SupplierNCRList, SupplierNcrMasterData } from '@cookers/models';
import { GetCurrentDateISO, GetPeriodFromDate, getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { createSlice } from '@reduxjs/toolkit';
import { clearAllStates } from '../helper/clear-all-states-action';

export interface SupplierNcrState {
  // value: number;
  // searchBy: string;
  selectedSupplierNcrId: number;
  selectedSupplierNcrFormApiData: any;
  selectedSupplierNcr: Partial<SupplierNCRList>;
  filter: SupplierNcrFilters;
  openEdit: boolean;
  masterData: SupplierNcrMasterData;
  // gridCheckboxOn: boolean;
  // gridMenuOn: boolean;
  supplierForm: {
    reportType: string;
    injuryHappend: boolean;
  };
  isIncidentRefreshed: boolean;
  isproxyReadOnly: boolean;
  isNewIncident: boolean;
  incidentDocUnsaved: number;
  isIncidentDocDeleted: boolean;
  isDetailsBlockReadOnly: boolean;
  isResponseBlockReadOnly: boolean;
  isCloseOutBlockReadOnly: boolean;
  isSaveButtonVisible:boolean;
  isReadyForcompletionButtonVisible:boolean;
  isCloseButtonVisible:boolean;
  isReadyForCompletionSectionReadOnly:boolean;
  isCloseOutSectionReadOnly:boolean;
  pendingUploadDocuments: {
    files: {
      id: string;
      file: File;
    }[];
    groupId: string;
  }[];
}
export const initialSupplierNcrFilterState: SupplierNcrFilters = {
  duration: 'week',
  dateFrom: GetPeriodFromDate('week'),
  dateTo: GetCurrentDateISO(),
  status: 'all',
  depot: 'all',
 proxyUser: getProxyUserFromLocalStorage()?.userName || '',
  classification: 'all',
  originator: getUserFromLocalStorage()?.originator || '',
  searchByReportNo: '',
  searchBySupplierName: '',
  // dateFromStr: formatStringDatetostring(GetPeriodFromDate('week')),
  // dateToStr: formatStringDatetostring(GetCurrentDateISO()),
};
export const initialSupplierNcrState: SupplierNcrState = {
  // value: 0,
  // searchBy: '',
  selectedSupplierNcrId: 0,
  selectedSupplierNcrFormApiData: {},
  selectedSupplierNcr: { supplierNcrId: 0 },
  pendingUploadDocuments: [],
  filter: initialSupplierNcrFilterState,
  openEdit: false,
  masterData: {
    classificationList: [],
    depotList: [],
    // durationList: [],
    statusList: [],
    personRaisedList: [],
    catalogList: [],
    suppliersList: [],
    analysisReportFilterList: [],
    analysisCalenderYearList: [],
    analysisPeriodList: [],
    analysisYTDPeriodList: [],
    showAnalysisReport: false,
    showCloseNCR: false,
    showUpdateNCR: false,
    showCreateNCR: false,
    showUpdateNCRWithSuppResponse: false,
    userList:[],
    // editOnlyFirstTwoSection: false,
    // showWorkCover: false,
    // editWorkCover: false,
    // editFourthSection: false,
    // carrierList: [],
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
      empId: 0,
    },
    // userDropdownList: [],
  },
  // gridCheckboxOn: true,
  // gridMenuOn: true,
  supplierForm: {
    reportType: '',
    injuryHappend: false,
  },
  isIncidentRefreshed: false,
  isDetailsBlockReadOnly: true,
  isResponseBlockReadOnly: true,
  isCloseOutBlockReadOnly: true,
  isSaveButtonVisible:false,
  isReadyForcompletionButtonVisible:false,
  isCloseButtonVisible:false,
  isReadyForCompletionSectionReadOnly:false,
  isCloseOutSectionReadOnly:false,
  isproxyReadOnly: true,
  isNewIncident: true,
  incidentDocUnsaved: 0,
  isIncidentDocDeleted: false,
};

export const supplierNcrSlice = createSlice({
  name: 'supplierNcr',
  initialState: initialSupplierNcrState,
  // The initial state of the slice
  reducers: {
    // setSearchBy: (state, action) => {
    //   state.searchBy = action.payload;
    // },
    // setIncidentFormSelectedReportType: (state, action) => {
    //   state.incidentForm.reportType = action.payload;
    // },
    // setIncidentFormInjuryHappend: (state, action) => {
    //   state.incidentForm.injuryHappend = action.payload === '2';
    //   console.log('RRR.payload', action.payload, state.incidentForm.injuryHappend);
    // },

    setSelectedSupplierNcrId: (state, action) => {
      if (action.payload === undefined) {
        state.selectedSupplierNcrFormApiData = {};
        state.selectedSupplierNcr = {};
      }

      state.selectedSupplierNcrId = Number(action.payload);
    },

    setSelectedSupplierNcrFormApiData: (state, action) => {
      state.selectedSupplierNcrFormApiData = action.payload;
    },

    setSelectedSupplierNcr: (state, action) => {
      state.selectedSupplierNcr = action.payload;
    },

    supplierNcrFilter: (state, action) => {
      state.filter = action.payload;
      console.log('supplierNcrFilter', state.filter, action.payload);
    },
    setDetailBlockReadOnly: (state, action) => {
      state.isDetailsBlockReadOnly = action.payload;
    },
    setResponseBlockReadOnly: (state, action) => {
      state.isResponseBlockReadOnly = action.payload;
    },
    setCloseOutBlockReadOnly: (state, action) => {
      state.isCloseOutBlockReadOnly = action.payload;
    },
    setSaveButtonVisible: (state, action) => {
      state.isSaveButtonVisible = action.payload;
    },
    setReadyForCompletionButtonVisible: (state, action) => {
      state.isReadyForcompletionButtonVisible = action.payload;
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
    setSupplierNcrPendingUploadDocuments: (state, action) => {
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

      console.log('PPPPP', state.pendingUploadDocuments.values, existingIndex);
    },

    removeSupplierNcrResource: (state, action) => {
      const documentId = action.payload;
      console.log('documentId', documentId)
      if (state.selectedSupplierNcrFormApiData?.supplierNcrResource) {
      state.selectedSupplierNcrFormApiData.supplierNcrResource = 
        state.selectedSupplierNcrFormApiData.supplierNcrResource.filter(
        (resource :any) => resource.documentId !== documentId
        );
      }
    },
    // setDepot: (state, action) => {
    //   state.filter.depot = action.payload;
    // },
    // setType: (state, action) => {
    //   state.filter.type = action.payload;
    // },
    // setStatus: (state, action) => {
    //   state.filter.status = action.payload;
    // },
    // setDateFrom: (state, action) => {
    //   state.filter.dateFrom = action.payload;
    // },
    // setDateTo: (state, action) => {
    //   state.filter.dateTo = action.payload;
    // },
    // setOpenEdit: (state, action) => {
    //   state.openEdit = action.payload;
    // },
    setSupplierNcrMasterData: (state, action) => {
      state.masterData = action.payload;
    },
    // clearIncidentState: (state) => {
    //   return initialSupplierNcrState;
    // },
    // setIncidentRefreshFlag: (state, action) => {
    //   state.isIncidentRefreshed = action.payload;
    // },
    // clearIncidentRefreshFlag: (state, action) => {
    //   state.isIncidentRefreshed = action.payload;
    // },
    // setProxyReadOnlyFlag: (state, action) => {
    //   state.isproxyReadOnly = action.payload;
    // },

    // clearSelectedIncident: (state) => {
    //   state.selectedIncident = initialSupplierNcrState.selectedIncident;
    // },
    // setNewIncident: (state, action) => {
    //   state.isNewIncident = action.payload;
    // },
    // setDocUnsaveCount: (state, action) => {
    //   const { type, value } = action.payload;
    //   if (type === 'increment') {
    //     state.incidentDocUnsaved += value || 1;
    //   } else if (type === 'decrement') {
    //     state.incidentDocUnsaved = Math.max(0, state.incidentDocUnsaved - (value || 1));
    //   } else if (type === 'set') {
    //     state.incidentDocUnsaved = value;
    //   }
    // },
    // setIncidentDocDeleted: (state, action) => {
    //   state.isIncidentDocDeleted = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(clearAllStates, () => initialSupplierNcrState); // Reset state on `clearAllStates`
  },
});

export const {
  setSupplierNcrMasterData,
  supplierNcrFilter,
  setSelectedSupplierNcrId,
  setSelectedSupplierNcr,
  setSelectedSupplierNcrFormApiData,
  setSupplierNcrPendingUploadDocuments,
  setDetailBlockReadOnly,
  setResponseBlockReadOnly,
  setCloseOutBlockReadOnly,
  setSaveButtonVisible,
  setReadyForCompletionButtonVisible,
  setCloseButtonVisible,
  setReadyForCompletionSectionReadonly,
  setCloseOutSectionReadonly,
  removeSupplierNcrResource
} = supplierNcrSlice.actions;

export default supplierNcrSlice.reducer;
