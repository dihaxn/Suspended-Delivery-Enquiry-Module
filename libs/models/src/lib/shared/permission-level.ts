export interface PermissionLevel {
  myRecordsOnly: boolean;
  myDepotOnly: boolean;
  myStateOnly: boolean;
  assignedDepotsOnly: boolean;
  nationalAccess: boolean;
  partialAccess: boolean;
  fullAccess: boolean;
  readOnly: boolean;
}
