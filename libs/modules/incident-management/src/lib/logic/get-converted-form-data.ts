import { IncidentFormSchemaType } from '../components/incident-form/form-schema';
import { formattoJsonDate } from '@cookers/utils';
import { IncidentFormValue } from '@cookers/models';
export const processIncidentForm = (data: IncidentFormSchemaType, incidentId: number, originator: string):IncidentFormValue => {
  let apiData = {} as IncidentFormValue;
 console.log(apiData,incidentId);
 if (incidentId !== 0) {
  apiData.createdBy=data.createdBy;
  apiData.createdDate=formattoJsonDate(data.createdOn);
   /* if(data.status==="C"){
      apiData.closedBy=originator;
      apiData.closedDate=formattoJsonDate(new Date());
    } */
    /* if(data.status==="C"){
      apiData.closedBy=originator;
      apiData.closedDate=formattoJsonDate(new Date());
    } */
  } else {
    apiData.createdBy = originator; 
    apiData.createdDate = formattoJsonDate(data.createdOn);
  }
  if(data.status==="O" && data.internalStatus==="E"){
    data.status="E"
  }
  apiData.lastModifiedBy=originator;
  apiData.lastModifiedDate=formattoJsonDate(new Date());
  apiData.incidentId = incidentId;
  apiData.incidentResource= data.incidentResource;
  apiData.reportType= data.reportType;
  apiData.worksite= data.worksite;
  apiData.status= data.status;
  apiData.empId= data.empId;
  apiData.empName= data.empName;
  apiData.homePhone= data.homePhone?data.homePhone:"";
  apiData.address= data.address?data.address:"";
  apiData.gender= data.gender? data.gender:"";
  apiData.department= data.department?data.department:"";
  apiData.depotCode= data.depotCode;
  apiData.occupation= data.occupation?data.occupation:"";
  apiData.personalEmail= data.personalEmail?data.personalEmail:"";
  apiData.normalOvertime= data.normalOvertime;
  apiData.jobPerformed= data.jobPerformed;
  apiData.accidentPlace= data.accidentPlace;
  apiData.witnesses= data.witnesses?data.witnesses:"";
  apiData.eventSupervisor= data.eventSupervisor?data.eventSupervisor:"";
  apiData.anyInstruction= data.anyInstruction;
  apiData.instruction= data.instruction?data.instruction:"";
  apiData.eventDesc= data.eventDesc;
  apiData.eventEmpName= data.eventEmpName;
  apiData.anyInjury= data.anyInjury?data.anyInjury:"";
  apiData.oilSpill= data.oilSpill?data.oilSpill:"";
  apiData.authInform= data.authInform?data.authInform:"";
  apiData.containNote= data.containNote?data.containNote:"";
  apiData.incidentDec= data.incidentDec?data.incidentDec:"";
  apiData.injuryInvolve= data.injuryInvolve?data.injuryInvolve:"";
  apiData.whoInvolve= data.whoInvolve?data.whoInvolve:"";
  apiData.involverName= data.involverName?data.involverName:"";
  apiData.involverContact= data.involverContact?data.involverContact:"";
  apiData.involverAddress= data.involverAddress?data.involverAddress:"";
  apiData.involverEmail= data.involverEmail?data.involverEmail:"";
  apiData.cookersTruck= data.cookersTruck?data.cookersTruck:"";
  apiData.regoNo=data.regoNo?data.regoNo:"";
  apiData.driver= data.driver?data.driver:"";
  apiData.driverLicence= data.driverLicence?data.driverLicence:"";
  apiData.driverCondi= data.driverCondi?data.driverCondi:"";
  apiData.vehicleCondi= data.vehicleCondi?data.vehicleCondi:"";
  apiData.actionTaken= data.actionTaken?data.actionTaken:"";
  apiData.othVehicleInvolve= data.othVehicleInvolve?data.othVehicleInvolve:"";
  apiData.othDriver= data.othDriver?data.othDriver:"";
  apiData.othDriverLicence= data.othDriverLicence?data.othDriverLicence:"";
  apiData.othDriverContact= data.othDriverContact?data.othDriverContact:"";
  apiData.othVehicle= data.othVehicle?data.othVehicle:"";
  apiData.othDriverCondi= data.othDriverCondi?data.othDriverCondi:"";
  apiData.othVehicleCondi= data.othVehicleCondi?data.othVehicleCondi:"";
  apiData.othActionTaken= data.othActionTaken?data.othActionTaken:"";

  apiData.firstAider= data.firstAider?data.firstAider:"";
  apiData.injuryReportedTo= data.injuryReportedTo?data.injuryReportedTo:"";
  apiData.injuryNature= data.injuryNature?data.injuryNature:"";
  apiData.partInjured= data.partInjured?data.partInjured:"";
  apiData.doctor= data.doctor?data.doctor:"";
  apiData.hospital= data.hospital?data.hospital:"";
  apiData.treatment= data.treatment?data.treatment:"";
  //apiData.aiderName= data.aiderName?data.aiderName:"";
  apiData.workInform= data.workInform?data.workInform:"";
  apiData.notifyHo= data.notifyHo?data.notifyHo:"";
  apiData.workClaimNo= data.workClaimNo?data.workClaimNo:"";
  
  apiData.immCorrectAction= data.immCorrectAction?data.immCorrectAction:"";
  apiData.immActionBy= data.immActionBy?data.immActionBy:"";
  apiData.feasibleAction= data.feasibleAction?data.feasibleAction:"";
  apiData.feasibleActionBy= data.feasibleActionBy?data.feasibleActionBy:"";
  apiData.supervisor= data.supervisor?data.supervisor:"";
  apiData.managerComm= data.managerComm?data.managerComm:"";
  apiData.manager= data.manager?data.manager:"";
  apiData.signedByAll= data.signedByAll?data.signedByAll:"";
  apiData.refCode= data.refCode?data.refCode:"";
  apiData.driverId= data.driverId;
  apiData.evidenceAttach= data.evidenceAttach?data.evidenceAttach:"";
  apiData.dobOn = formattoJsonDate(data.dob);
  apiData.eventOn = formattoJsonDate(data.eventOnDate);
  apiData.eventLogOn = formattoJsonDate(data.eventLogOnDate);
 // apiData.firstAidOn = formattoJsonDate(data.firstAidOnDate);
  apiData.injuryReportedOn = formattoJsonDate(data.injuryReportedOnDate);
  apiData.immActionOn = formattoJsonDate(data.immActionOnDate);
  apiData.feasibleActionOn = formattoJsonDate(data.feasibleActionOnDate);
  apiData.feasibleReminderOn = formattoJsonDate(data.feasibleReminderDate);
  apiData.completeOn = formattoJsonDate(data.completeOnDate);
  apiData.supervisorOn = formattoJsonDate(data.supervisorOnDate);
  apiData.managerOn = formattoJsonDate(data.managerOnDate);
  apiData.informDate = formattoJsonDate(data.informDateOn);
  apiData.containTime=formattoJsonDate(data.containTimeDate);
  apiData.firstAidType = (data.firstAidType && data.firstAidType !== "Select") ? data.firstAidType : "";
  apiData.feasibleActionType = (data.feasibleActionType && data.feasibleActionType !== "Select") ? data.feasibleActionType : "";
  apiData.insurer = (data.insurer && data.insurer !== "Select") ? data.insurer : "";
  apiData.claimStatus = (data.claimStatus && data.claimStatus !== "Select") ? data.claimStatus : "";
  apiData.claimApprovalOn = formattoJsonDate(data.claimApprovalOnDate);
  apiData.claimLodgementOn = formattoJsonDate(data.claimLodgementOnDate);
  apiData.furtherCorrectAction= data.furtherCorrectAction?data.furtherCorrectAction:"";
  apiData.outsideService=data.outsideService?data.outsideService:"";
  apiData.outsideServiceName= data.outsideServiceName?data.outsideServiceName:"";
  apiData.areaContain= (data.areaContain && data.areaContain === true) ? "Y" : "";
  apiData.acceptOnBehalfEmp= (data.acceptOnBehalfEmp === true) ? 1 : 0;
  return apiData;
};
