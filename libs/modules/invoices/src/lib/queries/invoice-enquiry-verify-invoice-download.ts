import { InvoiceFilters } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { useQuery } from '@tanstack/react-query';

const URL = `invoices/signed-doc`;

const fetchInvoiceEnquiryVerifyDownload = async (originator: string, proxyUser: string, filter: InvoiceFilters) => {
  const query = `?originator=${encodeURIComponent(originator)}&proxyUser=${encodeURIComponent(proxyUser)}`;
  const config = {
    params: {
      ...filter
    }
  };
  return await getAxiosInstance().get(`${URL}${query}`, config);
};

export const InvoiceEnquiryVerifyDownloadKey = 'invoice-enquiry-verify-download-query';

export const useInvoiceEnquiryVerifyDownload = (filter: InvoiceFilters) => {
  const originator: string = getUserFromLocalStorage()?.originator ?? '';
  const proxyUserDetail = getProxyUserFromLocalStorage();
  const proxyUser = proxyUserDetail ? proxyUserDetail.userName : originator;
  
  const { data, error, isLoading, isPending, isFetching, refetch } = useQuery({
    queryKey: [InvoiceEnquiryVerifyDownloadKey, originator, proxyUser, filter],
    queryFn: () => fetchInvoiceEnquiryVerifyDownload(originator, proxyUser, filter),
    select: (data) => data.data,
    enabled: false,
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