import { CustomerFeedbackFilter, DataType, IncidentsFilters, SupplierNcrFilters, CarrierFilters, TruckSettingsFilters, SalesOrderFilters, InvoiceFilters, MasterFileLogFilters } from '@cookers/models';
import { STORE, useStoreSelector } from '@cookers/store';

// Define the possible return types for the filters
// type Filters = IncidentsFilters | SupplierNcrFilters | TruckSettingsFilters | CustomerFeedbackFilter | CarrierFilters | SalesOrderFilters | Record<string, never> | undefined; // | OtherTypeData; // Adjust according to the actual types
// import { CustomerFeedbackFilter, DataType, IncidentsFilters, SupplierNcrFilters, CarrierFilters, TruckSettingsFilters, InvoiceFilters } from '@cookers/models';
// import { STORE, useStoreSelector } from '@cookers/store';

// Define the possible return types for the filters
type Filters = IncidentsFilters | SupplierNcrFilters | TruckSettingsFilters | CustomerFeedbackFilter | CarrierFilters | SalesOrderFilters | InvoiceFilters | MasterFileLogFilters | Record<string, never> | undefined; // | OtherTypeData; // Adjust according to the actual types

export const useFilters = (dataType: DataType): Filters => {
  const incidentFilter = useStoreSelector(STORE.IncidentManagement) as { filter: IncidentsFilters };
  const supplierNcrFilter = useStoreSelector(STORE.SupplierNcr) as { filter: SupplierNcrFilters };
  const truckSettingFilter = useStoreSelector(STORE.TruckSettings) as { filter: TruckSettingsFilters };
  const invoiceStore = useStoreSelector(STORE.Invoice) as { filter: InvoiceFilters };

  const customerFeedbackFilter = useStoreSelector(STORE.CustomerFeedback) as { filter: CustomerFeedbackFilter };
  const carrierFilter = useStoreSelector(STORE.CarrierMaster) as { filter: CarrierFilters };
  const salesOrderFilter = useStoreSelector(STORE.SalesOrder) as { filter: SalesOrderFilters };
  const masterFileLogFilter = useStoreSelector(STORE.MasterFileLog) as { filter: MasterFileLogFilters }; 

  switch (dataType) {
    case 'Incident': {
      return { ...incidentFilter.filter, originator: '' };
    }
    case 'Invoice': {
      return { ...invoiceStore.filter, originator: '' };
    }

    case 'SupplierNcr': {
      return { ...supplierNcrFilter.filter, originator: '' };
    }
    case 'TruckSettings': {
      return { ...truckSettingFilter.filter, originator: '' };
    }
    case 'CustomerFeedback': {
      return customerFeedbackFilter.filter;
    }
    case 'CarrierMaster': {
      return { ...carrierFilter.filter, originator: '' };
    }
    case 'SalesOrder': {
      return salesOrderFilter.filter;
    }
    case 'MasterFileLog': {
      return masterFileLogFilter.filter ;
    }

    default:
      return {} as Filters;
  }
};
