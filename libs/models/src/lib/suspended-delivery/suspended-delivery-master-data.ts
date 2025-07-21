import { LookupTable } from '../shared/lookup-table';

export interface SuspendedDeliveryMasterData {
  custGroup: LookupTable[];
}

export const defaultSuspendedDeliveryMasterData: SuspendedDeliveryMasterData = {
  custGroup: [],
};
