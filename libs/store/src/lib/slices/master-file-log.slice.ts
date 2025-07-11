import { MasterFileLogMasterData, MasterFileLogFilters } from '@cookers/models';
import { getUserFromLocalStorage } from '@cookers/utils';
import { createSlice } from '@reduxjs/toolkit';
import { clearAllStates } from '../helper/clear-all-states-action';

export interface MasterFileLogState {
    value: number;
    searchBy: string;
    selectedMasterFileLogId: number;
    selectedMasterFileLogFormApiData: any;
    selectedMasterFileLog: any;
    filter: MasterFileLogFilters;
    openEdit: boolean;
    masterData: MasterFileLogMasterData;
    gridCheckboxOn: boolean;
    gridMenuOn: boolean;
    MasterFileLogForm: {
        reportType: string;
        maintenanceRequired: boolean;
    };
    isMasterFileLogRefreshed: boolean;
    isProxyReadOnly: boolean;
    isNewMasterFileLog: boolean;
    MasterFileLogDocUnsaved: number;
    isMasterFileLogDocDeleted: boolean;
    code:string;
    masterFile: string; 
    displayName: string;
}

const initialFilterState: MasterFileLogFilters = {
    originator: getUserFromLocalStorage()?.originator || '',
    proxyUser: '',
    duration: 'today',
    dateFrom: new Date().toISOString(),
    dateTo: new Date().toISOString(),
    columnFilters: '',
    code: "",
    masterFile: "",
    displayName: ''
};

const initialState: MasterFileLogState = {
    value: 0,
    searchBy: '',
    selectedMasterFileLogId: 0,
    selectedMasterFileLogFormApiData: {},
    selectedMasterFileLog: { MasterFileLogId: 0 },
    filter: initialFilterState,
    openEdit: false,
    masterData: {
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
            originator: "",
            name: "",
            reportToName: "",
            levelUpReportToName: "",
            defaultDepotCode: "",
            empId: 0
        },
        oliveoilPrice: 0
    },
    gridCheckboxOn: true,
    gridMenuOn: true,
    MasterFileLogForm: {
        reportType: '',
        maintenanceRequired: false,
    },
    isMasterFileLogRefreshed: false,
    isProxyReadOnly: true,
    isNewMasterFileLog: true,
    MasterFileLogDocUnsaved: 0,
    isMasterFileLogDocDeleted: false,
    code: '',
    masterFile: '',
    displayName: '',
};

export const MasterFileLogSlice = createSlice({
    name: 'masterFileLog',
    initialState,
    reducers: {
        MasterFileLogFilter: (state, action) => {
            state.filter = action.payload;
        },
        
        // Add other reducers here
        clearSelectedMasterFileLog: (state) => {
            state.filter = initialFilterState;
        },
        setSelectedMasterFileLog: (state, action) => {
            state.selectedMasterFileLog = action.payload;
        },

        setMasterFileLogCode: (state, action) => {
            state.code = action.payload;
            state.filter.code = action.payload;
        },
        setMasterFileLogMasterFile: (state, action) => {
            state.masterFile = action.payload;
            state.filter.masterFile = action.payload;
        },
        setMasterFileLogDisplayName: (state, action) => {
            state.displayName = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(clearAllStates, () => initialState);
    },
});

export const {
    MasterFileLogFilter,
    clearSelectedMasterFileLog,
    setMasterFileLogCode,
    setMasterFileLogMasterFile,
    setMasterFileLogDisplayName,
} = MasterFileLogSlice.actions;

export const masterFileLogReducer = MasterFileLogSlice.reducer;

