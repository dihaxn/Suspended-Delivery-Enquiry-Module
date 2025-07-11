import { GlobalMasterData } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { getUserFromLocalStorage, getProxyUserFromLocalStorage } from '@cookers/utils';
import { useQuery } from '@tanstack/react-query';
const URL = `global`;

const fetchGlobalMasterData = async () => {
 
  return await getAxiosInstance().get<GlobalMasterData[]>(`${URL}`);
};

export const useGlobalMasterQuery = () => {
  const { data, error, isLoading, isPending, isFetching, refetch } = useQuery({
    queryKey: ['global-data'],
    queryFn: fetchGlobalMasterData,
    select: (data) => data.data,
  });

  return {
    globalLookupData: data as GlobalMasterData[],
    error,
    isLoading,
    isPending,
    isFetching,
    refetch,
  };
};

// create useNavQuery types
