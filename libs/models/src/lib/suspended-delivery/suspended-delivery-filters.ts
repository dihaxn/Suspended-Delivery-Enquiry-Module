export interface SuspendedDeliveryFilters {
  customerGroup: string;
  searchcustgroup: string;
  originator?: string;
  proxyUser?: string;
}

export const initialSuspendedDeliveryFilterState: SuspendedDeliveryFilters = {
  customerGroup: '',
  searchcustgroup: 'All',
  originator: '',
  proxyUser: '',
};

