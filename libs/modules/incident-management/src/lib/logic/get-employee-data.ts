import { parseCustomDateNullableString2 } from '@cookers/utils'; // Adjust the import path for your utility function
import { setProxyReadOnlyFlag } from '@cookers/store';
import { fetchEmpDetails } from './get-emp-default-data';
export interface InitialValuesType {
  empName: string;
  eventEmpName: string,
  eventSupervisor: string;
  depotCode: string;
  empId: number;
  homePhone?: string;
  personalEmail?: string;
  occupation?: string;
  address?: string;
  gender: string;
  dob?: Date | undefined;
  department: string
}

export const getInitialFormValues = async (
  masterData: any
): Promise<InitialValuesType> => {
  const defaultValues: InitialValuesType = {
    empName: '',
    eventEmpName: "",
    eventSupervisor: '',
    depotCode: '',
    empId: 0,
    homePhone: '',
    personalEmail: '',
    occupation: '',
    address: '',
    gender: '',
    dob: undefined,
    department: ''
  };
  console.log("---------999999999999999999999999999999999999999999----bhathiya -------");
  console.log(masterData?.upperLevelUsers);
  const empName = masterData?.upperLevelUsers?.name;
  if (!empName) {
    return defaultValues;
  }

  try {
    console.log("-------------bhathiya -------");
    const empDetails = await fetchEmpDetails(empName);

    if (empDetails) {
      console.log("empDetails.dobOn", empDetails);

      return {
        empName: empDetails.name || '',
        eventEmpName: empDetails.name || '',
        eventSupervisor: empDetails.reportToName || '',
        depotCode: empDetails.depotCode || '',
        empId: empDetails.empId || 0,
        homePhone: empDetails.personalPhone || '',
        personalEmail: empDetails.personalEmail || '',
        occupation: empDetails.occupation || '',
        address: empDetails.homeAddress || '',
        gender: empDetails.gender || '',
        department: empDetails.department || '',
        dob: empDetails.dobOn ? parseCustomDateNullableString2(empDetails.dobOn) : undefined,
      };
    }
  } catch (error) {
    console.error('Error fetching employee details:', error);
  }

  return defaultValues;
};

