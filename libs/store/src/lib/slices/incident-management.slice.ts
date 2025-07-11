import { IncidentMasterData, IncidentsFilters } from '@cookers/models';
import { formatStringDatetostring, GetCurrentDateISO, GetPeriodFromDate, getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { createSlice } from '@reduxjs/toolkit';
import { clearAllStates } from '../helper/clear-all-states-action';

interface IncidentManagementState {
  value: number;
  searchBy: string;
  selectedIncident: any;
  filter: IncidentsFilters;
  openEdit: boolean;
  masterData: IncidentMasterData;
  gridCheckboxOn: boolean;
  gridMenuOn: boolean;
  incidentForm: {
    reportType: string;
    injuryHappend: boolean;
  };
  isIncidentRefreshed: boolean;
  isproxyReadOnly: boolean;
  isNewIncident: boolean;
  incidentDocUnsaved: number;
  isIncidentDocDeleted: boolean;
}
export const initialFilterState: IncidentsFilters = {
  duration: 'week',
  dateFrom: GetPeriodFromDate('week'),
  dateTo: GetCurrentDateISO(),
  type: 'all',
  status: 'all',
  depot: 'all',
  dateRange: '',
  originator: getUserFromLocalStorage()?.originator || '',
  proxyUser: getProxyUserFromLocalStorage()?.userName || '',
  search: '',
  employeeSearch: '',
  dateFromStr: formatStringDatetostring(GetPeriodFromDate('week')),
  dateToStr: formatStringDatetostring(GetCurrentDateISO()),
};
export const initialIncidentManagementState: IncidentManagementState = {
  value: 0,
  searchBy: '',
  selectedIncident: { incidentId: 0 },
  filter: initialFilterState,
  openEdit: false,
  masterData: {
    depotList: [],
    statusList: [],
    reportTypeList: [],
    workSiteList: [],
    genderList: [],
    jobTypeList: [],
    injuredPersonList: [],
    firstAidList: [],
    feasibleActionList: [],
    claimStatusList: [],
    insurerList: [],
    documentTypeList: [],
    analysisCalenderYearList: [],
    analysisPeriodList: [],
    analysisYTDPeriodList: [],
    analysisReportFilterList: [],
    userByDepotHierarchyDropdownList: [],
    incidentGridColumnList: [],
    employeeDropdownDtoList: [],
    editOnlyFirstTwoSection: false,
    showWorkCover: false,
    editWorkCover: false,
    editFourthSection: false,
    showAnalysisReport: false,
    carrierList: [],
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
    userDropdownList: [],
  },
  gridCheckboxOn: true,
  gridMenuOn: true,
  incidentForm: {
    reportType: '',
    injuryHappend: false,
  },
  isIncidentRefreshed: false,
  isproxyReadOnly: true,
  isNewIncident: true,
  incidentDocUnsaved: 0,
  isIncidentDocDeleted: false,
};

export const incidentManagementSlice = createSlice({
  name: 'incidentManagement',
  initialState: initialIncidentManagementState,
  reducers: {
    setSearchBy: (state, action) => {
      state.searchBy = action.payload;
    },
    setIncidentFormSelectedReportType: (state, action) => {
      state.incidentForm.reportType = action.payload;
    },
    setIncidentFormInjuryHappend: (state, action) => {
      state.incidentForm.injuryHappend = action.payload === '2';
    },
    setSelectedIncident: (state, action) => {
      state.selectedIncident = action.payload;
    },

    incidentFilter: (state, action) => {
      state.filter = action.payload;
    },
    setDepot: (state, action) => {
      state.filter.depot = action.payload;
    },
    setType: (state, action) => {
      state.filter.type = action.payload;
    },
    setStatus: (state, action) => {
      state.filter.status = action.payload;
    },
    setDateFrom: (state, action) => {
      state.filter.dateFrom = action.payload;
    },
    setDateTo: (state, action) => {
      state.filter.dateTo = action.payload;
    },
    setOpenEdit: (state, action) => {
      state.openEdit = action.payload;
    },
    setMasterData: (state, action) => {
      state.masterData = action.payload;
    },
    clearIncidentState: (state) => {
      return initialIncidentManagementState;
    },
    setIncidentRefreshFlag: (state, action) => {
      state.isIncidentRefreshed = action.payload;
    },
    clearIncidentRefreshFlag: (state, action) => {
      state.isIncidentRefreshed = action.payload;
    },
    setProxyReadOnlyFlag: (state, action) => {
      state.isproxyReadOnly = action.payload;
    },

    clearSelectedIncident: (state) => {
      state.selectedIncident = initialIncidentManagementState.selectedIncident;
    },
    setNewIncident: (state, action) => {
      console.log('RRR.payload' + action.payload);
      state.isNewIncident = action.payload;
    },
    setDocUnsaveCount: (state, action) => {
      const { type, value } = action.payload;
      if (type === 'increment') {
        state.incidentDocUnsaved += value || 1;
      } else if (type === 'decrement') {
        state.incidentDocUnsaved = Math.max(0, state.incidentDocUnsaved - (value || 1));
      } else if (type === 'set') {
        state.incidentDocUnsaved = value;
      }
    },
    setIncidentDocDeleted: (state, action) => {
      state.isIncidentDocDeleted = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearAllStates, () => initialIncidentManagementState); // Reset state on `clearAllStates`
  },
});

export const {
  setSearchBy,
  setSelectedIncident,
  incidentFilter,
  setOpenEdit,
  setDepot,
  setType,
  setStatus,
  setDateFrom,
  setDateTo,
  setMasterData,
  setIncidentFormSelectedReportType,
  setIncidentFormInjuryHappend,
  clearIncidentState,
  setIncidentRefreshFlag,
  clearIncidentRefreshFlag,
  setProxyReadOnlyFlag,
  //clearProxyReadOnlyFlag,
  clearSelectedIncident,
  setNewIncident,
  setDocUnsaveCount,
  setIncidentDocDeleted,
} = incidentManagementSlice.actions;

export default incidentManagementSlice.reducer;
