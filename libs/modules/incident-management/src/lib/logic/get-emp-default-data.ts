import { getAxiosInstance } from '@cookers/services';
import { AxiosResponse } from 'axios';
import { UpperLevelUsers, EmployeeDetails } from '@cookers/models';

export const fetchEmpUpperLevelData = async (empname: string) => {
    if (!empname) {
        throw new Error('Employee name is required');
    }

    const response: AxiosResponse<UpperLevelUsers> = await getAxiosInstance().get<UpperLevelUsers>(`master-hierarchy/upper-users?name=${empname}`);

    if (response.status === 200 && response.data) {
        return response.data;
    } else {
        throw new Error('Failed to fetch data');
    }
};
export const fetchEmpDetails = async (empname: string) => {
    if (!empname) {
        throw new Error('Employee name is required');
    }
    console.log(empname);
    const response: AxiosResponse<EmployeeDetails> = await getAxiosInstance().get<EmployeeDetails>(`employee-details?name=${empname}`);

    if (response.status === 200 && response.data) {
        return response.data;
    } else {
        throw new Error('Failed to fetch data');
    }
};
