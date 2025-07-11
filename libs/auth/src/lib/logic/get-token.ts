import { WSO2Token } from "@cookers/models";
import { getAuthInstance } from "@cookers/services";

export const getToken = async (username: string, password: string) => {
  let integerUser = parseInt(username);
  if (!isNaN(integerUser) && username === '' + integerUser)
    username = 'driver' + username;


  const api = '?grant_type=password' + '&username=' + username + '&password=' + encodeURIComponent(password);
  let responseData = {} as WSO2Token;
  await getAuthInstance().post<WSO2Token>(api).then(function (response) {
    responseData = response.data;
  });

  return {
    wso2Data: responseData
  };
};