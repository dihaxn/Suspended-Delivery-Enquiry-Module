export interface EmployeeReport {
  empReportId: number,
    reportType: string,
    createdBy: string,
    createdDate?: Date,
    department: string,
    depotCode: string,
    empName: string,
    closedDate?: Date,
    status: string,
    supervisor: string
}



