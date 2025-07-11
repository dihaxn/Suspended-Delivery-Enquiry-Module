import { SupplierNcrMasterData } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { STORE, useStoreSelector } from '@cookers/store';
import { useQuery } from '@tanstack/react-query';
import { SupplierNcrFormSchemaApiType, SupplierNcrFormSchemaType } from '../schema';

const fetchSupplierNcrFormData = async (supplierNcrId: number) => {
  const response = await getAxiosInstance().get<SupplierNcrFormSchemaApiType>(`supplier-ncr/${supplierNcrId}`);
  return response.data;
};

const modifyJsonFields = (data: SupplierNcrFormSchemaApiType, masterData: SupplierNcrMasterData): SupplierNcrFormSchemaType => {
  const supplierObj = masterData.suppliersList.find((supplier) => supplier.supplierCode === data.supplierNcrRequest.supplierCode);
  const catalogObj = masterData.catalogList.find((catalog) => catalog.catlogCode === data.supplierNcrRequest.catalogCode); //entry:46 CANOLANA
  const raisedByObj = masterData.personRaisedList.find((person) => person.originator === data.supplierNcrRequest.raisedBy);
  const raisedName = data.supplierNcrRequest.status === 'C' ? masterData.userList.find((person) => person.originator === data.supplierNcrRequest.raisedBy)?.name ?? '' : '';

  const newData = {
    ...data,
    supplierNcrRequest: {
      ...data.supplierNcrRequest,
      supplierCode: { label: supplierObj?.description??'', value: supplierObj?.supplierCode??'' },
      catalogCode: { label: catalogObj?.displayDescription??'', value: catalogObj?.catlogCode??'', other: catalogObj?.partNumber??'' },
      raisedBy: { label: raisedByObj?.name ?? '', value: raisedByObj?.originator ?? '' },
    },
    supplierNcrCloseOut: {
      ...data.supplierNcrCloseOut,
      anyFurtherAction: data.supplierNcrCloseOut.anyFurtherAction === '' && data.supplierNcrRequest.status === 'RC' ? 'Y' : data.supplierNcrCloseOut.anyFurtherAction,
    },
    raisedByName: raisedName,
  };

  console.log('newData', newData);

  return newData;
};
export const useSupplierNcrFormQuery = (supplierNcrId: number) => {
  const { masterData } = useStoreSelector(STORE.SupplierNcr);

  const { data, error, isLoading, isFetching, refetch } = useQuery<SupplierNcrFormSchemaApiType, Error, SupplierNcrFormSchemaType>({
    queryKey: ['supplier-ncr-entry-query', supplierNcrId],
    queryFn: () => fetchSupplierNcrFormData(supplierNcrId),
    enabled: !!supplierNcrId,
    staleTime: 0,
    retryDelay: 1000,
    select: (data) => modifyJsonFields(data, masterData),
  });

  return {
    supplierNcrData: data,
    error,
    isLoading,
    isFetching,
    refetch,
  };
};
