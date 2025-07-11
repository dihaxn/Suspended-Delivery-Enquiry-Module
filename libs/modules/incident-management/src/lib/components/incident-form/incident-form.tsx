import { IncidentFormValue } from '@cookers/models';
import { useNavigationBlock } from '@cookers/modules/common';
import { useSpinner } from '@cookers/providers';
import { getAxiosInstance } from '@cookers/services';
import {
  configStore,
  setIncidentRefreshFlag,
  setProxyReadOnlyFlag,
  STORE,
  useStoreSelector,
  setNewIncident,
  setDocUnsaveCount,
  setIncidentDocDeleted,
} from '@cookers/store';
import { Flex, ModuleBaseLayout, SectionBaseLayout, PopupMessageBox } from '@cookers/ui';
import { getProxyUserFromLocalStorage, getUserFromLocalStorage } from '@cookers/utils';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FieldErrors, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useIncidentFormQuery } from '../../hooks';
import { processIncidentForm } from '../../logic/get-converted-form-data';
import { getInitialFormValues, InitialValuesType } from '../../logic/get-employee-data';
import { ReadOnlyProvider } from '../../provider/read-only-incident-provider';

import {
  IncidentCloseAction,
  IncidentEmployeeDetails,
  IncidentEventDetails,
  IncidentInjuryDetails,
  IncidentReportTypeSelector,
  IncidentSummary,
} from './components';
import { IncidentFormDefaultValues, incidentFormSchema, IncidentFormSchemaType } from './form-schema';
export const IncidentForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id?: string }>();
  const incidentId = id ? Number(id) : 0;
  const { masterData, incidentDocUnsaved, isIncidentDocDeleted } = useStoreSelector(STORE.IncidentManagement);
  const { incidentData, error, isLoading } = useIncidentFormQuery(id || '');
  const { setBlocked } = useNavigationBlock();
  const { setIsSpinnerLoading } = useSpinner();
  const [isErrorConfirmMsg, setIsErrorConfirmMsg] = useState(false);
  const sessionUser = getUserFromLocalStorage();
  const proxyUserName = getProxyUserFromLocalStorage()?.name || '';
  const [isSummaryUpdateRequired, setIsSummaryUpdateRequired] = useState(false);
  const isOrginator = true;
  const {
    permissionLevel: { readOnly: isReadOnlyUser },
    editOnlyFirstTwoSection,
    editFourthSection,
    editWorkCover,
    showWorkCover,
  } = masterData || {};
  const methods = useForm<IncidentFormSchemaType>({
    resolver: zodResolver(incidentFormSchema),
    defaultValues: incidentData || IncidentFormDefaultValues,

    //reValidateMode:"onChange"
  });
  useEffect(() => {
    const initializeForm = async () => {
      if (!masterData) return; // Ensure masterData is available before proceeding
      dispatch(setDocUnsaveCount({ type: 'set', value: 0 }));
      dispatch(setIncidentDocDeleted(false));
      if (incidentId === 0) {
        // Fetch and set initial values if incidentId is 0
        dispatch(setNewIncident(true));
        const initialValues: InitialValuesType = await getInitialFormValues(masterData);

        if (initialValues.empName === proxyUserName) {
          dispatch(setProxyReadOnlyFlag(true));
        } else {
          dispatch(setProxyReadOnlyFlag(false));
        }
        methods.reset((prevValues) => ({
          ...prevValues,
          ...initialValues,
        }));
      } else if (incidentData) {
        dispatch(setNewIncident(false));
        setIsSummaryUpdateRequired(true);
        if (incidentData.empName === proxyUserName) {
          dispatch(setProxyReadOnlyFlag(true));
        } else {
          dispatch(setProxyReadOnlyFlag(false));
        }
        if (masterData.editFourthSection && incidentData.empName !== proxyUserName) {
          if (!incidentData.supervisor) {
            incidentData.supervisor = incidentData.eventSupervisor;
          }
          if (!incidentData.managerOnDate) {
            incidentData.managerOnDate = new Date(new Date().setHours(0, 0, 0, 0));
          }
          if (!incidentData.supervisorOnDate) {
            incidentData.supervisorOnDate = new Date(new Date().setHours(0, 0, 0, 0));
          }
        }
        methods.reset(incidentData);
        setCurrentStatus(incidentData.status);
        setRefId(incidentData.refCode || '');
      }
    };

    initializeForm();
  }, [incidentId, masterData, incidentData, methods]);
  const { watch, getValues, formState } = methods;
  const { isDirty } = formState;
  console.log(isDirty);
  console.log(formState);
  console.log(incidentDocUnsaved);
  console.log(isIncidentDocDeleted);
  useEffect(() => {
    if (isDirty || incidentDocUnsaved > 0 || isIncidentDocDeleted) {
      setBlocked(true); // Set the block if the form is dirty
    } else {
      setBlocked(false); // Clear the block if the form is not dirty
    }
  }, [isDirty, incidentDocUnsaved, isIncidentDocDeleted, setBlocked]);

  const anyInjury = watch('anyInjury');
  const reportType = watch('reportType');
  const status = watch('status');

  const [currentStatus, setCurrentStatus] = useState(status);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [refId, setRefId] = useState('New');
  const [isSaved, setIsSaved] = useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: (newIncident: IncidentFormValue) => {
      const requestOptions = {
        method: 'post',
      };

      return getAxiosInstance().post(`incidents`, newIncident, requestOptions);
    },
    onSuccess: (data) => {
      if (!data?.data.status) {
        setSubmitError(data.data?.message || 'Incident submission failed. Please try again.');
      } else {
        const newIncidentId = data?.data.id;
        if (newIncidentId) {
          /* if (incidentId == 0) {
            dispatch(setNewIncidentFlag(true));
          } */
          dispatch(setIncidentRefreshFlag(true));
          dispatch(setDocUnsaveCount({ type: 'set', value: 0 }));
          dispatch(setIncidentDocDeleted(false));
          console.log('New Incident ID:', newIncidentId);
          queryClient.invalidateQueries({ queryKey: ['incident-entry-query'] });
          navigate(`/${configStore.appName}/incident-management/${newIncidentId}`);
          // setIsSummaryUpdateRequired(true);
          //navigate(`/${configStore.appName}/incident-management`);
        }
      }
    },
    onError: (error) => {
      console.log(error);
      setSubmitError('Incident submission failed. Please try again.');
    },
  });

  const handleFormSubmit: SubmitHandler<IncidentFormSchemaType> = async (data) => {
    if (incidentFormSchema.safeParse(data)) {
      setIsSpinnerLoading(true);
      try {
        const processedData = processIncidentForm(data, incidentId, sessionUser?.originator);
        await mutateAsync(processedData);
      } catch (error) {
        console.error('Form submission failed:', error);
      } finally {
        setIsSpinnerLoading(false);
      }
    }
  };
  const handleErrors = (errors: FieldErrors<IncidentFormSchemaType>) => {
    setIsErrorConfirmMsg(true);
    console.log('Incident Form errors:', errors);
  };

  const handleSendForApproval: SubmitHandler<IncidentFormSchemaType> = async (data) => {
    if (incidentFormSchema.safeParse(data)) {
      setIsSpinnerLoading(true);
      try {
        const processedData = processIncidentForm(data, incidentId, sessionUser?.originator);
        await mutateAsync(processedData);
      } catch (error) {
        console.error('Form submission failed:', error);
      } finally {
        setIsSpinnerLoading(false);
      }
    }
  };
  const handleAcceptanceErrors = (errors: FieldErrors<IncidentFormSchemaType>) => {
    setIsErrorConfirmMsg(true);
    console.log('Incident Form errors:', errors);
  };
  const handleMadatoryConfirmation = async () => {
    setIsErrorConfirmMsg(false);
  };
  const handleSummaryUpdated = () => {
    // Reset the summary update flag to false
    setIsSummaryUpdateRequired(false);
  };
  const incidentFormContent = (
    <Flex gap="6" direction="column" style={{ backgroundColor: '#f4f4f4', padding: '2rem' }}>
      <IncidentEmployeeDetails />

      <IncidentEventDetails />
      {(anyInjury === 'Y' || reportType === 'INJU') && <IncidentInjuryDetails />}
      <IncidentCloseAction />
    </Flex>
  );

  const sectionLayout = <SectionBaseLayout header={<IncidentReportTypeSelector />} main={incidentFormContent}></SectionBaseLayout>;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ReadOnlyProvider
      props={{
        initialStatus: currentStatus,
        editOnlyFirstTwoSection: editOnlyFirstTwoSection,
        isReadOnlyUser: isReadOnlyUser,
        editFourthSection: editFourthSection,
        editWorkCover: editWorkCover,
        isOrginator: isOrginator,
        showWorkCover: showWorkCover,
      }}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleFormSubmit, handleErrors)}>
          <ModuleBaseLayout
            article={
              <IncidentSummary
                incidentId={incidentId}
                status={status}
                submitError={submitError}
                isSummaryUpdateRequired={isSummaryUpdateRequired}
                onSummaryUpdated={handleSummaryUpdated}
                sendForApproval={() => methods.handleSubmit(handleSendForApproval, handleAcceptanceErrors)()}
              />
            }
            main={sectionLayout}
          />
          <DevTool control={methods.control} />
          {isErrorConfirmMsg && (
            <PopupMessageBox
              isOpen={isErrorConfirmMsg}
              onOpenChange={setIsErrorConfirmMsg}
              dialogTitle=""
              dialogDescription="Please fill all the mandatory fields"
              onConfirm={() => handleMadatoryConfirmation()}
            />
          )}
        </form>
      </FormProvider>
    </ReadOnlyProvider>
  );
};
