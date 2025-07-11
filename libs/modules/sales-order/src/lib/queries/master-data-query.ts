import { getAxiosInstance } from '@cookers/services';
import { getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { useQuery } from '@tanstack/react-query';
import { SalesOrderMasterData } from '@cookers/models';

const URL = `/orders-master`;

const fetchSalesOrderMasterData = async (originator: string, proxyUser: string) => {
  const query = `?originator=${encodeURIComponent(originator)}&proxyUser=${encodeURIComponent(proxyUser)}`;
  return await getAxiosInstance().get<SalesOrderMasterData>(`${URL}${query}`);
};

export const useSalesOrderMasterDataQuery = () => {
  const originator: string = getUserFromLocalStorage()?.originator || '';
  const proxyUserDetail = getProxyUserFromLocalStorage();
  const proxyUser = proxyUserDetail ? proxyUserDetail.userName : originator;

  const { data, error, isLoading, isPending, isFetching, refetch } = useQuery({
    queryKey: ['sales-order-master-data-query', originator, proxyUser],
    queryFn: () => fetchSalesOrderMasterData(originator, proxyUser),
    select: (data) => data.data,
  });

  return {
    salesOrderMasterData: data,
    error,
    isLoading,
    isPending,
    isFetching,
    refetch,
  };
}; 