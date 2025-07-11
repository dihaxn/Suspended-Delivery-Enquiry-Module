import { IncidentAcceptanceDTO } from '@cookers/models'; // Update with the correct path for your types
import { IncidentFormSchemaType } from '../components/incident-form/form-schema';
import { formattoJsonDate,getUserFromLocalStorage} from '@cookers/utils';
export const mapIncidentAcceptanceDetails = (
  status: string,
  currentValues: IncidentFormSchemaType
): IncidentAcceptanceDTO => {
  const acctvalue = currentValues;
  console.log("acctvalue",acctvalue)
  const sessionUser = getUserFromLocalStorage();
  if (status === "E") {
    return {
      incidentId: acctvalue.incidentId ? acctvalue.incidentId : 0,
      status: "M",
      lastModifiedBy: sessionUser?.originator,
      lastModifiedDate: formattoJsonDate(new Date()),
      empAcceptBy: sessionUser?.originator,
      empAcceptOn: formattoJsonDate(new Date()),
      acceptOnBehalfEmp: acctvalue.acceptOnBehalfEmp===true ? 1 : 0,
      mgrAcceptBy: "",
      mgrAcceptOn: "",
      acceptType: "E",
      incidentResource: acctvalue.incidentResource,
      ipAddress:sessionUser?.ipaddress
    };
  } else if (status === "M") {
    return {
      incidentId: acctvalue.incidentId ? acctvalue.incidentId : 0,
      status: "C",
      lastModifiedBy: sessionUser?.originator,
      lastModifiedDate: formattoJsonDate(new Date()),
      empAcceptBy: "",
      empAcceptOn: "",
      acceptOnBehalfEmp: 0,
      mgrAcceptBy: sessionUser?.originator,
      mgrAcceptOn: formattoJsonDate(new Date()),
      acceptType: "M",
      ipAddress:sessionUser?.ipaddress,
      incidentResource: [],
    };
  }

  throw new Error("Invalid status");
};
