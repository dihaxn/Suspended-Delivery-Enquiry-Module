import { DocDetailModel } from '@cookers/models';
export interface IncidentWorkCoverDTO {
  incidentId: number;
 // lastModifiedBy: string;
 // lastModifiedDate: string;
  insurer: string;
  claimLodgementOn: string;
  claimStatus: string;
  claimModifiedBy: string;
  claimApprovalOn: string;
  claimModifiedOn: string;
  workClaimNo:string;
  informDate:string;
}
