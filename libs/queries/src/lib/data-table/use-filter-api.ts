import { DataType } from '@cookers/models';

export const useFilterApi = (dataType: DataType): string => {
  switch (dataType) {
    case 'Incident': {
      return 'incidents';
    }

    case 'SupplierNcr': {
      return 'supplier-ncr';
    }

    case 'TruckSettings': {
      return 'truck-settings';
    }
    case 'CustomerFeedback': {
      return 'complaints';
    }

    case 'System': {
      return 'SystemData';
    }
    case 'CarrierMaster': {
      return 'carrier';
    }
    case 'SalesOrder': {
      return 'orders';
    }
    case 'Invoice': {
      return 'invoices'; // mock URL
    }
    case 'MasterFileLog': {
      return 'master-logs';
    }
    default:
      return '';
  }
};
