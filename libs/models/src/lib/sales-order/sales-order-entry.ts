import { LookupTable } from '../shared';

export interface SalesOrderListInterface {
  orderId: number;
  orderNo: string;
  status: string;
  customerName: string;
  dateOrdered: string;
  createdDate: string;
  customerOrderNo: string;
  orderType: string;
}

export interface SalesOrderEntryInterface {
  actionType?: string;
  orderDetails: {
    orderNo?: string;
    status?: string;
    customerCode: {
      label: string;
      value: string;
    };
    dateOrdered: string;
    customerOrderNo: string;
    orderType: string;
    orderTypeVal?: string;
    plistNo?: string;
    contractNo?: string;
  };
  customerDetails: {
    contact: string;
    telephone: string;
    repName?: string;
    fax: string;
    crStatus?: string;
  };
  addressDetails: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  carrierDetails: {
    carrier: {
      label: string;
      value: string;
    } | string;
    reason: string;
    specialInstruction: string;
  };
  productDetails: {
    products: Array<{
      product: string;
      price: number;
      interval: string;
      dateRequired: string;
      uom: string;
      dow: string;
      market?: string;
      depot?: string;
      qty?: number;
      netAmt?: number;
      plistNo?: number;
    }>;
  };
}

export interface SalesOrderEntryPermission {
  canEditDetailsBlock: boolean;
  canViewDetailsBlock: boolean;
  canSaveEntry: boolean;
  canCloseEntry: boolean;
  canCancelPList: boolean;
  canCancelOrder: boolean;
}

export const DefaultSalesOrderEntry: SalesOrderEntryInterface = {
  orderDetails: {
    customerCode: { label: '', value: '' },
    dateOrdered: '',
    customerOrderNo: '',
    orderType: '',
    orderTypeVal: '',
    plistNo: '',
    contractNo: '',
  },
  customerDetails: {
    contact: '',
    telephone: '',
    fax: '',
  },
  addressDetails: {
    address1: '',
    city: '',
    state: '',
    postalCode: '',
  },
  carrierDetails: {
    carrier: { label: '', value: '' },
    reason: '',
    specialInstruction: '',
  },
  productDetails: {
    products: [],
  },
}; 