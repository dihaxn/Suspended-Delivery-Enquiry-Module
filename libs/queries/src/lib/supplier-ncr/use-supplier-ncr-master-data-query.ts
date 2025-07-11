import { SupplierNcrMasterData } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { useQuery } from '@tanstack/react-query';

const URL = `supplier-ncr-master`;

const fetchSupplierNcrMasterData = async ( proxyUser: string) => {
  let url = URL;

  if (proxyUser) {
    url += `?proxyUser=${encodeURIComponent(proxyUser)}`;
  }
  return await getAxiosInstance().get<SupplierNcrMasterData>(url);
};

export const useSupplierNcrMasterDataQuery = () => {
  const originator: string = getUserFromLocalStorage()?.originator || '';
  const proxyUserDetail =  getProxyUserFromLocalStorage();
  const proxyUser = proxyUserDetail?.userName === originator ? '' : proxyUserDetail?.userName || '';
  const { data, error, isLoading, isPending, isFetching, refetch } = useQuery({
    queryKey: ['supplier-ncr-master-data-query', originator, proxyUser],
    queryFn: () => fetchSupplierNcrMasterData( proxyUser),
    select: (data) => data.data,
  });

  return {
    supplierNcrMasterData: data as SupplierNcrMasterData,
    error,
    isLoading,
    isPending,
    isFetching,
    refetch,
  };
};
