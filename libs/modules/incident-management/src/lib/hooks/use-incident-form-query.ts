import { IncidentFormValue } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { parseCustomDateNullableString, parseCustomDateString } from '@cookers/utils';
import { useQuery } from '@tanstack/react-query';
import { IncidentFormSchemaType } from '../components/incident-form/form-schema';
const fetchIncidentFormData = async (incidentId: string) => {
  const response = await getAxiosInstance().get<IncidentFormValue>(`incidents/${incidentId}`);
  //const modifiedData = modifyJsonFields(response.data);
  return response.data;
};
const modifyJsonFields = (data: IncidentFormValue): IncidentFormSchemaType => {
  const modifiedData: IncidentFormSchemaType = {
    incidentResource: data.incidentResource,
    incidentId: data.incidentId,
    reportType: data.reportType,
    worksite: data.worksite,
    status: data.status,
    empId: data.empId,
    empName: data.empName,
    homePhone: data.homePhone,
    address: data.address,
    gender: data.gender,
    department: data.department,
    depotCode: data.depotCode,
    occupation: data.occupation,
    personalEmail: data.personalEmail,
    normalOvertime: data.normalOvertime,
    jobPerformed: data.jobPerformed,
    accidentPlace: data.accidentPlace,
    witnesses: data.witnesses,
    eventSupervisor: data.eventSupervisor,
    anyInstruction: data.anyInstruction,
    instruction: data.instruction,
    eventDesc: data.eventDesc,
    eventEmpName: data.eventEmpName,
    anyInjury: data.anyInjury,
    oilSpill: data.oilSpill !== '' ? data.oilSpill : undefined,
    areaContain: data.areaContain === 'Y' ? true : undefined,
    authInform: data.authInform !== '' ? data.authInform : undefined,
    containNote: data.containNote,
    incidentDec: data.incidentDec,
    injuryInvolve: data.injuryInvolve !== '' ? data.injuryInvolve : undefined,
    whoInvolve: data.whoInvolve !== '' ? data.whoInvolve : undefined,
    involverName: data.involverName,
    involverContact: data.involverContact,
    involverAddress: data.involverAddress,
    cookersTruck: data.cookersTruck,
    driver: data.driver,
    driverLicence: data.driverLicence,
    driverCondi: data.driverCondi,
    vehicleCondi: data.vehicleCondi,
    actionTaken: data.actionTaken,
    othVehicleInvolve: data.othVehicleInvolve !== '' ? data.othVehicleInvolve : undefined,
    othDriver: data.othDriver,
    othDriverLicence: data.othDriverLicence,
    othDriverContact: data.othDriverContact,
    othVehicle: data.othVehicle,
    othDriverCondi: data.othDriverCondi,
    othVehicleCondi: data.othVehicleCondi,
    othActionTaken: data.othActionTaken,
    firstAider: data.firstAider,
    injuryReportedTo: data.injuryReportedTo,
    injuryNature: data.injuryNature,
    partInjured: data.partInjured,
    doctor: data.doctor,
    hospital: data.hospital,
    treatment: data.treatment !== null ? data.treatment : '',
    //aiderName: data.aiderName !== null ? data.aiderName : '',
    workInform: data.workInform !== '' ? data.workInform : undefined,
    notifyHo: data.notifyHo !== '' ? data.notifyHo : undefined,
    workClaimNo: data.workClaimNo,
    immCorrectAction: data.immCorrectAction,
    immActionBy: data.immActionBy,
    feasibleAction: data.feasibleAction,
    feasibleActionBy: data.feasibleActionBy,
    supervisor: data.supervisor,
    managerComm: data.managerComm,
    manager: data.manager,
    signedByAll: data.signedByAll,
    createdBy: data.createdBy,
    closedBy: data.closedBy,
    refCode: data.refCode,
    driverId: data.driverId,
    evidenceAttach: data.evidenceAttach !== '' ? data.evidenceAttach : undefined,
    // Transforming the fields as needed
    dob: parseCustomDateNullableString(data.dobOn),
    eventOnDate: parseCustomDateString(data.eventOn),
    eventLogOnDate: parseCustomDateString(data.eventLogOn),
    immActionOnDate: parseCustomDateNullableString(data.immActionOn),
    completeOnDate: parseCustomDateNullableString(data.completeOn),
    supervisorOnDate: parseCustomDateNullableString(data.supervisorOn),
    managerOnDate: parseCustomDateNullableString(data.managerOn),
    feasibleActionOnDate: parseCustomDateNullableString(data.feasibleActionOn),
    feasibleReminderDate: parseCustomDateNullableString(data.feasibleReminderOn),
    createdOn: parseCustomDateNullableString(data.createdDate),
    containTimeDate: parseCustomDateNullableString(data.containTime),

    involverEmail: data.involverEmail === '' ? null : data.involverEmail,
   // confirmEmail: data.personalEmail, // Assigning personalEmail to confirmEmail
   // firstAidOnDate: parseCustomDateNullableString(data.firstAidOn),
    injuryReportedOnDate: parseCustomDateNullableString(data.injuryReportedOn),
    informDateOn: parseCustomDateNullableString(data.informDate),
    claimLodgementOnDate: parseCustomDateNullableString(data.claimLodgementOn),
    claimApprovalOnDate: parseCustomDateNullableString(data.claimApprovalOn),
    // Handling empty strings and assigning default values
    firstAidType: data.firstAidType === '' ? 'Select' : data.firstAidType,
    feasibleActionType: data.feasibleActionType === '' ? 'Select' : data.feasibleActionType,
    claimStatus: data.claimStatus === '' ? 'Select' : data.claimStatus,
    insurer: data.insurer === '' ? 'Select' : data.insurer,
    furtherCorrectAction: data.furtherCorrectAction !== '' ? data.furtherCorrectAction : undefined,
    outsideService: data.outsideService !== '' ? data.outsideService : undefined,
    outsideServiceName: data.outsideServiceName,
    regoNo:data.regoNo,
    acceptOnBehalfEmp:(data.acceptOnBehalfEmp===1)? true : false,
    empAcceptBy:data.empAcceptBy,
    empAcceptOn:data.empAcceptOn,
    mgrAcceptBy:data.mgrAcceptBy,
    mgrAcceptOn:data.mgrAcceptOn,
    internalStatus:data.status,
    confirmByEmp:(data.status==="M")? true : false,
    confirmByMgr:(data.status==="C")? true : false,
    createdByName: data.createdByName,
    empAcceptByName: data.empAcceptByName,
    mgrAcceptByName: data.mgrAcceptByName,
    treatmentgiven: (data.doctor!=='')?"B":"A"
  };

  return modifiedData;
};
export const useIncidentFormQuery = (incidentId: string) => {
  const { data, error, isLoading, isFetching, refetch } = useQuery<IncidentFormValue, Error, IncidentFormSchemaType>({
    queryKey: ['incident-entry-query', incidentId],
    queryFn: () => fetchIncidentFormData(incidentId),
    enabled: !!incidentId, // Only run the query if Id is provided
    staleTime: 0,
    retryDelay: 1000,
    select: modifyJsonFields,
  });

  return {
    incidentData: data,
    error,
    isLoading,
    isFetching,
    refetch,
  };
};
