import { TruckSettingsMasterData, TruckSettingsFilters } from '@cookers/models';
import { GetPeriodFromDate, GetCurrentDateISO, getUserFromLocalStorage, formatStringDatetostring } from '@cookers/utils';
import { createSlice } from '@reduxjs/toolkit';
import { clearAllStates } from '../helper/clear-all-states-action';

export interface TruckSettingsState {
    value: number;
    searchBy: string;
    selectedTruckSettingId: number;
    selectedTruckSettingFormApiData: any;
    selectedTruckSetting: any;
    filter: TruckSettingsFilters;
    openEdit: boolean;
    masterData: TruckSettingsMasterData;
    gridCheckboxOn: boolean;
    gridMenuOn: boolean;
    truckSettingsForm: {
        reportType: string;
        maintenanceRequired: boolean;
    };
    isTruckSettingsRefreshed: boolean;
    isProxyReadOnly: boolean;
    isNewTruckSetting: boolean;
    truckSettingsDocUnsaved: number;
    isTruckSettingsDocDeleted: boolean;
}

const initialFilterState: TruckSettingsFilters = {
    /*duration: 'week',
    dateFrom: GetPeriodFromDate('week'),
    dateTo: GetCurrentDateISO(),*/
    truckType: 'all', 
    depot: 'all',
    /*status: 'all',
    dateRange: '',*/
    originator: getUserFromLocalStorage()?.originator || '',
    proxyUser: '',
    searchByCarrier:'',
    /*search: '',
    employeeSearch: '',
    dateFromStr: formatStringDatetostring(GetPeriodFromDate('week')),
    dateToStr: formatStringDatetostring(GetCurrentDateISO()),*/
};

const initialState: TruckSettingsState = {
    value: 0,
    searchBy: '',
    selectedTruckSettingId: 0,
    selectedTruckSettingFormApiData: {},
    selectedTruckSetting: { truckSettingId: 0 },
    filter: initialFilterState,
    openEdit: false,
    masterData: {
        depotList: [],
        truckTypeList: [],
        totaliserTypeList: [],
        onOffStatusList: [],
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
        carrierList: [],
        oliveoilPrice:0
    },
    gridCheckboxOn: true,
    gridMenuOn: true,
    truckSettingsForm: {
        reportType: '',
        maintenanceRequired: false,
    },
    isTruckSettingsRefreshed: false,
    isProxyReadOnly: true,
    isNewTruckSetting: true,
    truckSettingsDocUnsaved: 0,
    isTruckSettingsDocDeleted: false
};

export const truckSettingsSlice = createSlice({
    name: 'truckSettings',
    initialState,
    reducers: {
        setSelectedTruckSettingId:(state, action) => {
            if(action.payload === undefined) {
                state.selectedTruckSettingFormApiData = {};
                state.selectedTruckSetting = {};
            }
            state.selectedTruckSettingId = Number(action.payload);
        },
       
        truckSettingsFilter: (state, action) => {
            state.filter = action.payload;
        },
        setTruckSettingsSearchBy: (state, action) => {
            state.searchBy = action.payload;
        },
        setTruckSettingsFormSelectedReportType: (state, action) => {
            state.truckSettingsForm.reportType = action.payload;
        },
        // Add other reducers here
        clearSelectedTruckSetting: (state) => {
            state.selectedTruckSetting = initialState.selectedTruckSetting;
        },
        setSelectedTruckSetting: (state, action) => {
            state.selectedTruckSetting = action.payload;
        },
        setTMasterData: (state, action) => {
            state.masterData = action.payload;
        },
        setSelectedTruckSettingFormApiData: (state, action) => {
            state.selectedTruckSettingFormApiData = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(clearAllStates, () => initialState);
    },
});

export const { 
    setSelectedTruckSettingId, 
    truckSettingsFilter, 
    setTMasterData, 
    setSelectedTruckSetting, 
    setTruckSettingsSearchBy, 
    setTruckSettingsFormSelectedReportType, 
    clearSelectedTruckSetting, 
    setSelectedTruckSettingFormApiData 
} = truckSettingsSlice.actions;

export default truckSettingsSlice.reducer;

