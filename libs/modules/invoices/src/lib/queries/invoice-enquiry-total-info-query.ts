import { InvoiceFilters } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { useQuery } from '@tanstack/react-query';

const URL = `invoices/total-summary`;

const fetchInvoiceEnquiryTotalInfo = async (originator: string, proxyUser: string, filter: InvoiceFilters) => {
  const query = `?originator=${encodeURIComponent(originator)}&proxyUser=${encodeURIComponent(proxyUser)}`;
  const config = {
    params:{
      ...filter
    }
  }
  return await getAxiosInstance().get<any>(`${URL}${query}`, config);
};

export const InvoiceEnquiryTotalInfoKey = 'invoice-enquiry-total-info-query'

export const useInvoiceEnquiryTotalInfo= (filter: InvoiceFilters) => {
  const originator: string = getUserFromLocalStorage()?.originator || '';
  const proxyUserDetail = getProxyUserFromLocalStorage();
  const proxyUser = proxyUserDetail ? proxyUserDetail.userName : originator;
  const { data, error, isLoading, isPending, isFetching, refetch } = useQuery({
    queryKey: [InvoiceEnquiryTotalInfoKey, originator, proxyUser, filter],
    queryFn: () => fetchInvoiceEnquiryTotalInfo(originator, proxyUser, filter),
    select: (data) => data.data,
  });
  return {
    data,
    error,
    isLoading,
    isPending,
    isFetching,
    refetch,
  };
};
