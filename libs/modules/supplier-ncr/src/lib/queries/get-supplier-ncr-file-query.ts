import { DocDetailModel } from "@cookers/models";
import { getAxiosInstance } from "@cookers/services";

export const getFileContent = async (documentId: number) => {
  const URL = `supplier-ncr/content`;
  let responseData = {} as DocDetailModel;
  await getAxiosInstance().get<DocDetailModel>(URL + '?documentId=' + documentId).then(function (response) {
    responseData = response.data;
  });
  return {
    incidentDocData: responseData
  };
};