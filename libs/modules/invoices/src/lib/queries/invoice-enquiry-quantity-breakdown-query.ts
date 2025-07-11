import { InvoiceFilters } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { useQuery } from '@tanstack/react-query';

const URL = `invoices/product-summary`;

const fetchInvoiceEnquiryQuantityBreakdown = async (
  originator: string, 
  proxyUser: string, 
  carrierCode: string,
  fromDate: string | Date,
  toDate: string | Date,
  filter: InvoiceFilters
) => {
  const query = `?originator=${encodeURIComponent(originator)}&proxyUser=${encodeURIComponent(proxyUser)}`;
  const config = {
    params:{
      carrierCode,
      fromDate,
      toDate,
      ...filter
    }
  }
  return await getAxiosInstance().get(`${URL}${query}`, config);
};

export const InvoiceEnquiryQuantityBreakdownKey = 'invoice-enquiry-quantity-breakdown-query'

export const useInvoiceEnquiryQuantityBreakdown = (
  carrierCode: string,
  fromDate: string | Date,
  toDate: string | Date,
  filter: InvoiceFilters,
  enabled = true,
) => {
  const originator: string = getUserFromLocalStorage()?.originator ?? '';
  const proxyUserDetail = getProxyUserFromLocalStorage();
  const proxyUser = proxyUserDetail ? proxyUserDetail.userName : originator;
  const { data, error, isLoading, isPending, isFetching, refetch } = useQuery({
    queryKey: [InvoiceEnquiryQuantityBreakdownKey, originator, proxyUser, carrierCode, fromDate, toDate, filter],
    queryFn: () => fetchInvoiceEnquiryQuantityBreakdown(originator, proxyUser, carrierCode, fromDate, toDate, filter),
    select: (data) => data.data,
    enabled: enabled,
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