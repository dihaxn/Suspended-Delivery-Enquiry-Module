import { IncidentFormValue } from './incident-entry-models';
export interface IncidentSummaryModel extends IncidentFormValue{
  depotCodeLabel: string;
  genderTypeLabel: string;
  normalOvertimeLabel: string;
  anyInjuryLabel: string;
  olispillLabel: string;
  areaContainLabel: string;
  injuryInvolveLabel: string;
  authInformLabel: string;
  whoInvolveLabel: string;
  othVehicleInvolveLabel: string;
  firstAidTypeLabel: string;
  workInformLabel: string;
  notifyHoLabel: string;
  feasibleActionTypeLabel: string;
  evidenceAttachLabel: string;
  signedByAllLabel: string;
  anyInstructionLabel: string;
  workSiteLabel:string;
  statusLabel:string;
  reportTypeLabel:string;
  acceptOnBehalfEmpLabel:string;
  emergencyServiceLabel: string;
}
