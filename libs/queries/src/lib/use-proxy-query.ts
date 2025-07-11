import { ProxyUserData, LookupTable } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { getUserFromLocalStorage } from '@cookers/utils';
import { useQuery } from '@tanstack/react-query';
const URL = `users/proxy`;


const fetchProxyUserData = async () => {
  const response = await getAxiosInstance().get<ProxyUserData[]>(URL);
  //const modifiedData = modifyJsonFields(response.data);
  return response.data;
};
export const useProxyUserQuery = () => {
  const { data, error, isLoading, isPending, isFetching, refetch } = useQuery({
    queryKey: ['proxy-users-query'],
    queryFn: () => fetchProxyUserData(),
    staleTime: 0,
    initialData: [],
  });
  return {
    proxyUserData: data ?? [],
    error,
    isLoading,
    isPending,
    isFetching,
    refetch,
  };
};

/* const modifyProxyData = (data: ProxyUserData[]): LookupTable[] => {
    const selectData = data.map(user => ({
        label: `${user.empId} - ${user.name}`, 
        value: user.originator,                         
      }));
      console.log(selectData);
      return selectData;
  }; */
