import { ReadOnlyProvider, useSpinner } from '@cookers/providers';
import { configStore, setCloseButtonVisible, setCloseOutBlockReadOnly, setCloseOutSectionReadonly, setDetailBlockReadOnly, setReadyForCompletionButtonVisible, setReadyForCompletionSectionReadonly, setResponseBlockReadOnly, setSaveButtonVisible, setSelectedSupplierNcrFormApiData, STORE, useStoreSelector } from '@cookers/store';
import { Button, Flex, ModuleBaseLayout, PopupMessageBox, SectionBaseLayout, Text } from '@cookers/ui';
import { formattoJsonDate, getUserFromLocalStorage, inMemoryfileStorage } from '@cookers/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useSupplierNcrFormQuery } from '../../queries';
import { supplierNcrDefaultValues, supplierNcrFormSchema, SupplierNcrFormSchemaApiType, SupplierNcrFormSchemaType } from '../../schema/form-schema';
import { SupplierNcrCloserBlock } from './supplier-ncr-closer-block';
import { SupplierNcrDetailsBlock } from './supplier-ncr-details-block';
import { SupplierNcrFormFooter } from './supplier-ncr-form-footer';
import { SupplierNcrFormHeader } from './supplier-ncr-form-header';
import { SupplierNcrResponseBlock } from './supplier-ncr-response-block';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAxiosInstance } from '@cookers/services';
import * as Toast from '@radix-ui/react-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { DevTool } from '@hookform/devtools';
import { useNavigationBlock } from '@cookers/modules/common';
import { ToastWrapper, useToast } from '@cookers/modules/shared';
type ActionType = 'save' | 'responseReceived' | 'readyForCompletion' | 'completed';

