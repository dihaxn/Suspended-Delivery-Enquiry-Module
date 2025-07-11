import { getAxiosInstance } from '@cookers/services';

export interface AssetInvoicePrintRequest {
  invoiceNo: number;
  isDA: boolean;
}
export const printAssetInvoice = async (data: AssetInvoicePrintRequest[]) => {
  try {
    const response = await getAxiosInstance().post(`invoices/print-asset`, data);
    return response.data;
  } catch (error) {
    console.error('Error printing asset invoice:', error);
    throw error;
  }
};
