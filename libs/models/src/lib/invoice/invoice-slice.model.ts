import { VisibilityState } from '@tanstack/react-table';
import { FilterItem } from '../shared';
import { InvoiceFilters } from './invoice-filters.model';
import { InvoiceListItem } from './invoice-list.model';
import { InvoiceMasterData } from './invoice-master-data.model';

export interface InvoiceState {
  selectedInvoice?: InvoiceListItem;
  masterData: InvoiceMasterData;
  filter: InvoiceFilters;
  selectedInvoices: InvoiceListItem[];
  columnFilters: FilterItem[];
  columnVisibility: VisibilityState;
  isOpenEmailPopup: boolean;
  emailType : EmailType ;
  isOpenVerifyDownloadPopup: boolean;
  unverifiedInvoices: {
    message : string,
    invoices : string[];
  };
}

export enum EmailType {
  OneOff = 'one-off',
  NonSigned = 'non-signed',
  Signed = 'signed'
}
