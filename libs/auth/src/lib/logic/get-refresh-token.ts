import { WSO2Token } from "@cookers/models";
import { getAuthInstance } from "@cookers/services";
import { getWso2TokenFromLocalStorage } from '@cookers/utils';

export const getRefreshToken = async () => {

    const refresh_token: string = getWso2TokenFromLocalStorage()?.refresh_token || '';

    const api = '?grant_type=refresh_token&refresh_token=' + refresh_token;
    let responseData = {} as WSO2Token;
    await getAuthInstance().post<WSO2Token>(api).then(function (response) {
        responseData = response.data;
    });

    return {
        wso2Data: responseData
    };
};