import { DocDetailModel, InvoiceFilters } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';

const URL = `invoices/export`;

export const downloadInvoicesCSV = async (data: InvoiceFilters) => {
  try {
    const response = await getAxiosInstance().get<DocDetailModel>(URL, { params: data });
    return response.data;
  } catch (error) {
    console.error('Error in Downloading Feedback CSV Data:', error);
  }
};
