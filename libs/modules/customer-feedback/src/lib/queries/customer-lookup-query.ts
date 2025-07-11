import { CustomerInterface, LookupTable } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { useQuery } from '@tanstack/react-query';

const fetchCustomerBasicDepotData = async (depotCode: string) => {
  const response = await getAxiosInstance().get<CustomerInterface[]>(`customer/basic-depot?depotCode=${depotCode}`);
  return response.data;
};

export const useCustomerBasicDepotQuery = (depotCode: string | LookupTable) => {
  const _depotCode = typeof depotCode === 'string' ? depotCode : depotCode.value;
  const { data, error, isLoading, isFetching, refetch } = useQuery<CustomerInterface[], Error, CustomerInterface[]>({
    queryKey: ['customer-list-by-deport', _depotCode],
    queryFn: () => fetchCustomerBasicDepotData(_depotCode),
    enabled: !!depotCode && depotCode !== 'all',
    staleTime: 0,
    retryDelay: 1000,
  });

  return {
    customerBasicDepotData: data,
    error,
    isLoading,
    isFetching,
    refetch,
  };
};
