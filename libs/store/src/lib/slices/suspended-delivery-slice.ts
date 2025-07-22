import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  SuspendedDeliveryList , SuspendedDeliveryFilters, initialSuspendedDeliveryFilterState, SuspendedDeliveryMasterData , defaultSuspendedDeliveryMasterData} from '@cookers/models';


export interface SuspendedDeliveryState {
  filter: SuspendedDeliveryFilters;
  masterData: SuspendedDeliveryMasterData;
  quickview: SuspendedDeliveryList | null;
}


const initialState: SuspendedDeliveryState = {
  filter: initialSuspendedDeliveryFilterState,
  masterData: defaultSuspendedDeliveryMasterData,
  quickview: null,
};

const suspendedDeliverySlice = createSlice({
  name: 'suspendedDelivery',
  initialState,
  reducers: {
    setSuspendedDeliveryFilter(state, action: PayloadAction<Partial<SuspendedDeliveryFilters>>) {
      state.filter = { ...state.filter, ...action.payload };
    },
    setSuspendedDeliveryMasterData(state, action: PayloadAction<Partial<SuspendedDeliveryMasterData>>) {
      state.masterData = { ...state.masterData, ...action.payload };
    },
    setQuickview(state, action: PayloadAction<SuspendedDeliveryList>) {
      state.quickview = action.payload;
    },
    suspendedDeliveryFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  
});


export const {
  setSuspendedDeliveryFilter,
  setSuspendedDeliveryMasterData,
  suspendedDeliveryFilter,
  setQuickview,
} = suspendedDeliverySlice.actions;
export default suspendedDeliverySlice.reducer;