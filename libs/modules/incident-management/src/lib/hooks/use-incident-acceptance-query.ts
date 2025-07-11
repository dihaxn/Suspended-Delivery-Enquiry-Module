import { IncidentAcceptanceDTO } from '@cookers/models';
import { getAxiosInstance } from "@cookers/services";

export const postIncidentAcceptanceDetails = async (data: IncidentAcceptanceDTO) => {
  console.log(getAxiosInstance());
  const requestOptions = {
    method: 'post',
  };

  const URL = `incidents-accept`; // Replace with the appropriate endpoint
  try {
    const response = await getAxiosInstance().post<IncidentAcceptanceDTO>(`incidents/accept`, data, requestOptions);

    return {
      success: true

    };
  } catch (error) {
    console.error("Error in postUserDetails:", error);
    return {
      success: false

    };
  }
};
