import { SupplierNcrMasterData } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { useQuery } from '@tanstack/react-query';

const URL = `supplier-ncr-master`;

const fetchSupplierNcrMasterData = async (originator: string, proxyUser: string) => {
  const query = `?originator=${encodeURIComponent(originator)}&proxyUser=${encodeURIComponent(proxyUser)}`;

  console.log(query);
  return await getAxiosInstance().get<SupplierNcrMasterData>(`${URL}${query}`);
};

export const useSupplierNcrMasterDataQuery = () => {
  const originator: string = getUserFromLocalStorage()?.originator || '';
  const proxyUserDetail = getProxyUserFromLocalStorage();
  const proxyUser = proxyUserDetail ? proxyUserDetail.userName : originator;
  const { data, error, isLoading, isPending, isFetching, refetch } = useQuery({
    queryKey: ['supplier-ncr-master-data-query', originator, proxyUser],
    queryFn: () => fetchSupplierNcrMasterData(originator, proxyUser),
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
