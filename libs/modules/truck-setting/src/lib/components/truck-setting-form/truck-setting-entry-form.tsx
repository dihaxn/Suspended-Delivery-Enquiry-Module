import { TruckSettingDetails } from './truck-settings-details';
import { TruckSettingFormHeader } from './truck-setting-form-header';
import { TruckSettingFormFooter } from './truck-setting-form-footer';
import { getAxiosInstance } from '@cookers/services';
import { convertBase64ToBlob, formattoJsonDate, getOriginatorFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { configStore, STORE, useStoreSelector, setSelectedTruckSettingFormApiData } from '@cookers/store';
import { Flex, ModuleBaseLayout, SectionBaseLayout, PopupMessageBox } from '@cookers/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FieldErrors, FormProvider, SubmitHandler, useForm, useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { DevTool } from '@hookform/devtools';
import { ReadOnlyProvider, useSpinner } from '@cookers/providers';
import { ToastWrapper, useToast } from '@cookers/modules/shared';
import { truckSettingDefaultValues, truckSettingFormSchema, TruckSettingFormSchemaType, TruckSettingFormSchemaApiType } from '../../schema';
import { useTruckSettingFormQuery } from '../../hooks/use-truck-settings-form-query';
import { useNavigationBlock } from '@cookers/modules/common';

export const TruckSettingForm = () => {
  const { selectedTruckSettingId, selectedTruckSettingFormApiData, selectedTruckSetting } = useStoreSelector(STORE.TruckSettings);
  const { truckSettingData, isLoading } = useTruckSettingFormQuery(selectedTruckSettingId);
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const sessionUser = getUserFromLocalStorage();
  const [invalidFields, setInvalidFields] = useState([]);
  const { setBlocked } = useNavigationBlock();

  const methods = useForm<TruckSettingFormSchemaType>({
    resolver: zodResolver(truckSettingFormSchema),
    defaultValues: id ? truckSettingData : truckSettingDefaultValues,
  });
  
  const { setError } = methods;

  useEffect(() => {
    if (truckSettingData) {
      dispatch(setSelectedTruckSettingFormApiData(truckSettingData));
      methods.reset(truckSettingData);
    }
  }, [truckSettingData, methods, dispatch]);
useEffect(() => {   
    if (Object.keys(methods.formState.dirtyFields).length > 0) {    
      setBlocked(true); // Set the block if the form is dirty
    } else {
      setBlocked(false); // Clear the block if the form is not dirty
    }
  }, [methods.formState]); 
  const { open, setOpen, toastState, showToast } = useToast();
  const { setIsSpinnerLoading } = useSpinner();

  const { mutateAsync } = useMutation({
    mutationFn: (truckSetting: any) => {
      const requestOptions = {
        method: 'post',
      };
      return getAxiosInstance().post(`truck-settings`, truckSetting, requestOptions);
    },
    onSuccess: (data) => {
      if (!data?.data.status) {
        const errorMsg = data.data?.message;
        const statusCode = data.data?.statusCode;
        setOpen(true);
        if (statusCode !== 400 ){
          showToast({ type: 'error', message: errorMsg, title: 'Truck Setting Submission failed!' })
        }
        else {
          showToast({ type: 'error', message: "Please enter valid Oil Code", title: 'Truck Setting Submission failed!' })
        }
        setIsSpinnerLoading(false);

        if (statusCode === 400 && errorMsg) {
          const invalidFieldsList = errorMsg.split(',').map((field: string) => field.trim());
          setInvalidFields(invalidFieldsList);
          invalidFieldsList.forEach((fieldName: string) => {
            const key = (fieldName.charAt(0).toLowerCase() + fieldName.slice(1)) as keyof TruckSettingFormSchemaType;
            setError(key, {
              type: 'manual',
              message: `Please enter valid Oil Code`,
            });
          })
        }
        console.log(data.data?.message || 'Truck Setting submission failed. Please try again.');
      } else {
        const successStatus = data?.data.status;
        if (successStatus) {
          const newTruckSettingId = data?.data.id;
          setOpen(true);
          showToast({ type: 'success', message: 'Truck Setting Submitted Successfully', title: 'Truck Setting Submitted Successfully' })
          setIsSpinnerLoading(false);
          queryClient.invalidateQueries({ queryKey: ['truck-setting-entry-query'] });
          queryClient.invalidateQueries({ queryKey: ['data-TruckSettings'] });

          navigate(`/${configStore.appName}/truck-settings/${newTruckSettingId}`);
          
        }
      }
    },
    onError: (error) => {
      setOpen(true);
      showToast({ type: 'error', message: 'Truck Setting Submission failed!', title: 'Truck Setting Submission failed!' });
      setIsSpinnerLoading(false);
    },
  });

  const handleFormSubmit = async (formData: TruckSettingFormSchemaType) => {
    setIsSpinnerLoading(true);
    let apiPostData = {
      ...formData,
      carrierCode: formData.carrierCode.value.trim(),
      createdDate: formattoJsonDate(new Date()),
      createdBy: sessionUser?.originator,
    };
    console.log('Form submitted with data after trim:', formData);
    await mutateAsync(apiPostData);
  };
  const handleErrors = (errors: any) => {
    console.log('TTT: Form errors:', errors);
  };
  const tructSettingFormContent = (
    <Flex gap="6" direction="column" className='h-full' style={{ backgroundColor: '#f4f4f4' }}>
      <Flex direction="column" gap="6" style={{ backgroundColor: '#f4f4f4', padding: '2rem', maxWidth: '1400px' }}>
        <TruckSettingDetails />
        <ToastWrapper
        open={open}
        setOpen={setOpen}
        toastState={toastState}
        actionUrl={`/${configStore.appName}/truck-settings/`}
        actionLabel="Go to List"
      />
      </Flex>
    </Flex>
  );

  const sectionLayout = (
    <SectionBaseLayout header={<TruckSettingFormHeader />} main={tructSettingFormContent} footer={<TruckSettingFormFooter />}></SectionBaseLayout>
  );

  return (
      <ReadOnlyProvider readOnly={false}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleFormSubmit, handleErrors)}>
            <ModuleBaseLayout main={sectionLayout} />
          </form>
        </FormProvider>
        <DevTool control={methods.control} />
      </ReadOnlyProvider>   
  );
};
