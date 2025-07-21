export interface SuspendedDeliveryFilters {
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
  originator: '',
  proxyUser: '',
  customerCode: '',
  customerName: '',
  custGroup: 'All',
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

