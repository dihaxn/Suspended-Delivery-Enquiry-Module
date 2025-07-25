import { DocDetailModel } from "@cookers/models";
import { getAxiosInstance } from "@cookers/services";

export const getCustomerFileContent = async (documentId: number) => {
  const URL = `complaints-docs/content`; // Need to change this
  let responseData = {} as DocDetailModel;
  await getAxiosInstance().get<DocDetailModel>(URL + '?documentId=' + documentId).then(function (response) {
    responseData = response.data;
  });
  return {
    incidentDocData: responseData
  };
};