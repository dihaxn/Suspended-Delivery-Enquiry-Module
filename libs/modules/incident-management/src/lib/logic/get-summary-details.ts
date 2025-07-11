
import { GlobalMasterData, IncidentMasterData, IncidentSummaryModel,LookupTable } from '@cookers/models';
import { IncidentFormSchemaType } from '../components/incident-form/form-schema';
import { formattoDate, formattoJsonDate } from '@cookers/utils';
export const getLabelByValue = (value: string, options: LookupTable[]): string => {
    return options.find(option => option.value === value)?.label || '';
  };
export const getIncidentSummaryDetails = (
  data: IncidentFormSchemaType, 
  masterData: IncidentMasterData,
  globalMasterData:GlobalMasterData
): IncidentSummaryModel => {
  const summaryModel = { } as IncidentSummaryModel;
  summaryModel.reportType=data.reportType;
  summaryModel.empId= data.empId;
  summaryModel.empName= data.empName;
  summaryModel.eventEmpName= data.eventEmpName;
  summaryModel.status=data.status;
  summaryModel.refCode=data.refCode||'';
  summaryModel.reportTypeLabel = getLabelByValue(data.reportType || '', masterData.reportTypeList);
  summaryModel.statusLabel = getLabelByValue(data.status || '', masterData.statusList);
  summaryModel.workSiteLabel = getLabelByValue(data.worksite || '', masterData.workSiteList);
  summaryModel.depotCodeLabel = getLabelByValue(data.depotCode || '', masterData.depotList);
  summaryModel.genderTypeLabel = getLabelByValue(data.gender || '', masterData.genderList);
  summaryModel.normalOvertimeLabel = getLabelByValue(data.normalOvertime || '', masterData.jobTypeList);
  summaryModel.anyInjuryLabel = getLabelByValue(data.anyInjury || '', globalMasterData.optionList);
  summaryModel.olispillLabel = getLabelByValue(data.oilSpill || '', globalMasterData.optionList);
  summaryModel.injuryInvolveLabel = getLabelByValue(data.injuryInvolve || '', globalMasterData.optionList);
  summaryModel.authInformLabel = getLabelByValue(data.authInform || '', globalMasterData.optionList);
  summaryModel.whoInvolveLabel = getLabelByValue(data.whoInvolve || '', masterData.injuredPersonList);
  summaryModel.othVehicleInvolveLabel = getLabelByValue(data.othVehicleInvolve || '', globalMasterData.optionList);
  summaryModel.firstAidTypeLabel = getLabelByValue(data.firstAidType || '', masterData.firstAidList);
  summaryModel.workInformLabel = getLabelByValue(data.workInform || '', globalMasterData.optionList);
  summaryModel.notifyHoLabel = getLabelByValue(data.notifyHo || '', globalMasterData.optionList);
  summaryModel.feasibleActionTypeLabel = getLabelByValue(data.feasibleActionType || '', masterData.feasibleActionList);
  summaryModel.evidenceAttachLabel = getLabelByValue(data.evidenceAttach || '', globalMasterData.optionList);
  summaryModel.signedByAllLabel = getLabelByValue(data.signedByAll || '', globalMasterData.optionList);
  summaryModel.anyInstructionLabel = getLabelByValue(data.anyInstruction || '', globalMasterData.optionList);
  summaryModel.emergencyServiceLabel=getLabelByValue(data.outsideService || '', globalMasterData.optionList);
    summaryModel.dobOn=formattoDate(data.dob);
    summaryModel.address= data.address|| '',
    summaryModel.homePhone= data.homePhone|| '',
    summaryModel.personalEmail= data.personalEmail|| '',
    summaryModel.department= data.department||'',
    summaryModel.occupation= data.occupation|| '',
    summaryModel.accidentPlace= data.accidentPlace,
    summaryModel.eventOn=formattoJsonDate(data.eventOnDate);
    summaryModel.jobPerformed=data.jobPerformed;
    summaryModel.instruction=data.instruction||'';
    summaryModel.eventDesc=data.eventDesc;
    summaryModel.witnesses=data.witnesses ||'';
    summaryModel.eventSupervisor=data.eventSupervisor||'';
    summaryModel.eventLogOn=formattoDate(data.eventLogOnDate);
    summaryModel.incidentDec=data.incidentDec||'';
    summaryModel.containTime=formattoJsonDate(data.containTimeDate);
    summaryModel.containNote=data.containNote||'';
    summaryModel.involverName=data.involverName||'';
    summaryModel.involverEmail=data.involverEmail||'';
    summaryModel.involverContact=data.involverContact||'';
    summaryModel.involverAddress=data.involverAddress||'';
    summaryModel.cookersTruck=data.cookersTruck||'';
    summaryModel.driver=data.driver||'';
    summaryModel.driverLicence=data.driverLicence||'';
    summaryModel.driverCondi=data.driverCondi||'';
    summaryModel.vehicleCondi=data.vehicleCondi||'';
    summaryModel.actionTaken=data.actionTaken||'';
    summaryModel.othDriver=data.othDriver||'';
    summaryModel.othDriverContact=data.othDriverContact||'';
    summaryModel.othDriverLicence=data.othDriverLicence||'';
    summaryModel.othVehicle=data.othVehicle||'';
    summaryModel.othDriverCondi=data.othDriverCondi||'';
    summaryModel.othVehicleCondi=data.othVehicleCondi||'';
    summaryModel.othActionTaken=data.othActionTaken||'';
    summaryModel.firstAider=data.firstAider||'';
    summaryModel.injuryReportedOn=formattoJsonDate(data.injuryReportedOnDate);
    summaryModel.injuryReportedTo=data.injuryReportedTo||'';
    summaryModel.injuryNature=data.injuryNature||'';
    summaryModel.partInjured=data.partInjured||'';
    summaryModel.doctor=data.doctor||'';
    summaryModel.hospital=data.hospital||'';
    summaryModel.treatment=data.treatment||'';
    summaryModel.informDate=formattoDate(data.informDateOn);
    summaryModel.workClaimNo=data.workClaimNo||'';
    //summaryModel.aiderName=data.aiderName||'';
   // summaryModel.firstAidOn=formattoDate(data.firstAidOnDate);
    summaryModel.immCorrectAction=data.immCorrectAction||'';
    summaryModel.immActionOn=formattoDate(data.immActionOnDate);
    summaryModel.immActionBy=data.immActionBy||'';
    summaryModel.feasibleActionOn=formattoDate(data.feasibleActionOnDate);
    summaryModel.feasibleReminderOn=formattoDate(data.feasibleReminderDate);
     summaryModel.feasibleAction=data.feasibleAction||'';
     summaryModel.completeOn=formattoDate(data.completeOnDate);
    summaryModel.feasibleActionBy=data.feasibleActionBy||'';
    summaryModel.supervisor=data.supervisor||'';
    summaryModel.supervisorOn=formattoDate(data.supervisorOnDate);
    summaryModel.manager=data.manager||'';
    summaryModel.managerComm=data.managerComm||'';
    summaryModel.managerOn=formattoDate(data.managerOnDate);
    summaryModel.areaContainLabel = (data.areaContain===true )?"Yes":'';
    summaryModel.acceptOnBehalfEmpLabel=(data.acceptOnBehalfEmp==true)?"Yes":'No';
    summaryModel.empAcceptBy=data.empAcceptBy ||'';
    summaryModel.empAcceptOn=data.empAcceptOn ||'';
    summaryModel.mgrAcceptBy=data.mgrAcceptBy ||'';
    summaryModel.mgrAcceptOn=data.mgrAcceptOn ||'';
    summaryModel.empAcceptByName=data.empAcceptByName ||'';
    summaryModel.mgrAcceptByName=data.mgrAcceptByName ||'';
    summaryModel.outsideServiceName=data.outsideServiceName ||'';
  return summaryModel;
};
