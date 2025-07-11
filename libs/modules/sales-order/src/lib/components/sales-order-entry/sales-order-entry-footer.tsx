import { STORE, useStoreSelector, configStore } from '@cookers/store';
import { Flex, FormButton } from '@cookers/ui';
import { useFormContext } from 'react-hook-form';
import { AlertDialog, Button } from '@radix-ui/themes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@cookers/modules/shared';

export const SalesOrderEntryFooter: React.FC = () => {
  const { setValue, watch } = useFormContext();
  const { permission } = useStoreSelector(STORE.SalesOrder);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isStandingOrderDialogOpen, setIsStandingOrderDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { open, setOpen, toastState, showToast } = useToast();

  const orderType = watch('orderDetails.orderType');
  const orderNo = watch('orderDetails.orderNo');
  const orderStatus = watch('orderDetails.status');
  const isOneOff = orderType === 'ONOF';
  const isPrinted = orderStatus === 'Printed';
  const isCancelled = orderStatus === 'Cancelled' || orderStatus === 'Cancel' || orderStatus?.toLowerCase() === 'cancelled';
  const isOnTruck = orderStatus === 'On Truck' || orderStatus === 'T';
  const isInvoiced = orderStatus === 'Invoiced' || orderStatus === 'I';
  const isNewOrder = !orderNo;
  
  // Can cancel only if has permission AND order is not on truck or invoiced
  const canCancelPList = permission.canCancelPList && !isOnTruck && !isInvoiced;
  
 
  console.log('order status:', orderStatus);

  const onSubmit = (actionType: string) => {
    setValue('actionType', actionType);
  };

  const handlePrintPListClick = () => {
    setIsPrintDialogOpen(true);
  };

  const handleCancelPList = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleCancelStandingOrder = () => {
    setIsStandingOrderDialogOpen(true);
  };

   // If order is cancelled, on truck, or invoiced, show empty footer
  // Note: Printed orders should still show cancel buttons
  if (isCancelled || isOnTruck || isInvoiced) {
    return (
      <Flex gap="6" wrap="wrap" align="center" style={{ backgroundColor: '#fff', padding: '1rem', height: '90px' }} />
    );
  }

  
  return (
    <>
      <Flex gap="6" wrap="wrap" align="center" style={{ backgroundColor: '#fff', padding: '1rem', height: '90px' }}>
        {permission.canSaveEntry && !isPrinted && <FormButton label="Save Order" name="Submit" size="2" type="submit" onClick={() => onSubmit('R')} />}
        {canCancelPList && isOneOff && !isNewOrder && (
          <>
            <FormButton label="Cancel PList" name="Submit" size="2" type="button" onClick={handleCancelPList} />
            {!isPrinted && (
              <FormButton 
                label="Print PList" 
                name="Submit" 
                size="2" 
                type="button" 
                onClick={handlePrintPListClick}
              />
            )}
          </>
        )}
        {canCancelPList && !isOneOff && !isNewOrder && (
          <FormButton 
            label="Cancel Standing Order" 
            name="Submit" 
            size="2" 
            type="button" 
            onClick={handleCancelStandingOrder} 
          />
        )}
        {permission.canCloseEntry && !isPrinted && <FormButton label="Close Sales Order" name="Complete" size="2" type="submit" onClick={() => onSubmit('C')} />}
      </Flex>

      {/* Cancel PList Confirmation Dialog */}
      <AlertDialog.Root open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Cancel Pick List</AlertDialog.Title>
          <AlertDialog.Description>Are you sure you want to cancel this pick list?</AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" color="gray" onClick={() => setIsConfirmDialogOpen(false)}>
              No
            </Button>
            <Button
              type="submit"
              form="salesOrderForm"
              variant="solid"
              color="blue"
              onClick={() => {
                setValue('actionType', 'C');
                setIsConfirmDialogOpen(false);
              }}
            >
              Yes
            </Button>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {/* Cancel Standing Order Confirmation Dialog */}
      <AlertDialog.Root open={isStandingOrderDialogOpen} onOpenChange={setIsStandingOrderDialogOpen}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Cancel Standing Order</AlertDialog.Title>
          <AlertDialog.Description>Are you sure you want to cancel this standing order?</AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" color="gray" onClick={() => setIsStandingOrderDialogOpen(false)}>
              No
            </Button>
            <Button
              type="submit"
              form="salesOrderForm"
              variant="solid"
              color="blue"
              onClick={() => {
                setValue('actionType', 'CS');
                setIsStandingOrderDialogOpen(false);
              }}
            >
              Yes
            </Button>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {/* Print PList Confirmation Dialog */}
      <AlertDialog.Root open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Print Pick List</AlertDialog.Title>
          <AlertDialog.Description>Are you sure you want to print this pick list?</AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" color="gray" onClick={() => setIsPrintDialogOpen(false)}>
              No
            </Button>
            <Button
              type="submit"
              form="salesOrderForm"
              variant="solid"
              color="blue"
              onClick={() => {
                setValue('actionType', 'P');
                setIsPrintDialogOpen(false);
              }}
            >
              Yes
            </Button>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

export default SalesOrderEntryFooter;
