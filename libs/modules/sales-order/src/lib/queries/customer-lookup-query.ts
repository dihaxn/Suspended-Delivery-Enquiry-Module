import { LookupTable } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { useQuery } from '@tanstack/react-query';

interface CustomerBasicResponse {
  value: string;
  label: string;
}

export const useCustomerBasicQuery = () => {
  const { data, error, isLoading, isPending, isFetching, refetch } = useQuery<CustomerBasicResponse[]>({
    queryKey: ['customer-basic-data-query'],
    queryFn: async () => {
      const response = await getAxiosInstance().get('customer/basic');
      return response.data.map((customer: CustomerBasicResponse) => ({
        ...customer,
        label: `${customer.value} - ${customer.label}`
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (cacheTime)
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    customerBasicData: data,
    error,
    isLoading,
    isPending,
    isFetching,
    refetch,
  };
}; 