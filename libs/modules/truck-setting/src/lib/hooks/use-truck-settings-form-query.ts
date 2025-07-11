import { TruckSettingsMasterData } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { STORE, useStoreSelector } from '@cookers/store';
import { useQuery } from '@tanstack/react-query';
import { TruckSettingFormSchemaApiType, TruckSettingFormSchemaType } from '../schema';

const fetchTruckSettingFormData = async (truckSettingId: number) => {
    const response = await getAxiosInstance().get<TruckSettingFormSchemaApiType>(`truck-settings/${truckSettingId}`);
    return response.data;
}

const modifyJsonFields = (data: TruckSettingFormSchemaApiType, masterData: TruckSettingsMasterData): TruckSettingFormSchemaType => {
    const carrierCodeObj = masterData.carrierList.find((carrier) => carrier.carrierCode.trim() === data.carrierCode);
    // const totaliserTypeObj = masterData.totaliserTypeList.find((totaliser) => totaliser.label.trim() == data.totaliserType);
    const newData = {
        ...data,
        carrierCode: {label: carrierCodeObj?.carrierCode??'', value: carrierCodeObj?.carrierCode??''}
    };
    return newData;
}

export const useTruckSettingFormQuery = (truckSettingId: number) => {
    const { masterData } = useStoreSelector(STORE.TruckSettings);

    const { data, error, isLoading, isFetching, refetch } = useQuery<TruckSettingFormSchemaApiType, Error, TruckSettingFormSchemaType>({
        queryKey: ['truck-setting-entry-query', truckSettingId],
        queryFn: () => fetchTruckSettingFormData(truckSettingId),
        enabled: !!truckSettingId,
        staleTime: 0,
        retryDelay: 1000,
        select: (data) => modifyJsonFields(data, masterData),
    });

    return {
        truckSettingData: data,
        error,
        isLoading,
        isFetching,
        refetch,
    };
}