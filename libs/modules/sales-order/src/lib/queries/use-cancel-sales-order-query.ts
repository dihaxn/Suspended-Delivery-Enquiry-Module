import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAxiosInstance } from '@cookers/services';

interface CancelSalesOrderPayload {
  sOrderNo: number;
  requestCreatedDateTime: string;
}

export const useCancelSalesOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sOrderNo: number) => {
      const payload: CancelSalesOrderPayload = {
        sOrderNo,
        requestCreatedDateTime: new Date().toISOString()
      };
      
      const response = await getAxiosInstance().delete(`/orders`, { data: payload });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-SalesOrder'] });
    },
    onError: (error: any) => {
      console.error('Cancel Sales Order Error:', error);
      throw error;
    }
  });
};