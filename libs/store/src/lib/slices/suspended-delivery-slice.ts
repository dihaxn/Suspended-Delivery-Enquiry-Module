import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {  SuspendedDeliveryList , SuspendedDeliveryFilters, initialSuspendedDeliveryFilterState, SuspendedDeliveryMasterData , defaultSuspendedDeliveryMasterData} from '@cookers/models';


export interface SuspendedDeliveryState {
  records: SuspendedDeliveryList[];
  filter: SuspendedDeliveryFilters;
  masterData: SuspendedDeliveryMasterData;
  loading: boolean;
  error: string | null;
  totalRecords: number;
  exportInProgress: boolean;
  searchInProgress: boolean;
  quickview: SuspendedDeliveryList | null;
}


const initialState: SuspendedDeliveryState = {
  records: [],
  filter: initialSuspendedDeliveryFilterState,
  masterData: defaultSuspendedDeliveryMasterData,
  loading: false,
  error: null,
  totalRecords: 0,
  exportInProgress: false,
  searchInProgress: false,
  quickview: null,
};

const suspendedDeliverySlice = createSlice({
  name: 'suspendedDelivery',
  initialState,
  reducers: {
    setSuspendedDeliveryFilter(state, action: PayloadAction<Partial<SuspendedDeliveryFilters>>) {
      state.filter = { ...state.filter, ...action.payload };
    },
    resetSuspendedDeliveryFilter(state) {
      state.filter = initialSuspendedDeliveryFilterState;
    },
    setSuspendedDeliveryMasterData(state, action: PayloadAction<Partial<SuspendedDeliveryMasterData>>) {
      state.masterData = { ...state.masterData, ...action.payload };
    },
    setSuspendedDeliveryRecords(state, action: PayloadAction<SuspendedDeliveryList[]>) {
      state.records = action.payload;
      state.totalRecords = action.payload.length;
    },
    setSuspendedDeliveryLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSuspendedDeliveryError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearSuspendedDeliveryError(state) {
      state.error = null;
    },
    setSuspendedDeliveryExportInProgress(state, action: PayloadAction<boolean>) {
      state.exportInProgress = action.payload;
    },
    setSuspendedDeliverySearchInProgress(state, action: PayloadAction<boolean>) {
      state.searchInProgress = action.payload;
    },
    clearSuspendedDeliveryRecords(state) {
      state.records = [];
      state.totalRecords = 0;
    },
    setQuickview(state, action: PayloadAction<SuspendedDeliveryList>) {
      state.quickview = action.payload;
    },
     suspendedDeliveryFilter: (state, action) => {
          state.filter = action.payload;
        },
  },
  
});

// Exports
export const {
  setSuspendedDeliveryFilter,
  resetSuspendedDeliveryFilter,
  setSuspendedDeliveryMasterData,
  setSuspendedDeliveryRecords,
  setSuspendedDeliveryLoading,
  setSuspendedDeliveryError,
  clearSuspendedDeliveryError,
  setSuspendedDeliveryExportInProgress,
  setSuspendedDeliverySearchInProgress,
  clearSuspendedDeliveryRecords,
  suspendedDeliveryFilter,
  setQuickview,
} = suspendedDeliverySlice.actions;

export default suspendedDeliverySlice.reducer;

// Selectors
export const selectSuspendedDeliveryState = (state: any) => state.suspendedDelivery;
export const selectSuspendedDeliveryRecords = (state: any) => state.suspendedDelivery.records;
export const selectSuspendedDeliveryFilter = (state: any) => state.suspendedDelivery.filter;
export const selectSuspendedDeliveryMasterData = (state: any) => state.suspendedDelivery.masterData;
export const selectSuspendedDeliveryLoading = (state: any) => state.suspendedDelivery.loading;
export const selectSuspendedDeliveryError = (state: any) => state.suspendedDelivery.error;
export const selectSuspendedDeliveryExportInProgress = (state: any) => state.suspendedDelivery.exportInProgress;
export const selectSuspendedDeliverySearchInProgress = (state: any) => state.suspendedDelivery.searchInProgress;
export const selectSuspendedDeliveryTotalRecords = (state: any) => state.suspendedDelivery.totalRecords;
