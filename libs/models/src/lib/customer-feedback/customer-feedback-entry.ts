import { LookupTable } from '../shared';

export interface CustomerFeedbackEntryPermission {
  canEditDetailsBlock: boolean;
  canViewDetailsBlock: boolean;
  canEditActionsBlock: boolean;
  canViewActionsBlock: boolean;
  canEditCloseOutBlock: boolean;
  canViewCloseOutBlock: boolean;
  canSaveEntry: boolean;
  canInvestigateEntry: boolean;
  canCloseEntry: boolean;
}

export interface FeedbackDetails {
  raisedBy: string | LookupTable;
  complaintOnDate: string;
  feedbackType: string | LookupTable;
  nature: string | LookupTable;
  issue: string;
}

export interface CustomerDetails {
  custCode: string | LookupTable;
  contact: string;
  phone: string;
  address: string;
  depotCode: string | LookupTable;
  customerName: string;
  displayName?: string;
  size: string | LookupTable;
}

export interface ProductDetails {
  catlogCode: string | { label: string; value: string; other: string };
  batchNo: string;
  packType: string;
  domDate: string;
}

export interface CommunicationDetails {
  recordedBy: string | LookupTable;
  whatDiscussed: string;
  sampleTaken: string;
  sampleCollectedBy: string | LookupTable;
  sampleQty: string;
  sampleCollectedOnDate: string;
}

export interface ComplaintRequest {
  complaintId: number;
  refCode: string;
  createdOnDate: string;
  createdBy: string;
  status: string;
  lastModifiedOnDate: string;
  lastModifiedBy: string;
  feedbackDetails: FeedbackDetails;
  customerDetails: CustomerDetails;
  productDetails: ProductDetails;
  communicationDetails: CommunicationDetails;
}

export interface ComplaintImmediateAct {
  immActionBy: string | LookupTable;
  immActionOnDate: string;
  immediateAction: string;
  productIsolated: string;
  investigation: string;
  issueDueTo: string;
  corrActionToCookers: string;
  corrActionToCust: string;
}

export interface ComplaintCorrectiveAct {
  corrActionBy: string | LookupTable;
  corrActionOnDate: string;
  corrActionDesc: string;
}

export interface ComplaintPreventativeAct {
  preventActionBy: string | LookupTable;
  corrActionComplOnDate: string;
  corrActionComplDesc: string;
  corrActionFixIssue: string;
  corrActionNeedToDo: string;
}

export interface ComplaintCloseout {
  custResSentBy: string | LookupTable;
  custResOnDate: string;
  custResComments: string;
  completedBy: string | LookupTable;
  completedOnDate: string;
  title: string;
}

export interface ComplaintResource {
  documentId: number;
  complaintId: number;
  documentName: string;
  attachedOnDate: string;
  attachedBy: string;
  path: string;
  stepId: number;
  documentFile: string;
  extension: string;
  detailedExtension: string;
}

export interface ComplaintActions {
  immediateActions: ComplaintImmediateAct;
  correctiveActions: ComplaintCorrectiveAct;
  preventativeActions: ComplaintPreventativeAct;
}

export interface CustomerFeedbackEntryInterface {
  complaintRequest: ComplaintRequest;
  complaintActions: ComplaintActions;
  complaintCloseout: ComplaintCloseout;
  requestCreatedDateTime: string;
  actionType?: string;
  complaintResource: ComplaintResource[];
}

export const DefaultCustomerFeedbackEntry: CustomerFeedbackEntryInterface = {
  complaintRequest: {
    complaintId: 0,
    refCode: '',
    createdOnDate: '',
    createdBy: '',
    status: '',
    lastModifiedOnDate: '',
    lastModifiedBy: '',
    feedbackDetails: {
      raisedBy: '',
      complaintOnDate: '',
      feedbackType: '',
      nature: '',
      issue: '',
    },
    customerDetails: {
      custCode: '',
      contact: '',
      phone: '',
      address: '',
      size: '',
      depotCode: '',
      customerName: '',
    },
    productDetails: {
      catlogCode: '',
      batchNo: '',
      packType: '',
      domDate: '',
    },
    communicationDetails: {
      recordedBy: '',
      whatDiscussed: '',
      sampleTaken: 'N',
      sampleCollectedBy: '',
      sampleQty: '',
      sampleCollectedOnDate: '',
    },
  },
  complaintActions: {
    immediateActions: {
      immActionBy: '',
      immActionOnDate: '',
      immediateAction: '',
      productIsolated: '',
      investigation: '',
      issueDueTo: '',
      corrActionToCookers: '',
      corrActionToCust: '',
    },
    correctiveActions: {
      corrActionBy: '',
      corrActionOnDate: '',
      corrActionDesc: '',
    },
    preventativeActions: {
      preventActionBy: '',
      corrActionComplOnDate: '',
      corrActionComplDesc: '',
      corrActionFixIssue: 'Y',
      corrActionNeedToDo: '',
    },
  },
  complaintCloseout: {
    custResSentBy: '',
    custResOnDate: '',
    custResComments: '',
    completedBy: '',
    completedOnDate: '',
    title: '',
  },
  requestCreatedDateTime: '',
  complaintResource: [],
};
