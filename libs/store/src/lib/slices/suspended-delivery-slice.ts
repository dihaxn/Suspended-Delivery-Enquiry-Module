import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Define interfaces based on the requirements document
interface SuspendedDeliveryRecord {
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

interface FilterState {
  custGroup: string;
}

interface MasterData {
  custgroupList: Array<{ id: string; name: string; value: string }>;
}

interface SuspendedDeliveryState {
  records: SuspendedDeliveryRecord[];
  filter: FilterState;
  masterData: MasterData;
  loading: boolean;
  error: string | null;
  totalRecords: number;
  exportInProgress: boolean;
  searchInProgress: boolean;
}

// Initial filter state
export const initialSuspendedDeliveryFilterState: FilterState = {
  custGroup: '',
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
};

// Async thunks for API calls
export const fetchSuspendedDeliveryRecords = createAsyncThunk(
  'suspendedDelivery/fetchRecords',
  async (filterParams: FilterState, { rejectWithValue }) => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/suspended-delivery/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filterParams),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch suspended delivery records');
      }
      
      const data = await response.json();
      return data.records || [];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const fetchSuspendedDeliveryMasterData = createAsyncThunk(
  'suspendedDelivery/fetchMasterData',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/suspended-delivery/master-data');
      
      if (!response.ok) {
        throw new Error('Failed to fetch master data');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const exportSuspendedDeliveryRecords = createAsyncThunk(
  'suspendedDelivery/exportRecords',
  async (filterParams: FilterState, { rejectWithValue }) => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/suspended-delivery/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filterParams),
      });
      
      if (!response.ok) {
        throw new Error('Failed to export records');
      }
      
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

const suspendedDeliverySlice = createSlice({
  name: 'suspendedDelivery',
  initialState,
  reducers: {
    // Set filter values
    setSuspendedDeliveryFilter: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    
    // Reset all filters to initial state
    resetSuspendedDeliveryFilter: (state) => {
      state.filter = initialSuspendedDeliveryFilterState;
    },
    
    // Set master data for dropdowns
    setSuspendedDeliveryMasterData: (state, action: PayloadAction<Partial<MasterData>>) => {
      state.masterData = { ...state.masterData, ...action.payload };
    },
    
    // Set records after successful fetch
    setSuspendedDeliveryRecords: (state, action: PayloadAction<SuspendedDeliveryRecord[]>) => {
      state.records = action.payload;
      state.totalRecords = action.payload.length;
    },
    
    // Set loading state
    setSuspendedDeliveryLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error message
    setSuspendedDeliveryError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Clear any existing error
    clearSuspendedDeliveryError: (state) => {
      state.error = null;
    },
    
    // Set export in progress state
    setSuspendedDeliveryExportInProgress: (state, action: PayloadAction<boolean>) => {
      state.exportInProgress = action.payload;
    },
    
    // Set search in progress state
    setSuspendedDeliverySearchInProgress: (state, action: PayloadAction<boolean>) => {
      state.searchInProgress = action.payload;
    },
    
    // Clear all records
    clearSuspendedDeliveryRecords: (state) => {
      state.records = [];
      state.totalRecords = 0;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchSuspendedDeliveryRecords
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
        state.error = null;
      })
      .addCase(fetchSuspendedDeliveryRecords.rejected, (state, action) => {
        state.loading = false;
        state.searchInProgress = false;
        state.error = action.payload as string;
      });
    
    // Handle fetchSuspendedDeliveryMasterData
    builder
      .addCase(fetchSuspendedDeliveryMasterData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuspendedDeliveryMasterData.fulfilled, (state, action) => {
        state.loading = false;
        state.masterData = { ...state.masterData, ...action.payload };
        state.error = null;
      })
      .addCase(fetchSuspendedDeliveryMasterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Handle exportSuspendedDeliveryRecords
    builder
      .addCase(exportSuspendedDeliveryRecords.pending, (state) => {
        state.exportInProgress = true;
        state.error = null;
      })
      .addCase(exportSuspendedDeliveryRecords.fulfilled, (state) => {
        state.exportInProgress = false;
        state.error = null;
      })
      .addCase(exportSuspendedDeliveryRecords.rejected, (state, action) => {
        state.exportInProgress = false;
        state.error = action.payload as string;
      });
  },
});

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

// Export types
export type { SuspendedDeliveryRecord, FilterState, MasterData, SuspendedDeliveryState };