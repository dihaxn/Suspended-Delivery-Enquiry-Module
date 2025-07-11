import { LookupTable } from '../shared';

export interface InvoiceEntryPermission {
  canEditDetailsBlock: boolean;
  canViewDetailsBlock: boolean;
  canSaveEntry: boolean;
  canPrintEntry: boolean;
}

export interface InvoiceDetails {
  productType: string | LookupTable;
  invoiceType: string | LookupTable;
  customer: string | LookupTable;
  customerOrderNo: string;
  dateShipped: string;
  carrierCode: string | LookupTable;
  invoiceNo: string;
}

export interface InvoiceAddressDetails {
  address1: string;
  address2: string;
  suburb: string;
  state: string;
  postalCode: string;
}

export interface InvoiceCustomerDetails {
  contact: string;
  telephone: string;
  bdm: string;
  fax: string;
  creditStatus: string;
}

export interface InvoiceProductDetails {
  products: Array<{
    product: string;
    market: string;
    marketDesc?: string;
    depot: string;
    depotName?: string;
    uom: string;
    qty: number;
    price: number;
    netAmount: number;
    dateShipped: string;
    gst: number;
  }>;
}

export interface InvoiceEntryInterface {
  actionType?: string;
  invoiceDetails: InvoiceDetails;
  addressDetails: InvoiceAddressDetails;
  customerDetails: InvoiceCustomerDetails;
  productDetails: InvoiceProductDetails;
  gstAmount: number;
  netTotal: number;
}

export const DefaultInvoiceEntry: InvoiceEntryInterface = {
  invoiceDetails: {
    productType: '',
    invoiceType: '',
    customer: { label: '', value: '' },
    customerOrderNo: '',
    dateShipped: '',
    carrierCode: { label: '', value: '' },
    invoiceNo: '',
  },
  addressDetails: {
    address1: '',
    address2: '',
    suburb: '',
    state: '',
    postalCode: '',
  },
  customerDetails: {
    contact: '',
    telephone: '',
    bdm: '',
    fax: '',
    creditStatus: '',
  },
  productDetails: {
    products: [],
  },
  gstAmount: 0,
  netTotal: 0,
};
