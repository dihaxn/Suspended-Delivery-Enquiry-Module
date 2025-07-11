import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getApiBaseURL } from '.';

let axiosInstance: AxiosInstance;

export const getUploadInstance = () => {
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: getApiBaseURL(),
    });

    axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (config.headers) {
          config.headers['Cookie'] = undefined;
        }
        return config;
      }
    );
  }

  return axiosInstance;
};
