import { getBooleanEnvVar, getEnvVar, getJsonEnvVar } from '@cookers/utils';

export interface Options {
  isProd: boolean;
  uniqueKey: string;
  adsKeywords: string[];
  apiPath: string;
  appName: string;
}

class ConfigStore implements Options {
  public readonly uniqueKey: string;
  public readonly isProd: boolean;
  public readonly adsKeywords: string[];
  public readonly apiPath: string;
  public readonly apiMockPath: string;
  public readonly appName: string;
  public readonly mockOn: boolean;
  public readonly apiWso2Path: string;
  public readonly baseToken: string;
  public readonly hostName: string;

  constructor() {
    this.isProd = getBooleanEnvVar('NX_PUBLIC_COOKERS_PROD');
    this.uniqueKey = getEnvVar('NX_PUBLIC_COOKERS_KEY');
    this.isProd = getBooleanEnvVar('NX_PUBLIC_COOKERS_PROD');
    this.adsKeywords = getJsonEnvVar('NX_PUBLIC_COOKERS_KEYWORDS');
    this.apiPath = getEnvVar('NX_PUBLIC_COOKERS_API_PATH');
    this.appName = getEnvVar('NX_PUBLIC_COOKERS_APP_NAME');
    this.mockOn = getBooleanEnvVar('NX_PUBLIC_COOKERS_API_MOCK_ON');
    this.apiMockPath = getEnvVar('NX_PUBLIC_COOKERS_API_MOCK_PATH');
    this.apiWso2Path = getEnvVar('NX_PUBLIC_COOKERS_API_WSO2_PATH');
    this.baseToken = getEnvVar('NX_PUBLIC_COOKERS_TOKEN');
    this.hostName = getEnvVar('NX_PUBLIC_COOKERS_HOST_NAME');

  }
}

export const configStore = new ConfigStore();
