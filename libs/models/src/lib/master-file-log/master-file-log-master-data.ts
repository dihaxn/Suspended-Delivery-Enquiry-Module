import { UpperLevelUsers } from "../shared/upper-level-user";

export interface MasterFileLogMasterData {

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
}