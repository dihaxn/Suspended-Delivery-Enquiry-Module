import { SuspendedDeliveryFilters } from "./suspended-delivery-filters";
import { SuspendedDeliveryList } from "./suspended-delivery-list";

export interface MasterData {
  custgroupList: Array<{ id: string; name: string; value: string }>;
}

export interface SuspendedDeliveryState {
  records: SuspendedDeliveryList[];
  filter: SuspendedDeliveryFilters;
  masterData: MasterData;
  loading: boolean;
  error: string | null;
  totalRecords: number;
  exportInProgress: boolean;
  searchInProgress: boolean;
  quickview: SuspendedDeliveryList | null;
}

export const defaultMasterData: MasterData = {
  custgroupList: [],
};