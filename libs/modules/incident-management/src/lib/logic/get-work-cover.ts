import { IncidentWorkCoverDTO } from '@cookers/models'; // Update with the correct path for your types
import { IncidentFormSchemaType } from '../components/incident-form/form-schema';
import { formattoJsonDate,getUserFromLocalStorage } from '@cookers/utils';
export const mapIncidentWorkCoverDetails = (
  currentValues: IncidentFormSchemaType
): IncidentWorkCoverDTO => {
  const acctvalue = currentValues;
  console.log("acctvalue",acctvalue)
  const sessionUser = getUserFromLocalStorage();
  return {
    incidentId: acctvalue.incidentId ? acctvalue.incidentId : 0,
    workClaimNo: acctvalue.workClaimNo ? acctvalue.workClaimNo : '',
    informDate: formattoJsonDate(acctvalue.informDateOn),
    insurer: acctvalue.insurer?acctvalue.insurer:'',
    //lastModifiedBy: sessionUser?.originator,
    //lastModifiedDate: formattoJsonDate(new Date()),
    claimStatus: acctvalue.claimStatus?acctvalue.claimStatus:'',
    claimLodgementOn: formattoJsonDate(acctvalue.claimLodgementOnDate),
    claimModifiedBy: sessionUser?.originator,
    claimApprovalOn: formattoJsonDate(acctvalue.claimApprovalOnDate),
    claimModifiedOn:formattoJsonDate(new Date()),
  
  };
 
};
