import { TruckSettingsMasterData } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { useQuery } from '@tanstack/react-query';
import { getUserFromLocalStorage, getProxyUserFromLocalStorage } from '@cookers/utils';

const URL = `truck-settings/master`;

const fetchTruckMasterData = async (originator: string, proxyUser: string) => {
    const query = `?originator=${encodeURIComponent(originator)}`;

    console.log(query);
    return await getAxiosInstance().get<TruckSettingsMasterData>(`${URL}${query}`);
};

export const useTruckMasterDataQuery = () => {
    const originator: string = getUserFromLocalStorage()?.originator || '';
    const proxyUserDetail = getProxyUserFromLocalStorage();
    const proxyUser = proxyUserDetail ? proxyUserDetail.userName : originator;
    const { data, error, isLoading, isPending, isFetching, refetch } = useQuery({
        queryKey: ['truck-master-data-query', originator, proxyUser],
        queryFn: () => fetchTruckMasterData(originator, proxyUser),
        select: (data) => data.data,
    });

    return {
        truckMasterData: data as TruckSettingsMasterData,
        error,
        isLoading,
        isPending,
        isFetching,
        refetch,
    };
};