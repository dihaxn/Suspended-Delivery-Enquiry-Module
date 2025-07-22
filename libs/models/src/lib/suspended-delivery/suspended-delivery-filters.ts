export interface SuspendedDeliveryFilters {
  originator?: string;
  proxyUser?: string;
  customerCode: string;
  customerName: string;
  custGroup: string;
  ETAFresh: string;
  ETAUCO:string;
  BDMCode: string;
  carrierCode: string;
  contact: string;
  phone: string;
  mobile: string;
  email: string;
  suspensionComments: string;
}

export const initialSuspendedDeliveryFilterState: SuspendedDeliveryFilters = {
  originator: '',
  proxyUser: '',
  customerCode: '',
  customerName: '',
  custGroup: 'All',
  ETAFresh: '',
  ETAUCO:'',
  BDMCode: '',
  carrierCode: '',
  contact: '',
  phone: '',
  mobile: '',
  email: '',
  suspensionComments: '',
};