function SupplierNcrEntryForm() {
  const { selectedSupplierNcrId, selectedSupplierNcrFormApiData, masterData } = useStoreSelector(STORE.SupplierNcr);
  const { supplierNcrData, isLoading } = useSupplierNcrFormQuery(selectedSupplierNcrId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setBlocked } = useNavigationBlock();
  // const [open, setOpen] = useState(false);
  const [isOpenReadyForCompletionPopup, setIsOpenReadyForCompletionPopup] = useState(false);
  const { setIsSpinnerLoading } = useSpinner();

  const { id } = useParams<{ id?: string }>();
   const { open, setOpen, toastState, showToast } = useToast();
  // const [toastState, setToastState] = useState({
  //   title: '',
  //   message: '',
  //   type: '',
  // });
  const queryClient = useQueryClient();
  const methods = useForm<SupplierNcrFormSchemaType>({
    resolver: zodResolver(supplierNcrFormSchema),
    defaultValues: id ? supplierNcrData : supplierNcrDefaultValues,
    //reValidateMode: 'onChange',
  });
  const actionTypeToStatusMap: Record<ActionType, string> = {
    save: 'R',
    responseReceived: 'RR',
    readyForCompletion: 'RC',
    completed: 'C',
  };
  // HACK: Reset the form when supplierNcrData changes
  // This is a workaround for the issue where the form does not reset properly
  // when the supplierNcrData is updated
  // Ideally, we should use a more robust solution like form state management
  // or a library like react-query to handle form state
  // But for now, this is a quick fix to ensure the form resets correctly
  useEffect(() => {
    if (supplierNcrData) {
      dispatch(setSelectedSupplierNcrFormApiData(supplierNcrData));
      methods.reset(supplierNcrData);
    }
  }, [supplierNcrData, methods, dispatch]);
  useEffect(() => {
    methods.setValue('supplierNcrRequest.raisedBy', { label: getUserFromLocalStorage()?.name, value: getUserFromLocalStorage()?.originator });
  }, []);

  useEffect(() => {
    if (Object.keys(methods.formState.dirtyFields).length > 0) {
      setBlocked(true); // Set the block if the form is dirty
    } else {
      setBlocked(false); // Clear the block if the form is not dirty
    }
  }, [methods.formState]);
  // HACK: End

  // console.log("Form State", methods.formState)

  useEffect(() => {
    const supplierNcrStatus = selectedSupplierNcrFormApiData?.supplierNcrRequest?.status ?? '';

    // Define default states
    let detailReadOnly = true;
    let responseReadOnly = true;
    let closeOutReadOnly = true;
    let readyForCompletionReadOnly = true;
    let closeOutSectionReadOnly = true;
    let saveVisible = false;
    let readyForCompletionVisible = false;
    let closeVisible = false;

    if ((masterData.showCreateNCR || masterData.showUpdateNCR) && !masterData.showUpdateNCRWithSuppResponse && !masterData.showCloseNCR) {
      if (supplierNcrStatus === 'R' || supplierNcrStatus === '') {
        detailReadOnly = false;
        saveVisible = true;
      }
    }

    if (masterData.showUpdateNCRWithSuppResponse && !masterData.showCloseNCR) {
      if (supplierNcrStatus === '') {
        detailReadOnly = false;
        saveVisible = true;
      } else if (supplierNcrStatus === 'R') {
        detailReadOnly = false;
        responseReadOnly = false;
        closeOutReadOnly = false;
        readyForCompletionReadOnly = false;
        readyForCompletionVisible = true;
        saveVisible = true;
      } else if (supplierNcrStatus === 'RR') {
        closeOutReadOnly = false;
        detailReadOnly = false;
        responseReadOnly = false;
        readyForCompletionReadOnly = false;
        readyForCompletionVisible = true;
        saveVisible = true;
      } else if (supplierNcrStatus === 'RC' || supplierNcrStatus === 'C') {
        closeOutReadOnly = false;
      }
    }

    if (masterData.showCloseNCR) {
      if (supplierNcrStatus === '') {
        detailReadOnly = false;
        saveVisible = true;
      } else if (supplierNcrStatus === 'R') {
        detailReadOnly = false;
        responseReadOnly = false;
        closeOutReadOnly = false;
        readyForCompletionReadOnly = false;
        readyForCompletionVisible = true;
        saveVisible = true;
      } else if (supplierNcrStatus === 'RR') {
        detailReadOnly = false;
        responseReadOnly = false;
        closeOutReadOnly = false;
        readyForCompletionReadOnly = false;
        saveVisible = true;
        readyForCompletionVisible = true;
      } else if (supplierNcrStatus === 'RC') {
        closeOutReadOnly = false;
         responseReadOnly = false;
        closeOutSectionReadOnly = false;
        readyForCompletionReadOnly = false;
        closeVisible = true;
      }
    }

    // Dispatch all updates at once
    dispatch(setDetailBlockReadOnly(detailReadOnly));
    dispatch(setResponseBlockReadOnly(responseReadOnly));
    dispatch(setCloseOutBlockReadOnly(closeOutReadOnly));
    dispatch(setReadyForCompletionSectionReadonly(readyForCompletionReadOnly));
    dispatch(setCloseOutSectionReadonly(closeOutSectionReadOnly));
    dispatch(setSaveButtonVisible(saveVisible));
    dispatch(setReadyForCompletionButtonVisible(readyForCompletionVisible));
    dispatch(setCloseButtonVisible(closeVisible));
  }, [selectedSupplierNcrFormApiData]);

  useEffect(() => {
      return () => {
          inMemoryfileStorage.clear();
      };
    }, []);

  console.log('HHHH', methods.formState.isDirty, methods.formState.isValid, methods.formState.errors);
  const { mutateAsync } = useMutation({
    mutationFn: (supplierNcr: any) => {
      const requestOptions = {
        method: 'post',
      };

      return getAxiosInstance().post(`supplier-ncr`, supplierNcr, requestOptions);
    },
    onSuccess: (data) => {
      console.log(data);
      if (!data?.data.status) {
        showToast({type: 'error', title: 'Supplier NCR Submission failed!', message: 'Supplier NCR Submission failed!'})
        setIsSpinnerLoading(false);
        console.log(data.data?.message || 'SupplierNcr submission failed. Please try again.');
      } else {
        const newSupplierNcrId = data?.data.id;
        if (newSupplierNcrId) {
          /* if (incidentId == 0) {
            dispatch(setNewIncidentFlag(true));
          } */
          setOpen(true);
          showToast({ type: 'success', message: 'Supplier NCR Submitted Successfully', title: 'Supplier NCR Submitted Successfully' });
          setIsSpinnerLoading(false);
          dispatch(setCloseOutBlockReadOnly(true));
          dispatch(setResponseBlockReadOnly(true));
          dispatch(setDetailBlockReadOnly(true));
          console.log('New SupplierNcr ID:', newSupplierNcrId);
          queryClient.invalidateQueries({ queryKey: ['data-SupplierNcr'] });

          setTimeout(() => {
            id ? window.location.reload() : navigate(`/${configStore.appName}/supplier-ncr/${newSupplierNcrId}`);
          }, 1000);
        }
      }
    },
    onError: (error) => {
      setOpen(true);
      showToast({ type: 'error', message: 'Supplier NCR Submission failed!', title: 'Supplier NCR Submission failed !' });
      setIsSpinnerLoading(false);
    },
  });

  const handleOpenConfirmationDialog = (formData: SupplierNcrFormSchemaType) => {
    setIsOpenReadyForCompletionPopup(true);
    console.log('Form submitted with data:', formData);
  };

  const handleFormSubmit = async (formData: SupplierNcrFormSchemaType) => {
    console.log('Form submitted with data:', formData);
    setIsSpinnerLoading(true);
    const apiData: SupplierNcrFormSchemaApiType = selectedSupplierNcrFormApiData && Object.entries(selectedSupplierNcrFormApiData).length === 0 ? null : selectedSupplierNcrFormApiData;
    let apiPostData = {
      supplierNcrRequest: {
      ...formData.supplierNcrRequest,
      raisedBy: formData.supplierNcrRequest.raisedBy.value,
      supplierCode: formData.supplierNcrRequest.supplierCode.value,
      catalogCode: formData.supplierNcrRequest.catalogCode.value,
      status: actionTypeToStatusMap[formData.actionType as ActionType] || formData.supplierNcrRequest.status,
      },
      requestCreatedDateTime: formattoJsonDate(new Date()),
      supplierNcrMessage: formData.supplierNcrMessage,
      supplierNcrCloseOut: formData.supplierNcrCloseOut,
      supplierNcrResource: apiData && apiData.supplierNcrResource.length > 0 ? apiData.supplierNcrResource : [],
    };
    
    const files = Array.from(inMemoryfileStorage);
    
    if (files.length === 0) {
      await mutateAsync(apiPostData);
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
                documentId: selectedSupplierNcrId,
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
      apiPostData = {
        ...apiPostData,
        supplierNcrResource: apiData && apiData.supplierNcrResource.length > 0 ? [...apiData.supplierNcrResource, ...(fileObjArray as any[])] : (fileObjArray as any[]),
      };

      console.log('Submitting with Documents:', apiPostData);
      await mutateAsync(apiPostData);

      inMemoryfileStorage.clear();
    } catch (error) {
      console.error('Error processing files:', error);
    }
  };

  const handleErrors = (errors: any) => {
    console.log('TTT: Form errors:', errors);
  };

  const SupplierNcrFormContent = (
    <Flex gap="6" className='h-full' direction="column" style={{ backgroundColor: '#f4f4f4' }}>
      <Flex direction="column" gap="6" style={{ backgroundColor: '#f4f4f4', padding: '2rem', maxWidth: '1400px' }}>
        <SupplierNcrDetailsBlock />
        <SupplierNcrResponseBlock />
        <SupplierNcrCloserBlock />
        <ToastWrapper
        open={open}
        setOpen={setOpen}
        toastState={toastState}
        actionUrl={`/${configStore.appName}/supplier-ncr/`}
        actionLabel="Go to List"
      />
      </Flex>
    </Flex>
  );

  const sectionLayout = <SectionBaseLayout header={<SupplierNcrFormHeader />} main={SupplierNcrFormContent} footer={<SupplierNcrFormFooter />}></SectionBaseLayout>;

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
      <ReadOnlyProvider readOnly={false}>
        
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(methods.getValues().actionType === 'readyForCompletion' ? handleOpenConfirmationDialog : handleFormSubmit, handleErrors)}>
            <ModuleBaseLayout main={sectionLayout} />
            {/* <DevTool control={methods.control} /> */}
            {/* {isErrorConfirmMsg && (
            <PopupMessageBox
            isOpen={isErrorConfirmMsg}
            onOpenChange={setIsErrorConfirmMsg}
            dialogTitle=""
            dialogDescription="Please fill all the mandatory fields"
            onConfirm={() => handleMadatoryConfirmation()}
            />
            )} */}
            {isOpenReadyForCompletionPopup && (
              <PopupMessageBox
                showCancelButton={true}
                // item={methods.getValues()}
                isOpen={isOpenReadyForCompletionPopup}
                onOpenChange={setIsOpenReadyForCompletionPopup}
                dialogTitle="Confirmation"
                dialogDescription="Please confirm that the Supplier NCR is ready for completion."
                onConfirm={methods.handleSubmit(handleFormSubmit, handleErrors)}
                confirmButtonLabel="Yes"
                cancelButtonLabel="No"
              />
            )}
          </form>
        </FormProvider>
        
        <DevTool control={methods.control} />
      </ReadOnlyProvider>
  );
}

export default SupplierNcrEntryForm;
