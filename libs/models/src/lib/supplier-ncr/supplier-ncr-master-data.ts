import { LookupTable, PermissionLevel, UpperLevelUsers } from '../shared';
export interface SupplierNcrMasterData {
  classificationList: LookupTable[];
  depotList: LookupTable[];
  personRaisedList: {
    originator: string;
    name: string;
    empId: number;
    occupation: string;
  }[];
  catalogList: {
    catlogCode: string;
    description: string;
    partNumber: string;
    displayDescription:string;
  }[];
  suppliersList: {
    supplierCode: string;
    name: string;
    state: string;
    telephone1: string;
    contact: string;
    description:string;
  }[];
  statusList: LookupTable[];
  analysisCalenderYearList: LookupTable[];
  analysisReportFilterList: LookupTable[];
  analysisPeriodList: LookupTable[];
  analysisYTDPeriodList: LookupTable[];
  showAnalysisReport: boolean;
  permissionLevel: PermissionLevel;
  upperLevelUsers: UpperLevelUsers;
  showCloseNCR: boolean;
  showUpdateNCR: boolean;
  showCreateNCR: boolean;
  showUpdateNCRWithSuppResponse: boolean;
 userList: {
    originator: string;
    name: string;
    empId: number;
    occupation: string;
    empStatus:number;
  }[];
  //   durationList: LookupTable[];
  //   reportTypeList: LookupTable[];
  //   workSiteList: LookupTable[];
  //   genderList: LookupTable[];
  //   jobTypeList: LookupTable[];
  //   optionList: LookupTable[];
  //   injuredPersonList: LookupTable[];
  //   firstAidList: LookupTable[];
  //   feasibleActionList: LookupTable[];
  //   claimStatusList: LookupTable[];
  //   insurerList: LookupTable[];
  //   documentTypeList: LookupTable[];
  //   incidentGridColumnList: GridColumn[];
  //   editOnlyFirstTwoSection: boolean;
  //   showWorkCover: boolean;
  //   editWorkCover: boolean;
  //   editFourthSection: boolean;
  //   userDropdownList: IncidentEmployeeModel[];
  //   userByDepotHierarchyDropdownList: IncidentEmployeeModel[];
  //   employeeDropdownDtoList: EmployeeDropdownDtoList[];
  //   carrierList: CarrierList[];
}
