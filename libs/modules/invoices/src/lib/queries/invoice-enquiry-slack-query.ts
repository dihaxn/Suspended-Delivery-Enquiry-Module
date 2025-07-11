import { InvoiceFilters } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { useQuery } from '@tanstack/react-query';

const URL = `invoices/slack-summary`;

const fetchInvoiceEnquirySlackSummary = async (originator: string, proxyUser: string, carrierCode: string, delDate: string | Date, filter: InvoiceFilters) => {
  const query = `?originator=${encodeURIComponent(originator)}&proxyUser=${encodeURIComponent(proxyUser)}`;
  const config = {
    params: {
      carrierCode,
      delDate,
      ...filter,
    },
  };
  return await getAxiosInstance().get(`${URL}${query}`, config);
};

export const InvoiceEnquirySlackSummaryKey = 'invoice-enquiry-slack-summary-query';

export const useInvoiceEnquirySlackSummary = (carrierCode: string, delDate: string | Date, filter: InvoiceFilters, enabled = true) => {
  const originator: string = getUserFromLocalStorage()?.originator ?? '';
  const proxyUserDetail = getProxyUserFromLocalStorage();
  const proxyUser = proxyUserDetail ? proxyUserDetail.userName : originator;

  const { data, error, isLoading, isPending, isFetching, refetch } = useQuery({
    queryKey: [InvoiceEnquirySlackSummaryKey, originator, proxyUser, carrierCode, delDate],
    queryFn: () => fetchInvoiceEnquirySlackSummary(originator, proxyUser, carrierCode, delDate, filter),
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
