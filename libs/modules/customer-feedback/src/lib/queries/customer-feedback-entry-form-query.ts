import { CustomerFeedbackEntryInterface, CustomerFeedbackMasterData, LookupTable } from '@cookers/models';
import { getAxiosInstance } from '@cookers/services';
import { STORE, useStoreSelector } from '@cookers/store';
import { useQuery } from '@tanstack/react-query';
import { findPersonByOriginator } from '../components/utils';

const fetchCustomerFeedbackEntryData = async (complaintId: number) => {
  const response = await getAxiosInstance().get<CustomerFeedbackEntryInterface>(`complaints/${complaintId}`);
  return response.data;
};

const modifyJsonFields = (data: CustomerFeedbackEntryInterface, masterData: CustomerFeedbackMasterData) => {
  const productObj = masterData.catalogList.find((catalog) => catalog.catlogCode === data.complaintRequest.productDetails.catlogCode);
  const feedbackDetailsFeedbackType = masterData.feedbackTypeList.find((item) => item.value === data.complaintRequest.feedbackDetails.feedbackType);
  const feedbackDetailsIsPositive = masterData.natureList.find((item) => item.value === data.complaintRequest.feedbackDetails.nature);
  const customerDetailsDepotCode = masterData.depotList.find((item) => item.value === data.complaintRequest.customerDetails.depotCode);
  const custCodeObject = { label: data.complaintRequest.customerDetails.customerName ?? '', value: data.complaintRequest.customerDetails.custCode ?? '' };

  const modifiedComplaintRequest = {
    ...data.complaintRequest,
    feedbackDetails: {
      ...data.complaintRequest.feedbackDetails,
      raisedBy: findPersonByOriginator(masterData, data.complaintRequest.feedbackDetails.raisedBy),
    },
    customerDetails: {
      ...data.complaintRequest.customerDetails,
      custCode: custCodeObject as LookupTable,
      // size: 'R'
    },
    productDetails: {
      ...data.complaintRequest.productDetails,
      catlogCode: { label: productObj?.displayName ?? '', value: productObj?.catlogCode ?? '', other: productObj?.partNumber ?? '' },
    },
    communicationDetails: {
      ...data.complaintRequest.communicationDetails,
    },
  };

  const modifiedData = {
    ...data,
    complaintRequest: modifiedComplaintRequest,
    complaintActions: {
      ...data.complaintActions,
      preventativeActions: {
        ...data.complaintActions.preventativeActions,
        corrActionFixIssue: data.complaintActions.preventativeActions.corrActionFixIssue.trim() === '' ? 'Y' : data.complaintActions.preventativeActions.corrActionFixIssue,
      },
    },
  };
  return modifiedData;
};

export const useCustomerFeedbackEntryFormQuery = (complaintId: number) => {
  const { masterData } = useStoreSelector(STORE.CustomerFeedback);
  const { data, error, isLoading, isFetching, refetch } = useQuery<CustomerFeedbackEntryInterface, Error, CustomerFeedbackEntryInterface>({
    queryKey: ['customer-feedback-entry-query', complaintId],
    queryFn: () => fetchCustomerFeedbackEntryData(complaintId),
    enabled: !!complaintId,
    staleTime: 0,
    retryDelay: 1000,
    select: (data) => modifyJsonFields(data, masterData),
  });

  return {
    customerFeedbackEntryData: data,
    error,
    isLoading,
    isFetching,
    refetch,
  };
};
