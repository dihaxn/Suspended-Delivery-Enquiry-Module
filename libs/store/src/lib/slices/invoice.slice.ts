import { DefaultInvoiceFilters, DefaultInvoiceMasterData, EmailType, InvoiceState } from '@cookers/models';
import { encodeArrayForQueryParam, getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { createSlice } from '@reduxjs/toolkit';

const initialState: InvoiceState = {
  masterData: DefaultInvoiceMasterData,
  selectedInvoices: [],
  filter: {
    ...DefaultInvoiceFilters,
    originator: getUserFromLocalStorage()?.originator ?? '',
    proxyUser: getProxyUserFromLocalStorage()?.userName ?? '',
    dateFrom: new Date().toISOString(),
    dateTo: new Date().toISOString(),
  },
  columnFilters: [],
  columnVisibility: { carrierCode: true, conNote: true },
  isOpenEmailPopup: false,
  emailType: EmailType.NonSigned,
  isOpenVerifyDownloadPopup: false,
  unverifiedInvoices: {
    message: '',
    invoices: [],
  },
};

const updateEncodedColumnFilters = (state: InvoiceState) => {
  state.filter.columnFilters = encodeArrayForQueryParam(state.columnFilters.map((filter) => ({ [filter.id]: filter.value })));
  console.log(
    'updated filters',
    state.columnFilters.map((filter) => ({ [filter.id]: filter.value }))
  );
};

const updateEncodedDynamicColumn = (state: InvoiceState) => {
  const visibleColumns = Object.entries(state.columnVisibility)
    .filter(([_, value]) => value === true)
    .map(([key]) => key);
  state.filter.dynamicColumns = encodeArrayForQueryParam(visibleColumns);
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setSelectedInvoice: (state, action) => {
      state.selectedInvoice = action.payload;
    },
    setInvoiceMasterData: (state, action) => {
      state.masterData = action.payload;
    },
    setInvoiceFilters: (state, action) => {
      state.filter = action.payload;
      updateEncodedColumnFilters(state);
    },
    setSelectedInvoices: (state, action) => {
      state.selectedInvoices = action.payload;
    },
    addColumnFilter: (state, action) => {
      const newFilter = action.payload;
      const updatedFilters = state.columnFilters.filter((filter) => filter.id !== newFilter.id);
      state.columnFilters = updatedFilters;
      if (newFilter.value.length > 0) {
        state.columnFilters.push(newFilter);
      }
    },
    removeColumnFilter: (state, action) => {
      const filterToRemove = action.payload;
      state.columnFilters = state.columnFilters.filter((filter) => filter.id !== filterToRemove.id);
    },
    removeAllColumnFilters: (state) => {
      state.columnFilters = [];
    },
    setColumnVisibility: (state, action) => {
      state.columnVisibility = action.payload;
      updateEncodedDynamicColumn(state);
    },
    setIsOpenEmailPopup: (state, action) => {
      state.isOpenEmailPopup = action.payload.isOpen;
      state.emailType = action.payload.emailType;
    },
    setIsOpenVerifyDownloadPopup: (state, action) => {
      state.isOpenVerifyDownloadPopup = action.payload;
    },
    setUnverifiedInvoices: (state, action) => {
      state.unverifiedInvoices = action.payload;
    }
  },
});

export const { setSelectedInvoice, setInvoiceMasterData, setInvoiceFilters, setSelectedInvoices, addColumnFilter, removeColumnFilter, removeAllColumnFilters, setColumnVisibility, setIsOpenEmailPopup, setIsOpenVerifyDownloadPopup, setUnverifiedInvoices } = invoiceSlice.actions;
export default invoiceSlice.reducer;
