import { CarrierMasterData } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { STORE, useStoreSelector } from '@cookers/store';
import { useQuery } from '@tanstack/react-query';
import { CarrierFormSchemaApiType, CarrierFormSchemaType } from '../schema';

const fetchCarrierFormData = async (carrierCode: string) => {
  const response = await getAxiosInstance().get<CarrierFormSchemaApiType>(`carrier/${carrierCode}`);
  return response.data;
};

const modifyJsonFields = (data: CarrierFormSchemaApiType, masterData: CarrierMasterData): CarrierFormSchemaType => {
  const driverObj = masterData.allDriverList.find((driv) => driv.driverId === data.driverId);
  const autoSequenceFlagValue=(data.autoSequenceFlag==0)?false:true;

  const newData = {
    ...data,
    driver: { label: driverObj?.driverName ?? '', value: driverObj?.driverId ?? 0 },
   autoSequenceFlagForm:autoSequenceFlagValue,
   employeeNo:driverObj?.empId ?? undefined
  };

  console.log('newData', newData);

  return newData;
};
export const useCarrierFormQuery = (carrierCode: string) => {
  const { masterData } = useStoreSelector(STORE.CarrierMaster);

  const { data, error, isLoading, isFetching, refetch } = useQuery<CarrierFormSchemaApiType, Error, CarrierFormSchemaType>({
    queryKey: ['carrier-entry-query', carrierCode],
    queryFn: () => fetchCarrierFormData(carrierCode),
    enabled: !!carrierCode,
    staleTime: 0,
    retryDelay: 1000,
    select: (data) => modifyJsonFields(data, masterData),
  });

  return {
    carrierData: data,
    error,
    isLoading,
    isFetching,
    refetch,
  };
};
