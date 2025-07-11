import { useQuery } from '@tanstack/react-query';
import { getAxiosInstance } from '@cookers/services';
import { SalesOrderCustomerDetails } from '@cookers/models';

export const useCustomerDetailsQuery = (customerCode: string | null) => {
  return useQuery<SalesOrderCustomerDetails | null>({
    queryKey: ['customerDetails', customerCode],
    queryFn: async () => {
      if (!customerCode) return null;
      const response = await getAxiosInstance().get<SalesOrderCustomerDetails>(`orders-master/customer/${customerCode}`);
      return response.data;
    },
    enabled: !!customerCode,
  });
}; 