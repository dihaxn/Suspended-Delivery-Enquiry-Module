import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface SuspendedDeliveryRecord {
  custCode: string;
  name: string;
  custGroup: string;
  etaFresh?: string;
  etaUco?: string;
  repCode: string;
  carrierCode: string;
  contact: string;
  telephone: string;
  mobile: string;
  email: string;
  suspendComments: string;
}

export interface FilterState {
  custGroup: string;
  searchcustgroup: string;
  originator?: string;
  proxyUser?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface MasterData {
  custgroupList: Array<{ id: string; name: string; value: string }>;
}

export interface SuspendedDeliveryState {
  records: SuspendedDeliveryRecord[];
  filter: FilterState;
  masterData: MasterData;
  loading: boolean;
  error: string | null;
  totalRecords: number;
  exportInProgress: boolean;
  searchInProgress: boolean;
  quickview: SuspendedDeliveryRecord | null;
}

// Initial filter state
export const initialSuspendedDeliveryFilterState: FilterState = {
  custGroup: '',
  searchcustgroup: 'All',
  originator: '',
  proxyUser: '',
  dateFrom: '',
  dateTo: '',
};

// Default master data
const defaultMasterData: MasterData = {
  custgroupList: [],
};

// Initial state
const initialState: SuspendedDeliveryState = {
  records: [],
  filter: initialSuspendedDeliveryFilterState,
  masterData: defaultMasterData,
  loading: false,
  error: null,
  totalRecords: 0,
  exportInProgress: false,
  searchInProgress: false,
  quickview: null,
};

// Async thunk: Fetch records
export const fetchSuspendedDeliveryRecords = createAsyncThunk(
  'suspendedDelivery/fetchRecords',
  async (filterParams: FilterState, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/suspended-delivery/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filterParams),
      });
      if (!response.ok) throw new Error('Failed to fetch records');
      const data = await response.json();
      return data.records || [];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error occurred');
    }
  }
);

// Async thunk: Fetch master data
export const fetchSuspendedDeliveryMasterData = createAsyncThunk(
  'suspendedDelivery/fetchMasterData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/suspended-delivery/master-data');
      if (!response.ok) throw new Error('Failed to fetch master data');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error occurred');
    }
  }
);

// Async thunk: Export records
export const exportSuspendedDeliveryRecords = createAsyncThunk(
  'suspendedDelivery/exportRecords',
  async (filterParams: FilterState, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/suspended-delivery/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filterParams),
      });
      if (!response.ok) throw new Error('Failed to export records');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `suspended-delivery-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Export failed');
    }
  }
);

// Slice
const suspendedDeliverySlice = createSlice({
  name: 'suspendedDelivery',
  initialState,
  reducers: {
    setSuspendedDeliveryFilter(state, action: PayloadAction<Partial<FilterState>>) {
      state.filter = { ...state.filter, ...action.payload };
    },
    resetSuspendedDeliveryFilter(state) {
      state.filter = initialSuspendedDeliveryFilterState;
    },
    setSuspendedDeliveryMasterData(state, action: PayloadAction<Partial<MasterData>>) {
      state.masterData = { ...state.masterData, ...action.payload };
    },
    setSuspendedDeliveryRecords(state, action: PayloadAction<SuspendedDeliveryRecord[]>) {
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
    setQuickview(state, action: PayloadAction<SuspendedDeliveryRecord>) {
      state.quickview = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuspendedDeliveryRecords.pending, (state) => {
        state.loading = true;
        state.searchInProgress = true;
        state.error = null;
      })
      .addCase(fetchSuspendedDeliveryRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.searchInProgress = false;
        state.records = action.payload;
        state.totalRecords = action.payload.length;
      })
      .addCase(fetchSuspendedDeliveryRecords.rejected, (state, action) => {
        state.loading = false;
        state.searchInProgress = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSuspendedDeliveryMasterData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuspendedDeliveryMasterData.fulfilled, (state, action) => {
        state.loading = false;
        state.masterData = { ...state.masterData, ...action.payload };
      })
      .addCase(fetchSuspendedDeliveryMasterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(exportSuspendedDeliveryRecords.pending, (state) => {
        state.exportInProgress = true;
        state.error = null;
      })
      .addCase(exportSuspendedDeliveryRecords.fulfilled, (state) => {
        state.exportInProgress = false;
      })
      .addCase(exportSuspendedDeliveryRecords.rejected, (state, action) => {
        state.exportInProgress = false;
        state.error = action.payload as string;
      });
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
