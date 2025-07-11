export interface SalesOrderCustomerDetails {
  permissionLevel: {
    myRecordsOnly: boolean;
    reportingRecordsOnly: boolean;
    myDepotOnly: boolean;
    myStateOnly: boolean;
    assignedDepotsOnly: boolean;
    nationalAccess: boolean;
    partialAccess: boolean;
    fullAccess: boolean;
    readOnly: boolean;
    noPermission: boolean;
  } | null;
  upperLevelUsers: {
    originator: string;
    name: string;
    reportToName: string;
    levelUpReportToName: string;
    defaultDepotCode: string;
    empId: number;
  } | null;
  addressList: Array<{
    assigneeNo: number;
    name: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postcode: string;
    addressType: string;
    contact: string;
    telephone: string;
    fax: string;
  }>;
  streetAddress: {
    assigneeNo: number;
    name: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postcode: string;
    addressType: string;
    contact: string;
    telephone: string;
    fax: string;
  };
  customerPriceList: Array<{
    catlogCode: string;
    description: string;
    price: number;
    nextDue: string;
    delFrequency: string;
    woRebateRate: number;
    brand: string;
    carrierCode: string | null;
    assetRate: number;
    payPeriod: string | null;
    uomOrder: string;
    market: string;
    marketDesc: string;
  }>;
  customerDetails: {
    creditStatus: string;
    repName: string;
    depotName: string;
    depotCode: string;
    custMarket: string;
  };
} 