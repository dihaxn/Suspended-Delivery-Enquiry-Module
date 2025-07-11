import { CarrierMasterData } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { useQuery } from '@tanstack/react-query';

const URL = `carrier-master`;

const fetchCarrierMasterData = async (originator: string, proxyUser: string) => {
  const query = `?originator=${encodeURIComponent(originator)}&proxyUser=${encodeURIComponent(proxyUser)}`;

  console.log(query);
  return await getAxiosInstance().get<CarrierMasterData>(`${URL}${query}`);
};

export const useCarrierMasterDataQuery = () => {
  const originator: string = getUserFromLocalStorage()?.originator || '';
  const proxyUserDetail = getProxyUserFromLocalStorage();
  const proxyUser = proxyUserDetail ? proxyUserDetail.userName : originator;
  const { data, error, isLoading, isPending, isFetching, refetch } = useQuery({
    queryKey: ['carrier-master-data-query', originator, proxyUser],
    queryFn: () => fetchCarrierMasterData(originator, proxyUser),
    select: (data) => data.data,
  });

  return {
    carrierMasterData: data as CarrierMasterData,
    error,
    isLoading,
    isPending,
    isFetching,
    refetch,
  };
};
