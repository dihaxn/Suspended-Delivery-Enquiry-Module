import { DocDetailModel } from '@cookers/models';
export interface IncidentAcceptanceDTO {
  incidentId: number;
  status: string;
  //createdBy: string;
  //createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;

  incidentResource: DocDetailModel[];

  empAcceptBy: string;
  empAcceptOn: string;
  acceptOnBehalfEmp: number;
  mgrAcceptBy: string;
  mgrAcceptOn: string;
  acceptType: string;
  ipAddress :string;
}
