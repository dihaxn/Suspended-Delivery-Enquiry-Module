export interface InvoiceFilters {
  duration: string;
  custGroup: string;
  productType: string;
  enquiryMode: string;
  dateFrom: Date | string;
  dateTo: Date | string;
  dateRange: string;
  originator: string;
  masterParent: string;
  gLBatchNo?: number;
  proxyUser: string;
  archivedData: boolean;
  dynamicColumns: string;
  columnFilters: string;
}

export const DefaultInvoiceFilters: InvoiceFilters = {
  duration: 'today',
  custGroup: 'All',
  productType: 'F',
  enquiryMode: 'NOML',
  dateFrom: '',
  dateTo: '',
  dateRange: '',
  masterParent: '',
  originator: '',
  proxyUser: '',
  archivedData: false,
  gLBatchNo: undefined,
  dynamicColumns: '%5B%22carrierCode%22%2C%22conNote%22%5D',
  columnFilters: ''
};
