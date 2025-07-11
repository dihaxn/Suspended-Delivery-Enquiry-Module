import { SalesOrderMasterData } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { useQuery } from '@tanstack/react-query';

const URL = `orders-master`;

const fetchSalesOrderMasterData = async (proxyUser: string) => {
  let url = URL;

  if (proxyUser) {
    url += `?proxyUser=${encodeURIComponent(proxyUser)}`;
  }
  return await getAxiosInstance().get<SalesOrderMasterData>(url);
};

export const useSalesOrderMasterDataQuery = () => {
  const originator: string = getUserFromLocalStorage()?.originator || '';
  const proxyUserDetail = getProxyUserFromLocalStorage();
  const proxyUser = proxyUserDetail?.userName === originator ? '' : proxyUserDetail?.userName || '';
  const { data, error, isLoading, isPending, isFetching, refetch } = useQuery({
    queryKey: ['sales-order-master-data-query', originator, proxyUser],
    queryFn: () => fetchSalesOrderMasterData(proxyUser),
    select: (data) => data.data,
  });

  return {
    salesOrderMasterData: data as SalesOrderMasterData,
    error,
    isLoading,
    isPending,
    isFetching,
    refetch,
  };
};