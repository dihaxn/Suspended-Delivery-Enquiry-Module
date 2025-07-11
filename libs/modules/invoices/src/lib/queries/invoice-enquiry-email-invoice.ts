import { getAxiosInstance } from '@cookers/services';
import { getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';

export interface InvoiceEmailRequest {
  toAddress: string[];
  subject: string;
  emailBody: string;
  emailType: string;
  payeeNo: string;
  originator: string;
  requestCreatedDateTime: string;
  invoiceNo: number;
  invoiceType: string;
  isDA: boolean;
}

export const sendInvoiceEmail = async (data: InvoiceEmailRequest) => {
  const originator: string = getUserFromLocalStorage()?.originator || '';
  const proxyUserDetail = getProxyUserFromLocalStorage();
  const proxyUser = proxyUserDetail ? proxyUserDetail.userName : originator;
  const requestData = {
    ...data,
    originator: proxyUser,
  };
  try {
    const response = await getAxiosInstance().post(`invoices/invoice-email`, requestData);
    return response.data;
  } catch (error) {
    console.error('Error sending invoice email:', error);
    throw error;
  }
};
