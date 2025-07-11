import { IncidentMasterData, User } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { useQuery } from '@tanstack/react-query';
import { getUserFromLocalStorage,getProxyUserFromLocalStorage } from '@cookers/utils';

const BASE_URL = `incident-master`;

const fetchIncidentMasterData = async (proxyUser: string) => {
  let url = BASE_URL;

  if (proxyUser) {
    url += `?proxyUser=${encodeURIComponent(proxyUser)}`;
  }

  console.log("Fetching incident master data from:", url);
  return await getAxiosInstance().get<IncidentMasterData>(url);
};



export const useIncidentMasterDataQuery = () => {
  const originator: string = getUserFromLocalStorage()?.originator || '';
  const proxyUserDetail =  getProxyUserFromLocalStorage();
  const proxyUser = proxyUserDetail?.userName === originator ? '' : proxyUserDetail?.userName || '';
  const { data, error, isLoading, isPending, isFetching, refetch } = useQuery({
    queryKey: ['incident-master-data-query',originator,proxyUser],
    queryFn: () => fetchIncidentMasterData(proxyUser),  
    select: (data) => data.data,
  });

  return {
    incidentMasterData: data as IncidentMasterData,
    error,
    isLoading,
    isPending,
    isFetching,
    refetch,
  };
};

