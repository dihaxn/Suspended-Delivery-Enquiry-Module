import { LookupTable, PermissionLevel, UpperLevelUsers } from '../shared';
import { Carrier } from './sales-order-carriers';

export interface CustomerBasicData {
  custCode: string;
  name: string;
  address: string;
  telephone: string;
  custMarket: string;
  marketDesc: string;
  displayName: string;
}

export interface SalesOrderMasterData {
    carrierList: Carrier[];
    depotList: LookupTable[];
    orderTypeList: LookupTable[];
    customerList: LookupTable[];
    marketStatusList: LookupTable[];
    orderNoList: LookupTable[];
    statusList: LookupTable[];
    parentCustomerList: LookupTable[];
    custGroupList: LookupTable[];
    productTypeList: LookupTable[];
    catalogList: {
      catlogCode: string;
      description: string;
      partNumber: string;
      displayDescription: string;
      displayName: string;
    }[];
    showCloseOrder: boolean;
    showUpdateOrder: boolean;
    showCreateOrder: boolean;
    showUpdateOrderWithSuppResponse: boolean;
    permissionLevel: PermissionLevel;
    upperLevelUsers: UpperLevelUsers;
}