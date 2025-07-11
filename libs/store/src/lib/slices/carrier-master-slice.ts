import { CarrierFilters, CarrierMasterData, CarrierMasterList } from '@cookers/models';
import { GetCurrentDateISO, GetPeriodFromDate, getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { createSlice } from '@reduxjs/toolkit';
import { clearAllStates } from '../helper/clear-all-states-action';

export interface CarrierMasterState {
  masterData: CarrierMasterData;
  filter: CarrierFilters;
  selectedCarrierCode: string;
     selectedCarrier: Partial<CarrierMasterList>;
     selectedCarrierFormApiData: any;
}
 export const initialCarrierFilterState: CarrierFilters = {
 
  truckType: 'all',
  depot: 'all',
 proxyUser: getProxyUserFromLocalStorage()?.userName || '',
  originator: getUserFromLocalStorage()?.originator || '',
  searchByCarrierCode: '',
  searchByDriver: '',
 searchByRegoNo:''
}; 
export const initialCarrierMasterState: CarrierMasterState = {
 
  masterData: {
    truckTypeList: [],
    depotList: [],
    // durationList: [],
    contactList: [],
    driverList: [],
  allDriverList:[],
    showCreateCarrier: false,
    showDeleteCarrier: false,
    showEditCarrier: false,
   
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
   
  },
  filter: initialCarrierFilterState,
   selectedCarrier: { carrierCode: '' },
   selectedCarrierCode: '',
   selectedCarrierFormApiData: {},
};


export const carrierMasterSlice = createSlice({
  name: 'carrierMaster',
  initialState: initialCarrierMasterState,
  // The initial state of the slice
  reducers: {
   
    setCarrierMasterData: (state, action) => {
      state.masterData = action.payload;
    },
    setCarrierFilter: (state, action) => {
      state.filter = action.payload;
      console.log('CarrierFilter', state.filter, action.payload);
    },
    setSelectedCarrier: (state, action) => {
      state.selectedCarrier = action.payload;
    },
    setSelectedCarrierCode: (state, action) => {
      if (action.payload === undefined) {
        state.selectedCarrierFormApiData = {};
        state.selectedCarrier = {};
      }

      state.selectedCarrierCode = action.payload;
    },
 setSelectedCarrierFormApiData: (state, action) => {
      state.selectedCarrierFormApiData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearAllStates, () => initialCarrierMasterState); // Reset state on `clearAllStates`
  },
});

export const {
  setCarrierMasterData,
  setCarrierFilter,
  setSelectedCarrier,
  setSelectedCarrierCode,
  setSelectedCarrierFormApiData
} = carrierMasterSlice.actions;

export default carrierMasterSlice.reducer;
