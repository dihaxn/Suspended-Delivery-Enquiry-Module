import { getAxiosInstance } from '@cookers/services';
import { getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { useQuery } from '@tanstack/react-query';

const URL = `/complaint/master`;

const fetchCustomerFeedbackMasterData = async (originator: string, proxyUser: string) => {
  const query = `?originator=${encodeURIComponent(originator)}&proxyUser=${encodeURIComponent(proxyUser)}`;

  return await getAxiosInstance().get<any>(`${URL}${query}`);
};

export const useCustomerFeedbackMasterDataQuery = () => {
  const originator: string = getUserFromLocalStorage()?.originator || '';
  const proxyUserDetail = getProxyUserFromLocalStorage();
  const proxyUser = proxyUserDetail ? proxyUserDetail.userName : originator;
  const { data, error, isLoading, isPending, isFetching, refetch } = useQuery({
    queryKey: ['customer-feedback-master-data-query', originator, proxyUser],
    queryFn: () => fetchCustomerFeedbackMasterData(originator, proxyUser),
    select: (data) => data.data,
  });

  return {
    supplierNcrMasterData: data,
    error,
    isLoading,
    isPending,
    isFetching,
    refetch,
  };
};
