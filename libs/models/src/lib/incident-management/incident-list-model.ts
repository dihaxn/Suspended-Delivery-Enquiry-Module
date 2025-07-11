export interface IncidentsList {
  incidentId: number;
  reportType: string;
  reportTypeName: string;
  createdBy: string;
  createdDate?: Date;
  department: string;
  depotCode: string;
  depotName: string;
  empName: string;
  closedDate?: Date;
  status: string;
  statusName: string;
  supervisor: string;
}
