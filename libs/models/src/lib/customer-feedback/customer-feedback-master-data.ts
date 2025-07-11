import { LookupTable } from '../shared/lookup-table';
import { CustomerFeedbackEntryPermission } from './customer-feedback-entry';

interface UserPermissions {
  r: CustomerFeedbackEntryPermission;
  i: CustomerFeedbackEntryPermission;
  c: CustomerFeedbackEntryPermission;
  showAnalysisReport: boolean;
  showFPMUReport: boolean;
}

export interface CustomerFeedbackMasterData {
  depotList: LookupTable[];
  feedbackTypeList: LookupTable[];
  natureList: LookupTable[];
  issueList: LookupTable[];
  statusList: LookupTable[];
  personRaisedList: { originator: string; name: string; empId: number; occupation: string; status: number }[];
  activeUsers: { originator: string; name: string; empId: number; occupation: string; status: number }[];
  customerList: CustomerInterface[];
  optionList: LookupTable[];
  sizeList: LookupTable[];
  catalogList: {
    catlogCode: string;
    description: string;
    partNumber: string;
    displayDescription: string;
    displayName: string;
  }[];

  // ← expanded to match API
  permissionLevel: {
    myRecordsOnly: boolean;
    reportingRecordsOnly: boolean;
    myDepotOnly: boolean;
    myStateOnly: boolean;
    noPermission: boolean;
    assignedDepotsOnly: boolean;
    fullAccess: boolean;
    nationalAccess: boolean;
    partialAccess: boolean;
    readOnly: boolean;
  };
  showAnalysisReport: boolean;
  showFPMUReport: boolean;
  upperLevelUsers: null | {
    originator: string;
    name: string;
    reportToName: string;
    levelUpReportToName: string;
  };

  analysisCalenderYearList: LookupTable[];
  analysisReportFilterList: LookupTable[];
  analysisYTDPeriodList: LookupTable[];
  analysisPeriodList: LookupTable[];
  feedbackClassificationList: LookupTable[];
  issueClassificationList: LookupTable[];
  permission: UserPermissions;
}

const DefaultPermissions: UserPermissions = {
  r: {
    canEditDetailsBlock: false,
    canViewDetailsBlock: false,
    canEditActionsBlock: false,
    canViewActionsBlock: false,
    canEditCloseOutBlock: false,
    canViewCloseOutBlock: false,
    canSaveEntry: false,
    canInvestigateEntry: false,
    canCloseEntry: false,
  },
  i: {
    canEditDetailsBlock: false,
    canViewDetailsBlock: false,
    canEditActionsBlock: false,
    canViewActionsBlock: false,
    canEditCloseOutBlock: false,
    canViewCloseOutBlock: false,
    canSaveEntry: false,
    canInvestigateEntry: false,
    canCloseEntry: false,
  },
  c: {
    canEditDetailsBlock: false,
    canViewDetailsBlock: false,
    canEditActionsBlock: false,
    canViewActionsBlock: false,
    canEditCloseOutBlock: false,
    canViewCloseOutBlock: false,
    canSaveEntry: false,
    canInvestigateEntry: false,
    canCloseEntry: false,
  },
  showAnalysisReport: false,
  showFPMUReport: false,
};
// ── default values ──

export interface CustomerInterface {
  address: string;
  custCode: string;
  custMarket: string;
  marketDesc: string;
  displayName: string;
  name: string;
  telephone: string;
}

export const DefaultCustomerFeedbackMasterData: CustomerFeedbackMasterData = {
  depotList: [],
  feedbackTypeList: [],
  natureList: [],
  issueList: [],
  statusList: [],
  personRaisedList: [],
  activeUsers: [],
  customerList: [],
  optionList: [],
  catalogList: [],
  analysisCalenderYearList: [],
  analysisReportFilterList: [],
  analysisYTDPeriodList: [],
  analysisPeriodList: [],
  sizeList: [],
  feedbackClassificationList: [],
  issueClassificationList: [],
  permission: DefaultPermissions,
  permissionLevel: {
    myRecordsOnly: false,
    reportingRecordsOnly: false,
    myDepotOnly: false,
    myStateOnly: false,
    noPermission: false,
    assignedDepotsOnly: false,
    fullAccess: false,
    nationalAccess: false,
    partialAccess: false,
    readOnly: false,
  },
  showAnalysisReport: false,
  showFPMUReport: false,
  upperLevelUsers: null,
};
