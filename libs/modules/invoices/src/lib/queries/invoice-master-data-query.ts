import { getAxiosInstance } from '@cookers/services';
import { getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { useQuery } from '@tanstack/react-query';

const URL = `invoice-masters`;

interface CarrierItem {
  carrierCode: string;
  name: string;
  depotCode: string;
  truckType: string;
  driverId: number;
  driverName: string | null;
  regoNo: string;
}

interface CarrierOption {
  value: string;
  label: string;
}

const fetchCustomerFeedbackMasterData = async (originator: string, proxyUser: string) => {
  const query = `?originator=${encodeURIComponent(originator)}&proxyUser=${encodeURIComponent(proxyUser)}`;

  return await getAxiosInstance().get<any>(`${URL}${query}`);
};

export const useInvoiceMasterData = () => {
  const originator: string = getUserFromLocalStorage()?.originator ?? '';
  const proxyUserDetail = getProxyUserFromLocalStorage();
  const proxyUser = proxyUserDetail ? proxyUserDetail.userName : originator;
  const { data, error, isLoading, isPending, isFetching, refetch } = useQuery({
    queryKey: ['invoice-master-data-query', originator, proxyUser],
    queryFn: () => fetchCustomerFeedbackMasterData(originator, proxyUser),
    select: (data) => {
      const masterData = data.data;
      
      // Transform carrierList to dropdown options format
      const transformedCarrierList: CarrierOption[] = masterData?.carrierList?.map((carrier: CarrierItem) => ({
        value: carrier.carrierCode,
        label: `${carrier.carrierCode.trim()}`
      })) ?? [];
      
      return {
        ...masterData,
        carrierList: transformedCarrierList
      };
    },
  });
  
  return {
    invoiceMasterData: data,
    error,
    isLoading,
    isPending,
    isFetching,
    refetch,
  };
};
