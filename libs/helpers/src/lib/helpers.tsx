import { helperService } from './helper-service';

class Helper {
  private static instance: Helper;

  private constructor() {}

  public static getInstance(): Helper {
    if (!Helper.instance) {
      Helper.instance = new Helper();
    }
    return Helper.instance;
  }

  public call<T>(serviceName: string, ...args: any[]): T {
    return helperService.getService<T>(serviceName, ...args);
  }
}

export const helper = Helper.getInstance();
