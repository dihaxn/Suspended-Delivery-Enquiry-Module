import { LookupTable } from '../shared';

interface PermissionLevel {
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
}

interface UpperLevelUsers {
  originator: string;
  name: string;
  reportToName: string;
  levelUpReportToName: string;
  defaultDepotCode: string;
  empId: number;
}
export interface InvoiceMasterData {
  durationList: LookupTable[];
  customerGroup: LookupTable[];
  productType: LookupTable[];
  enquiryMode: LookupTable[];
  permissionLevel: PermissionLevel;
  upperLevelUsers: UpperLevelUsers;
  carrierList: LookupTable[];
  statusList: LookupTable[];
  depotList: LookupTable[];
  customerList: { name: string; custCode: string }[];
  catalogList: {
    catlogCode: string;
    description: string;
    partNumber: string;
    displayName: string;
  }[];
  repList: {
    name: string;
    repCode: string;
  }[];
  archivalDate: string;
  kovisUrl: string;
  kovisUrlEndParam: string;
}

export const DefaultInvoiceMasterData: InvoiceMasterData = {
  durationList: [],
  customerGroup: [],
  productType: [],
  enquiryMode: [],
  depotList: [],
  permissionLevel: {
    myRecordsOnly: false,
    reportingRecordsOnly: false,
    myDepotOnly: false,
    myStateOnly: false,
    assignedDepotsOnly: false,
    nationalAccess: false,
    partialAccess: false,
    fullAccess: false,
    readOnly: false,
    noPermission: false,
  },
  upperLevelUsers: {
    originator: '',
    name: '',
    reportToName: '',
    levelUpReportToName: '',
    defaultDepotCode: '',
    empId: 0,
  },
  carrierList: [],
  statusList: [],
  customerList: [],
  catalogList: [],
  repList: [],
  archivalDate: '',
  kovisUrl: '',
  kovisUrlEndParam: '',
};

export const InvoiceStatus = {
  T: 'Transferred',
  C: 'Cancelled',
  N: 'New',
  P: 'Printed',
};
