import { Flex, ModuleBaseLayout, PopupMessageBox, SectionBaseLayout } from '@cookers/ui';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import InvoiceEntryHeader from './invoice-entry-header';
import InvoiceEntryFooter from './invoice-entry-footer';
import InvoiceEntryFormDetails from './invoice-entry-form-details';
import InvoiceEntryFormProducts from './invoice-entry-form-products';
import { useNavigate, useParams } from 'react-router-dom';
import { configStore, STORE, useStoreSelector } from '@cookers/store';
import { DevTool } from '@hookform/devtools';
import { ToastWrapper, useToast } from '@cookers/modules/shared';
import { InvoiceEntryInterface, DefaultInvoiceEntry } from '@cookers/models';
import { useSpinner } from '@cookers/providers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAxiosInstance } from '@cookers/services';
import { formattoJsonDate, getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { useNavigationBlock } from '@cookers/modules/common';

export const InvoiceEntryForm: React.FC = () => {
  const { code } = useParams<{ code?: string }>();
  const { selectedInvoice } = useStoreSelector(STORE.Invoice);
  const { setBlocked } = useNavigationBlock();
  const currentUser = getProxyUserFromLocalStorage() ?? getUserFromLocalStorage();

  const methods = useForm<InvoiceEntryInterface>({
    defaultValues: code && code !== 'new' && selectedInvoice
      ? (selectedInvoice as unknown as InvoiceEntryInterface)
      : DefaultInvoiceEntry,
  });

  const navigate = useNavigate();

  const [isOpenCompletionPopup, setIsOpenCompletionPopup] = useState(false);
  const { setIsSpinnerLoading } = useSpinner();
  const { open, setOpen, toastState, showToast } = useToast();
  const queryClient = useQueryClient();

  // Form state management
  const {
    handleSubmit,
    formState: { isDirty },
  } = methods;

  // Watch for form changes to enable/disable navigation blocking
  useEffect(() => {
    setBlocked(isDirty);
    return () => setBlocked(false);
  }, [isDirty, setBlocked]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: InvoiceEntryInterface) => {
      const payload = {
        ...data,
        actionType: 'SAVE',
        originator: currentUser?.originator ?? '',
        requestCreatedDateTime: formattoJsonDate(new Date()),
      };
      return getAxiosInstance().post('/invoices/save', payload);
    },
    onSuccess: () => {
      showToast({
        type: 'success',
        title: 'Success',
        message: 'Invoice saved successfully',
        hideButton: true,
      });
      queryClient.invalidateQueries({ queryKey: ['invoice-list'] });
      navigate(`/${configStore.appName}/invoices`);
    },
    onError: (error) => {
      console.error('Save error:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to save invoice. Please try again.',
        hideButton: true,
      });
    },
  });

  // Print mutation
  const printMutation = useMutation({
    mutationFn: async (data: InvoiceEntryInterface) => {
      const payload = {
        ...data,
        actionType: 'PRINT',
        originator: currentUser?.originator ?? '',
        requestCreatedDateTime: formattoJsonDate(new Date()),
      };
      return getAxiosInstance().post('/invoices/print', payload);
    },
    onSuccess: () => {
      showToast({
        type: 'success',
        title: 'Success',
        message: 'Invoice printed successfully',
        hideButton: true,
      });
      queryClient.invalidateQueries({ queryKey: ['invoice-list'] });
    },
    onError: (error) => {
      console.error('Print error:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to print invoice. Please try again.',
        hideButton: true,
      });
    },
  });

  const onSave = (data: InvoiceEntryInterface) => {
    setIsSpinnerLoading(true);
    saveMutation.mutate(data);
  };

  const onPrint = (data: InvoiceEntryInterface) => {
    setIsSpinnerLoading(true);
    printMutation.mutate(data);
  };

  const onCancel = () => {
    if (isDirty) {
      setIsOpenCompletionPopup(true);
    } else {
      navigate(`/${configStore.appName}/invoices`);
    }
  };

  const handleDiscardChanges = () => {
    setIsOpenCompletionPopup(false);
    navigate(`/${configStore.appName}/invoices`);
  };

  useEffect(() => {
    if (saveMutation.isSuccess || printMutation.isSuccess) {
      setIsSpinnerLoading(false);
    }
  }, [saveMutation.isSuccess, printMutation.isSuccess, setIsSpinnerLoading]);

  const detailsSection = (
    <Flex direction="column" gap="4" p="4" >
      <InvoiceEntryFormDetails />
      <InvoiceEntryFormProducts />
    </Flex>
  );

  const main = (
    <SectionBaseLayout
      header={<InvoiceEntryHeader />}
      main={detailsSection}
      footer={
        <InvoiceEntryFooter
          onSave={handleSubmit(onSave)}
          onPrint={handleSubmit(onPrint)}
          onCancel={onCancel}
          isSaving={saveMutation.isPending}
          isPrinting={printMutation.isPending}
        />
      }
    />
  );

  return (
    <FormProvider {...methods}>
      <ModuleBaseLayout main={main} />
      
      <PopupMessageBox
        isOpen={isOpenCompletionPopup}
        onOpenChange={setIsOpenCompletionPopup}
        dialogTitle="Unsaved Changes"
        dialogDescription="You have unsaved changes. Do you want to discard them?"
        confirmButtonLabel="Discard Changes"
        cancelButtonLabel="Keep Editing"
        showCancelButton={true}
        onConfirm={handleDiscardChanges}
      />
      
      <ToastWrapper
        open={open}
        setOpen={setOpen}
        toastState={toastState}
        actionLabel="Go to List"
        actionUrl={`/${configStore.appName}/invoices`}
      />
      
      {process.env['NODE_ENV'] === 'development' && <DevTool control={methods.control} />}
    </FormProvider>
  );
};

export default InvoiceEntryForm;