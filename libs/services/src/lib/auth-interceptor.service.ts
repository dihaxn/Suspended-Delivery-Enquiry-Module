import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getWso2ApiBaseURL,getWso2BaseToken } from '.';

let axiosInstance: AxiosInstance;

export const getAuthInstance = () => {
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: getWso2ApiBaseURL(),
    });     

    axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (config.headers) {
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          config.headers['Authorization'] = 'Basic ' + getWso2BaseToken();
        }
        return config;
      }
    );      
  }
  return axiosInstance;
};
