import { LookupTable, PermissionLevel, UpperLevelUsers } from '../shared';
export interface CarrierMasterData {
  truckTypeList: LookupTable[];
  depotList: LookupTable[];
  contactList: {
    originator: string;
    name: string;
    empId: number;
  }[];
  driverList: {
    driverId: number;
    driverName: string;
   empId:number;
   isExists:boolean;
  }[];
   allDriverList: {
    driverId: number;
    driverName: string;
   empId:number;
   isExists:boolean;
  }[];
  permissionLevel: PermissionLevel;
  upperLevelUsers: UpperLevelUsers;
  showCreateCarrier: boolean;
  showEditCarrier: boolean;
  showDeleteCarrier: boolean;
}
