import { MainNavigation } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { getUserFromLocalStorage, getProxyUserFromLocalStorage } from '@cookers/utils';
import { useQuery } from '@tanstack/react-query';
const URL = `user-modules`;

const fetchNavigationData = async () => {
  /* const originator = getUserFromLocalStorage()?.originator || '';
  const proxyUserDetail =  getProxyUserFromLocalStorage();
  const proxyUser  = proxyUserDetail ? proxyUserDetail.userName : ''; */
  //const query = `?proxyUser=${encodeURIComponent(proxyUser)}`;


  return await getAxiosInstance().get<MainNavigation[]>(`${URL}`);
};

export const useMainNavigationQuery = () => {
  const { data, error, isLoading, isPending, isFetching, refetch } = useQuery({
    queryKey: ['navigation-query'],
    queryFn: fetchNavigationData,
    select: (data) => data.data,
  });

  return {
    navigationData: data as MainNavigation[],
    error,
    isLoading,
    isPending,
    isFetching,
    refetch,
  };
};

// create useNavQuery types
