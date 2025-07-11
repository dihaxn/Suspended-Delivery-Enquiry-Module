import {Button,Flex, ModuleBaseLayout, PopupMessageBox, SectionBaseLayout,Text} from '@cookers/ui';
import CarrierEntryDetail from './carrier-entry.detail';
import CarrierEntryHeader from './carrier-entry-header';
import CarrierEntryFooter from './carrier-entry-footer';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useNavigationBlock } from '@cookers/modules/common';
import { useSpinner } from '@cookers/providers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { carrierDefaultValues, carrierFormSchema, CarrierFormSchemaType } from '../../schema/form-schema';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { configStore, setSelectedCarrierFormApiData, STORE, useStoreSelector } from '@cookers/store';
import { useCarrierFormQuery } from '../../queries';
import { formattoJsonDate } from '@cookers/utils';
import { getAxiosInstance } from '@cookers/services';
import * as Toast from '@radix-ui/react-toast';
import { ToastWrapper, useToast } from '@cookers/modules/shared';

export const CarrierEntryForm = () => {
  const { selectedCarrierCode, selectedCarrierFormApiData, masterData } = useStoreSelector(STORE.CarrierMaster);
  console.log(selectedCarrierCode);
  const { carrierData, isLoading } = useCarrierFormQuery(selectedCarrierCode);
    console.log(carrierData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setBlocked } = useNavigationBlock();

  //const [isOpenReadyForCompletionPopup, setIsOpenReadyForCompletionPopup] = useState(false);
  const { setIsSpinnerLoading } = useSpinner();
  const { open, setOpen, toastState, showToast } = useToast();
  const { code } = useParams<{ code?: string }>();
  console.log("code",code);
  
  const queryClient = useQueryClient();
  const methods = useForm<CarrierFormSchemaType>({
    resolver: zodResolver(carrierFormSchema),
    defaultValues: code ? carrierData : carrierDefaultValues,
  
  });
  
  
 useEffect(() => {
  if (carrierData && masterData) {
    dispatch(setSelectedCarrierFormApiData(carrierData));
    methods.reset(carrierData);
  }
}, [carrierData, masterData, methods, dispatch]);

   useEffect(() => {   
    if (Object.keys(methods.formState.dirtyFields).length > 0) {    
      setBlocked(true); // Set the block if the form is dirty
    } else {
      setBlocked(false); // Clear the block if the form is not dirty
    }
  }, [methods.formState]); 
  // HACK: End

  // console.log("Form State", methods.formState)
const { mutateAsync } = useMutation({
    mutationFn: (carrier: any) => {
      const requestOptions = {
        method: 'post',
      };

      return getAxiosInstance().post(`carrier`, carrier, requestOptions);
    },
    onSuccess: (data) => {
      console.log(data);
      if (!data?.data.status) {
         const erroMsg = data?.data.message;
         setOpen(true);
        showToast({ type: 'error', message: erroMsg, title: 'Carrier Submission failed !' });
        setIsSpinnerLoading(false);
        console.log(data.data?.message || 'Carrier submission failed. Please try again.');
      } else {
        const successStatus = data?.data.status;
        if (successStatus) {
         const carrierRefCode = data?.data.code;
          setOpen(true);
          showToast({ type: 'success', message: 'Carrier Submitted Successfully', title: 'Carrier Submitted Successfully' });
          setIsSpinnerLoading(false);
        
          queryClient.invalidateQueries({ queryKey: ['carrier-entry-query'] });
          queryClient.invalidateQueries({ queryKey: ['data-CarrierMaster'] });
  
           navigate(`/${configStore.appName}/carrier-master/${carrierRefCode}`);
        }
      }
    },
    onError: (error) => {
      setOpen(true);
      showToast({ type: 'error', message: 'Carrier Submission failed!', title: 'Carrier Submission failed !' });
      setIsSpinnerLoading(false);
    },
  });
  const handleFormSubmit = async (formData: CarrierFormSchemaType) => {
    console.log('Form submitted with data:', formData);
    setIsSpinnerLoading(true);
   
    const apiPostData = {
      ...formData,
       driverId: formData.driver.value,
      requestCreatedDateTime: formattoJsonDate(new Date()),
     autoSequenceFlag: (formData.autoSequenceFlagForm===true)?1:0,
     isNew: code===undefined
    };
    try {
      
     
      console.log('Submitting with Documents:', apiPostData);
      await mutateAsync(apiPostData);
      
    } catch (error) {
      console.error('Error processing files:', error);
    }
  };

  const handleErrors = (errors: any) => {
    console.log('TTT: Form errors:', errors);
  };
 
  //console.log('HHHH', methods.formState.isDirty, methods.formState.isValid, methods.formState.errors);


  // Form Design
   const CarrierEntryFormContent = (
    <Flex gap="6" direction="column" style={{ backgroundColor: '#f4f4f4' }} className='h-full'>
      <Flex direction="column" gap="6" style={{ backgroundColor: '#f4f4f4', padding: '2rem', maxWidth: '1400px' }}>
        <CarrierEntryDetail  status={code}/>
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
 const sectionLayout = <SectionBaseLayout header={<CarrierEntryHeader />} main={CarrierEntryFormContent} footer={<CarrierEntryFooter   status={code}/>}></SectionBaseLayout>;
 //
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
       <form onSubmit={methods.handleSubmit(handleFormSubmit, handleErrors)}> 
    
        <ModuleBaseLayout main={sectionLayout} />
    </form>
    </FormProvider>
    );
};

