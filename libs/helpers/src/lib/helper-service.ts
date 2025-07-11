// helperService.ts
type HelperServiceFunction = (...args: any[]) => any;

class HelperService {
  private static instance: HelperService;
  private services: { [key: string]: HelperServiceFunction } = {};

  private constructor() {}

  public static getInstance(): HelperService {
    if (!HelperService.instance) {
      HelperService.instance = new HelperService();
    }
    return HelperService.instance;
  }

  public registerService(
    serviceName: string,
    serviceFunction: HelperServiceFunction
  ): void {
    this.services[serviceName] = serviceFunction;
  }

  public getService<T>(serviceName: string, ...args: any[]): T {
    const serviceFunction = this.services[serviceName];
    if (!serviceFunction) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return serviceFunction(...args);
  }
}

export const helperService = HelperService.getInstance();
