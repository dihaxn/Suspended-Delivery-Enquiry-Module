import { GlobalMasterData } from '@cookers/models';
import { formatStringDatetostring, GetCurrentDateISO, GetPeriodFromDate, getUserFromLocalStorage } from '@cookers/utils';
import { createSlice } from '@reduxjs/toolkit';
import { clearAllStates } from '../helper/clear-all-states-action';

interface GlobalMasterState {
  globalMasterData: GlobalMasterData;
}

export const initialGlobalMasterState: GlobalMasterState = {
    globalMasterData: {
    durationList: [],
    optionList: [],
  },
};

export const globalMasterSlice = createSlice({
  name: 'globalMaster',
  initialState: initialGlobalMasterState,
  reducers: {
    setGlobalMasterData: (state, action) => {
      state.globalMasterData = action.payload;
    },
    clearGlobalMasterState: (state) => {
      return initialGlobalMasterState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearAllStates, () => initialGlobalMasterState); // Reset state on `clearAllStates`
  },
});

export const {
    setGlobalMasterData,

    clearGlobalMasterState,

  //clearProxyReadOnlyFlag,
} = globalMasterSlice.actions;

export default globalMasterSlice.reducer;
