import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAxiosInstance } from '@cookers/services';

interface PrintPickListPayload {
  sOrderNo: number;
  requestCreatedDateTime: string;
}

export const usePrintPickListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sOrderNo: number) => {
      const payload: PrintPickListPayload = {
        sOrderNo,
        requestCreatedDateTime: new Date().toISOString()
      };
      
      const response = await getAxiosInstance().post('/orders/print-plist', payload);
      console.log('Print Pick List Response:', response.data);
      return response.data;
    },
    onError: (error: any) => {
      console.error('Print Pick List Error:', error);
      throw error;
    }
  });
}; 