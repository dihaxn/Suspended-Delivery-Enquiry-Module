import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAxiosInstance } from '@cookers/services';

interface CancelPickListPayload {
  sOrderNo: number;
  requestCreatedDateTime: string;
}

export const useCancelPickListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sOrderNo: number) => {
      const payload: CancelPickListPayload = {
        sOrderNo,
        requestCreatedDateTime: new Date().toISOString()
      };
      
      const response = await getAxiosInstance().delete('/orders', { data: payload });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-SalesOrder'] });
    },
    onError: (error: any) => {
      console.error('Cancel Pick List Error:', error);
      throw error;
    }
  });
};