import { Flex, ModuleBaseLayout, PopupMessageBox, SectionBaseLayout } from '@cookers/ui';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import CustomerFeedbackEntryHeader from './customer-feedback-entry-header';
import CustomerFeedbackEntryFooter from './customer-feedback-entry-footer';
import CustomerFeedbackCloseOutBlock from './customer-feedback-close-out-block';
import CustomerFeedbackActionsBlock from './customer-feedback-actions-block';
import CustomerFeedbackDetailsBlock from './customer-feedback-details-block';
import { useNavigate, useParams } from 'react-router-dom';
import { useCustomerFeedbackEntryFormQuery } from '../../queries/customer-feedback-entry-form-query';
import { useDispatch } from 'react-redux';
import { configStore, setCustomerFeedbackApiData, STORE, updateCustomerFeedbackPermission, useStoreSelector } from '@cookers/store';
import { DevTool } from '@hookform/devtools';
import { ToastWrapper, useToast } from '@cookers/modules/shared';
import { CustomerFeedbackEntryInterface, DefaultCustomerFeedbackEntry } from '@cookers/models';
import { useSpinner } from '@cookers/providers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAxiosInstance } from '@cookers/services';
import { getValueFromObj } from '../utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerFeedbackEntrySchema } from '../../schema/form-schema';
import { formattoJsonDate, getProxyUserFromLocalStorage, getUserFromLocalStorage, inMemoryfileStorage } from '@cookers/utils';
import { useNavigationBlock } from '@cookers/modules/common';
import { isAnyFieldFilledInObject } from '@cookers/helpers';

export const CustomerFeedbackEntryForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  //API data fetching
  const { customerFeedbackEntryData, isLoading, error } = useCustomerFeedbackEntryFormQuery(Number(id));
  const { customerFeedbackApiData, selectedCustomerFeedback, masterData, permission } = useStoreSelector(STORE.CustomerFeedback);
  const { setBlocked } = useNavigationBlock();
  const currentUser = getProxyUserFromLocalStorage() ?? getUserFromLocalStorage();
  const raisedBy = customerFeedbackApiData?.complaintRequest?.feedbackDetails?.raisedBy;
  const raisedByOriginator = typeof raisedBy === 'object' && raisedBy !== null && 'value' in raisedBy ? (raisedBy as any).value : raisedBy;

  const methods = useForm<CustomerFeedbackEntryInterface>({
    defaultValues: id ? customerFeedbackApiData : DefaultCustomerFeedbackEntry,
    resolver: zodResolver(customerFeedbackEntrySchema),
  });
  const dispatch = useDispatch();
  useEffect(() => {
    if (customerFeedbackEntryData && !isLoading) {
      dispatch(setCustomerFeedbackApiData(customerFeedbackEntryData));
    }
  }, [customerFeedbackEntryData, dispatch, isLoading, methods]);

  const [isOpenCompletionPopup, setIsOpenCompletionPopup] = useState(false);
  const { setIsSpinnerLoading } = useSpinner();
  const { open, setOpen, toastState, showToast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  

  const handleOpenConfirmationDialog = (formData: CustomerFeedbackEntryInterface) => {
    setIsOpenCompletionPopup(true);
  };

  useEffect(() => {
    if (Object.keys(methods.formState.dirtyFields).length > 0) {
      setBlocked(true); // Set the block if the form is dirty
    } else {
      setBlocked(false); // Clear the block if the form is not dirty
    }
  }, [methods.formState]);

  //Form Data population
  useEffect(() => {
    methods.reset(customerFeedbackApiData);

    if (!id) {
      methods.setValue('complaintRequest.feedbackDetails.raisedBy', { label: currentUser?.name, value: currentUser?.originator ?? currentUser?.userName });
    }

    const entryStatus = customerFeedbackApiData.complaintRequest.status.toLowerCase();
    if (entryStatus && id) {
      if(masterData.permissionLevel.readOnly && ((currentUser?.originator ?? currentUser?.userName) !== raisedByOriginator)){
        dispatch(updateCustomerFeedbackPermission(masterData.permission["c" as keyof typeof masterData.permission]));
      }else if (entryStatus in masterData.permission) {
        dispatch(updateCustomerFeedbackPermission(masterData.permission[entryStatus as keyof typeof masterData.permission]));
      }
    }
  }, [masterData, id, methods, dispatch, customerFeedbackApiData]);

  useEffect(() => {
    return () => {
      inMemoryfileStorage.clear();
    };
  }, []);

  // Unregister the fields when the form is not visible for zod validations
  useEffect(() => {
    if (!permission.canViewActionsBlock) {
      methods.unregister('complaintActions', { keepDirty: false, keepTouched: false });
    }
  }, [permission.canViewActionsBlock, methods.unregister, methods]);

  // Unregister the fields when the form is not visible for zod validations
  useEffect(() => {
    if (!permission.canViewCloseOutBlock) {
      methods.unregister('complaintCloseout', { keepDirty: false, keepTouched: false });
    }
  }, [permission.canViewCloseOutBlock, methods.unregister, methods]);

  //RHF
  const { mutateAsync } = useMutation({
    mutationFn: (modifiedApiData: CustomerFeedbackEntryInterface) => {
      const requestOptions = {
        method: 'post',
      };

      return getAxiosInstance().post(`complaints`, modifiedApiData, requestOptions);
    },
    onSuccess: (data) => {
      if (!data?.data.status) {
        showToast({ type: 'error', title: 'Customer Feedback Submission failed!', message: data?.data.message });
        setIsSpinnerLoading(false);
      } else {
        const newFeedbackId = data?.data.id;
        if (newFeedbackId) {
          setOpen(true);
          showToast({ type: 'success', message: 'Customer Feedback Submitted Successfully', title: 'Customer Feedback Submitted Successfully' });
          queryClient.invalidateQueries({ queryKey: ['data-CustomerFeedback'] });
          setIsSpinnerLoading(false);
          setTimeout(() => {
            inMemoryfileStorage.clear();
            id ?queryClient.invalidateQueries({ queryKey: ['customer-feedback-entry-query'] }) : navigate(`/${configStore.appName}/customer-feedback/${newFeedbackId}`);
          }, 1000);
        }
      }
    },
    onError: (error) => {
      setOpen(true);
      showToast({ type: 'error', message: error.message, title: 'Customer Feedback Submission failed !' });
      setIsSpinnerLoading(false);
    },
  });

  //Handle Submit
  const handleFormSubmit = async (formData: CustomerFeedbackEntryInterface) => {
    setIsSpinnerLoading(true);
    // Extract status logic to a separate variable for clarity
    let statusValue: string;
    if (formData?.actionType === 'C') {
      statusValue = 'C';
    } else if (isAnyFieldFilledInObject(formData.complaintActions, ['corrActionFixIssue'])) {
      statusValue = 'I';
    } else {
      statusValue = formData?.actionType ?? 'R';
    }

    const modifiedApiData: CustomerFeedbackEntryInterface = {
      ...customerFeedbackApiData,
      // requestCreatedDateTime: !id ? formattoJsonDate(new Date()) : customerFeedbackApiData.requestCreatedDateTime,
      requestCreatedDateTime: formattoJsonDate(new Date()),
      complaintRequest: {
        ...customerFeedbackApiData.complaintRequest,
        ...formData.complaintRequest,
        status: statusValue,
        feedbackDetails: {
          ...customerFeedbackApiData?.complaintRequest?.feedbackDetails,
          ...formData?.complaintRequest?.feedbackDetails,
          feedbackType: getValueFromObj(formData?.complaintRequest?.feedbackDetails?.feedbackType, 'value'),
          nature: getValueFromObj(formData?.complaintRequest?.feedbackDetails?.nature, 'value'),
          raisedBy: getValueFromObj(formData?.complaintRequest?.feedbackDetails?.raisedBy, 'value'),
        },
        productDetails: {
          ...customerFeedbackApiData?.complaintRequest?.productDetails,
          ...formData?.complaintRequest?.productDetails,
          catlogCode: getValueFromObj(formData?.complaintRequest?.productDetails?.catlogCode, 'value'),
        },
        customerDetails: {
          ...customerFeedbackApiData?.complaintRequest?.customerDetails,
          ...formData?.complaintRequest?.customerDetails,
          custCode: getValueFromObj(formData?.complaintRequest?.customerDetails?.custCode, 'value'),
          depotCode: getValueFromObj(formData?.complaintRequest?.customerDetails?.depotCode, 'value'),
          size: getValueFromObj(formData?.complaintRequest?.customerDetails?.size, 'value'),
        },
        communicationDetails: {
          ...customerFeedbackApiData?.complaintRequest?.communicationDetails,
          ...formData?.complaintRequest?.communicationDetails,
          recordedBy: getValueFromObj(formData?.complaintRequest?.communicationDetails?.recordedBy, 'value'),
          sampleCollectedBy: getValueFromObj(formData?.complaintRequest?.communicationDetails?.sampleCollectedBy, 'label'),
        },
      },
      complaintActions: {
        ...customerFeedbackApiData.complaintActions,
        ...formData.complaintActions,
        correctiveActions: {
          ...customerFeedbackApiData?.complaintActions?.correctiveActions,
          ...formData?.complaintActions?.correctiveActions,
          corrActionBy: getValueFromObj(formData?.complaintActions?.correctiveActions?.corrActionBy, 'label'),
        },
        immediateActions: {
          ...customerFeedbackApiData?.complaintActions?.immediateActions,
          ...formData?.complaintActions?.immediateActions,
          immActionBy: getValueFromObj(formData?.complaintActions?.immediateActions?.immActionBy, 'label'),
        },
        preventativeActions: {
          ...customerFeedbackApiData?.complaintActions?.preventativeActions,
          ...formData?.complaintActions?.preventativeActions,
          preventActionBy: getValueFromObj(formData?.complaintActions?.preventativeActions?.preventActionBy, 'label'),
        },
      },
      complaintCloseout: {
        ...customerFeedbackApiData?.complaintCloseout,
        ...formData?.complaintCloseout,
        custResSentBy: getValueFromObj(formData?.complaintCloseout?.custResSentBy, 'label'),
        completedBy: formData?.actionType === 'C' ? getUserFromLocalStorage()?.name ?? '' : '',
        completedOnDate: formData?.actionType === 'C' ? formattoJsonDate(new Date()) : '',
        title: formData?.actionType === 'C' ? getUserFromLocalStorage()?.groupDesc ?? '' : '',
      },
    };

    const files = Array.from(inMemoryfileStorage);

    if (files.length === 0) {
      await mutateAsync(modifiedApiData);
      return;
    }

    const processFiles = async () => {
      return Promise.all(
        files.map((file) => {
          return new Promise((resolve, reject) => {
            const k = Number(String(file[0]).split('-')[1]);
            const f = file[1];
            const fileReader = new FileReader();

            fileReader.onload = () => {
              const base64File = fileReader.result?.toString().split(',')[1];
              resolve({
                documentId: selectedCustomerFeedback.complaintId,
                stepId: k,
                documentName: f.name,
                path: URL.createObjectURL(f),
                extension: f.name.split('.').pop(),
                detailedExtension: f.name.split('.').pop(),
                documentFile: `data:${f.type};base64,${base64File}`,
              });
            };

            fileReader.onerror = () => {
              reject('Error reading file');
            };

            fileReader.readAsDataURL(f);
          });
        })
      );
    };

    try {
      const fileObjArray = await processFiles();
      const modifiedApiDataWithFiles = {
        ...modifiedApiData,
        complaintResource: customerFeedbackApiData && customerFeedbackApiData.complaintResource.length > 0 ? [...customerFeedbackApiData.complaintResource, ...(fileObjArray as any[])] : (fileObjArray as any[]),
      };

      await mutateAsync(modifiedApiDataWithFiles);

      inMemoryfileStorage.clear();
    } catch (error) {
      console.error('Error processing files:', error);
    }
  };

  const handleErrors = (errors: any) => {
    // console.log('Form Errors:', errors);
  };

  //Error handling
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <p className="text-red-500">
            Error loading data : <span className="font-bold">{error.message}</span>
          </p>
        </div>
      </div>
    );
  }

  //Loading and error handling
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
        <style>{`
          .loader {
            border-top-color: #3498db;
            animation: spin 1s ease-in-out infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(methods.getValues().actionType === 'C' ? handleOpenConfirmationDialog : handleFormSubmit, handleErrors)}>
        <ModuleBaseLayout
          main={
            <SectionBaseLayout
              header={<CustomerFeedbackEntryHeader />}
              footer={<CustomerFeedbackEntryFooter />}
              main={
                <Flex gap="6" direction="column" className="min-h-full" style={{ backgroundColor: '#f4f4f4' }}>
                  <Flex direction="column" gap="6" style={{ backgroundColor: '#f4f4f4', padding: '2rem', maxWidth: '1400px' }}>
                    <CustomerFeedbackDetailsBlock />
                    <CustomerFeedbackActionsBlock />
                    <CustomerFeedbackCloseOutBlock />
                    <ToastWrapper open={open} setOpen={setOpen} toastState={toastState} actionUrl={`/${configStore.appName}/customer-feedback/`} actionLabel="Go to List" />
                  </Flex>
                </Flex>
              }
            />
          }
        />
        <PopupMessageBox showCancelButton={true} isOpen={isOpenCompletionPopup} onOpenChange={setIsOpenCompletionPopup} dialogTitle="Confirmation" dialogDescription="Are you sure you want to complete the feedback?" onConfirm={methods.handleSubmit(handleFormSubmit, handleErrors)} confirmButtonLabel="Yes" cancelButtonLabel="No" />
      </form>
      <DevTool control={methods.control} />
    </FormProvider>
  );
};

export default CustomerFeedbackEntryForm;
