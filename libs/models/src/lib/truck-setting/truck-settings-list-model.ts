export interface TruckSettingList {
    settingId: any;
    truckId: number;
    truckName: string;
    licensePlate: string;
    driverId: number;
    driverName: string;
    maintenanceDueDate: Date;
    status: string;
    depot: string;
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
    version: string;
    truckType: string;
    totaliserType: string;
    totaliser1: string;
    totaliser2: string;
    packagedOilCode: string;
    oliveoilPrice: number;
}