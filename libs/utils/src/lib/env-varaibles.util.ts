import { getBooleanEnvVar, getEnvVar, getJsonEnvVar } from '.';

export interface Options {
  isProd: boolean;
  uniqueKey: string;
  adsKeywords: string[];
  apiPath: string;
}

class EnvConfig implements Options {
  private readonly NX_PUBLIC_COOKERS_KEY = getEnvVar('NX_PUBLIC_COOKERS_KEY');

  private readonly NX_COOKERS_PROD: boolean =
    getBooleanEnvVar('NX_COOKERS_PROD');

  private readonly NX_PUBLIC_COOKERS_KEYWORDS: string[] = getJsonEnvVar(
    'NX_PUBLIC_COOKERS_KEYWORDS'
  );

  private readonly NX_COOKERS_API_PATH = getEnvVar(`NX_COOKERS_API_PATH`);

  public readonly uniqueKey: string;
  public readonly isProd: boolean;
  public readonly adsKeywords: string[];
  public readonly apiPath: string;

  constructor() {
    this.uniqueKey = this.NX_PUBLIC_COOKERS_KEY;
    console.log(this.uniqueKey);
    this.isProd = this.NX_COOKERS_PROD;

    this.apiPath = this.NX_COOKERS_API_PATH;

    this.adsKeywords = this.NX_PUBLIC_COOKERS_KEYWORDS;
  }
}

export const config = new EnvConfig();
