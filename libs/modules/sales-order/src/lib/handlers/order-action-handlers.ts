import { SalesOrderEntryInterface } from '@cookers/models';
import { configStore } from '@cookers/store';

export interface OrderActionHandlerParams {
  formData: SalesOrderEntryInterface;
  id: string;
  methods: any;
  showToast: any;
  setOpen: any;
  setIsSpinnerLoading: any;
  navigate: any;
  cancelPickListMutation: any;
  cancelSalesOrderMutation: any;
  printPickListMutation: any;
}

export const handleOrderActions = async (params: OrderActionHandlerParams): Promise<boolean> => {
  const {
    formData,
    id,
    methods,
    showToast,
    setOpen,
    setIsSpinnerLoading,
    navigate,
    cancelPickListMutation,
    cancelSalesOrderMutation,
    printPickListMutation
  } = params;

  // Handle cancellation actions first
  if (formData.actionType === 'C' || formData.actionType === 'CS') {
    try {
      if (formData.actionType === 'C') {
        const data = await cancelPickListMutation.mutateAsync(parseInt(id as string));
        showToast({
          title: 'Success',
          message: 'Pick List Cancelled Successfully!',
          type: 'success',
        });
      } else {
        await cancelSalesOrderMutation.mutateAsync(parseInt(id as string));
        showToast({
          title: 'Success',
          message: 'Standing Order Cancelled Successfully!',
          type: 'success',
        });
      }
      methods.setValue('orderDetails.status', 'Cancelled');

      setTimeout(() => {
        //window.location.reload();
        navigate(`/${configStore.appName}/sales-order/${id}`);
      }, 1000);
    } catch (error: any) {
      setOpen(true);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || (formData.actionType === 'C' ? 'Pick List Cancellation Failed!' : 'Sales Order Cancellation Failed!'),
        title: formData.actionType === 'C' ? 'Pick List Cancellation Failed!' : 'Sales Order Cancellation Failed!',
      });
    }
    setIsSpinnerLoading(false);
    return true; // Action was handled
  }

  // Handle print pick list action
  if (formData.actionType === 'P') {
    try {
      const result = await printPickListMutation.mutateAsync(parseInt(id as string));
      if (result.status) {
        setOpen(true);
        // Update the form status to reflect the printed state
        methods.setValue('orderDetails.status', 'Printed');
        showToast({
          type: 'success',
          message: 'Pick List Printed Successfully',
          title: 'Pick List Printed',
        });
        setTimeout(() => {
          navigate(`/${configStore.appName}/sales-order/${id}`);
        }, 1000);
      } else {
        // Handle API failure with status: false
        setOpen(true);
        showToast({
          type: 'error',
          title: 'Print Pick List Failed!',
          message: result.message || 'Failed to print pick list',
        });
      }
    } catch (error: any) {
      setOpen(true);
      showToast({
        type: 'error',
        title: 'Print Pick List Failed!',
        message: error.response?.data?.message || error.message || 'An error occurred while printing pick list',
      });
    }
    setIsSpinnerLoading(false);
    return true; // Action was handled
  }

  return false; // No action was handled
}; 