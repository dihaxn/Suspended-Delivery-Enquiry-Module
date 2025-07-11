import { IncidentWorkCoverDTO } from '@cookers/models';
import { getAxiosInstance } from "@cookers/services";

export const postWorkCoverDetails = async (data: IncidentWorkCoverDTO) => {
  console.log(getAxiosInstance());
  const requestOptions = {
    method: 'post',
  };

  try {
    const response = await getAxiosInstance().post<IncidentWorkCoverDTO>(`incidents/workcover`, data, requestOptions);

    return {
      success: true

    };
  } catch (error) {
    console.error("Error in workcoverdetails:", error);
    return {
      success: false

    };
  }
};
