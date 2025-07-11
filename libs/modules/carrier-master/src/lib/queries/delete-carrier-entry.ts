import { getAxiosInstance } from "@cookers/services";
export const deleteCarrierEntry = async (carrierCode: string) => {

  try {
    const response = await getAxiosInstance().delete(`/carrier/${carrierCode}`);

    return {
      success: true

    };
  } catch (error) {
    console.error("Error in delete carrier:", error);
    return {
      success: false

    };
  }
};