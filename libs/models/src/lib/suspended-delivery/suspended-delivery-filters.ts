export interface SuspendedDeliveryFilters {
  customerGroup: string;
  searchcustgroup: string;
  originator?: string;
  proxyUser?: string;
  customerCode: string;
  customerName: string;
  custGroup: string;
  ETAfresh: Date;
  ETAUCO:Date;
  BDMCode: string;
  carrierCode: string;
  contact: string;
  phone: string;
  mobile: string;
  email: string;
  suspensionComments: string;
}

export const initialSuspendedDeliveryFilterState: SuspendedDeliveryFilters = {
  customerGroup: '',
  searchcustgroup: 'All',
  originator: '',
  proxyUser: '',
  customerCode: '',
  customerName: '',
  custGroup: '',
  ETAfresh: new Date(),
  ETAUCO: new Date(),
  BDMCode: '',
  carrierCode: '',
  contact: '',
  phone: '',
  mobile: '',
  email: '',
  suspensionComments: '',
};

