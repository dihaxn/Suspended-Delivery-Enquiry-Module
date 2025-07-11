import { CarrierList } from "../carrier-data";
import { LookupTable } from "../shared/lookup-table";
import { UpperLevelUsers } from "../shared/upper-level-user";

export interface TruckSettingsMasterData {
    depotList: LookupTable[];
    truckTypeList: LookupTable[];
    totaliserTypeList: LookupTable[];
    onOffStatusList: LookupTable[];

    permissionLevel: {
        myRecordsOnly: boolean;
        myDepotOnly: boolean;
        myStateOnly: boolean;
        assignedDepotsOnly: boolean;
        nationalAccess: boolean;
        partialAccess: boolean;
        fullAccess: boolean;
        readOnly: boolean;
    };
    upperLevelUsers: UpperLevelUsers;
    oliveoilPrice: number;
    carrierList: CarrierList[];
}