import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getApiBaseURL } from '.';
import { getWso2TokenFromLocalStorage } from '@cookers/utils';
import { getRefreshToken } from '@cookers/auth';

let axiosInstance: AxiosInstance;

export const getAxiosInstance = () => {
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: getApiBaseURL(),
    });

    axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // const access_token = localStorage.getItem('wso2Token'); 
        const access_token_time = parseInt(localStorage.getItem('wso2TokenTime') || '0');
        const timeNow = Date.now();

        // console.log('getRefreshToken');
        // console.log(access_token_time);
        // console.log(timeNow);
        // console.log(((timeNow - access_token_time) / 60000));

        if (((timeNow - access_token_time) / 60000) > 430) {
          const { wso2Data } = await getRefreshToken();
          // console.log(wso2Data);
          if (wso2Data.access_token !== '') {
            localStorage.setItem('wso2Token', JSON.stringify(wso2Data));
            localStorage.setItem('wso2TokenTime', JSON.stringify(Date.now()));
          }
        }


        const access_token: string = getWso2TokenFromLocalStorage()?.access_token || '';
        //console.log(access_token);
        if (config.headers) {
          //config.headers['Content-Type'] = 'application/soap+xm';
          config.headers['Cookie'] = undefined;
          config.headers['Authorization'] = 'Bearer ' + access_token;
          //console.log(access_token);
        }

        // Check if user has a valid session before sending the request
        // if (hasAuth()) await checkValidSession(true);
        // console.log('AXIOS-HEADER: ', config);

        return config;
      }
    );
  }

  return axiosInstance;
};


