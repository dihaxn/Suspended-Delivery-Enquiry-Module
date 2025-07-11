import { CustomerFeedbackMasterData } from '@cookers/models';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { getAxiosInstance } from '@cookers/services';
import { useQuery } from '@tanstack/react-query';
import { getUserFromLocalStorage, getProxyUserFromLocalStorage } from '@cookers/utils';

const URL = `complaint-master`;

const fetchCustomerFeedbackMasterData = async (originator: string, proxyUser: string) => {
  const query = `?originator=${encodeURIComponent(originator)}&proxyUser=${encodeURIComponent(proxyUser)}`;

  return await getAxiosInstance().get<CustomerFeedbackMasterData>(`${URL}${query}`);
};

export const useCustomerFeedbackMasterDataQuery = () => {
  const originator: string = getUserFromLocalStorage()?.originator || '';
  const proxyUserDetail = getProxyUserFromLocalStorage();
  const proxyUser = proxyUserDetail ? proxyUserDetail.userName : originator;
  const { data, error, isLoading, isPending, isFetching, refetch } = useQuery({
    queryKey: ['complaint-master-data-query', originator, proxyUser],
    queryFn: () => fetchCustomerFeedbackMasterData(originator, proxyUser),
    select: (data) => data.data,
  });

  return {
    customerFeedbackMasterData: data as CustomerFeedbackMasterData,
    error,
    isLoading,
    isPending,
    isFetching,
    refetch,
  };
};
