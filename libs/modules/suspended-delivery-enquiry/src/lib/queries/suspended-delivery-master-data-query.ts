import { SuspendedDeliveryMasterData as MasterData } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { useQuery } from '@tanstack/react-query';

const URL = `suspended-delivery`;

const fetchSuspendedDeliveryMasterData = async (originator: string, proxyUser: string) => {
  const query = `?originator=${encodeURIComponent(originator)}&proxyUser=${encodeURIComponent(proxyUser)}`;

  console.log(query);
  return await getAxiosInstance().get<MasterData>(`${URL}${query}`);
};

export const useSuspendedDeliveryMasterDataQuery = () => {
  const originator: string = getUserFromLocalStorage()?.originator || '';
  const proxyUserDetail = getProxyUserFromLocalStorage();
  const proxyUser = proxyUserDetail ? proxyUserDetail.userName : originator;
  const { data, error, isLoading, isPending, isFetching, refetch } = useQuery({
    queryKey: ['suspended-delivery-master-data-query', originator, proxyUser],
    queryFn: () => fetchSuspendedDeliveryMasterData(originator, proxyUser),
    select: (data) => data.data,
  });

  return {
    SuspendedDeliveryMasterData: data as MasterData,
    error,
    isLoading,
    isPending,
    isFetching,
    useSuspendedDeliveryMasterDataQuery,
    refetch,
  };
};
