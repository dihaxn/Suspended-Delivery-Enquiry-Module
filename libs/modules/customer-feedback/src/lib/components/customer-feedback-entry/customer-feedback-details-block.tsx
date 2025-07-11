import React, { useEffect } from 'react';
import { Box, Flex, Heading, IconButton } from '@radix-ui/themes';
import { FormDate, FormInput, FormInputAutoComplete, FormInputAutoCompleteEdit, FormInputAutoCompleteVirtualized, FormRadio, FormSelect, FormTextArea } from '@cookers/ui';
import { removeCustomerFeedbackResource, setCustomerList, STORE, useStoreSelector } from '@cookers/store';
import { ResourceUploader } from '@cookers/modules/shared';
import { useFormContext } from 'react-hook-form';
import { useCustomerBasicDepotQuery } from '../../queries/customer-lookup-query';
import { useDispatch } from 'react-redux';
import { getCustomerFileContent } from '../../queries/get-customer-feedback-file-conent-query';

const CustomerFeedbackDetailsBlock: React.FC = () => {
  const { watch, getValues, setValue, formState, clearErrors } = useFormContext();
  const { globalMasterData } = useStoreSelector(STORE.GlobalMaster);
  const { masterData, customerList, permission, customerFeedbackApiData } = useStoreSelector(STORE.CustomerFeedback);
  const dispatch = useDispatch();
  //Customer Lookup Query
  const depotCode = watch('complaintRequest.customerDetails.depotCode');
  const { customerBasicDepotData } = useCustomerBasicDepotQuery(depotCode || '');
  const isPersonRaisedReadOnly = !permission.canEditDetailsBlock || masterData.permissionLevel.readOnly;
  const isReadOnly = !permission.canEditDetailsBlock;

  const handleDeleteFile = (documentId: number) => {
    dispatch(removeCustomerFeedbackResource(documentId));
  };

  //Date validation for customer feedback details
  const receivedDate = getValues('complaintRequest.feedbackDetails.complaintOnDate');

  useEffect(() => {
    if (formState.isDirty) {
      setValue('complaintRequest.customerDetails', {
        ...getValues('complaintRequest.customerDetails'),
        custCode: '',
        contact: '',
        phone: '',
        size: '',
        address: '',
      });
    }
  }, [depotCode?.value]);

  // Update Redux store with customerBasicDepotData
  useEffect(() => {
    if (customerBasicDepotData) {
      dispatch(setCustomerList(customerBasicDepotData));
    }
  }, [customerBasicDepotData]);

  // Set customer details based on selected customer code
  const customerCode = watch('complaintRequest.customerDetails.custCode');
  useEffect(() => {
    const selectedCustomer = customerList.find((item) => item.custCode === customerCode?.value);
    if (selectedCustomer) {
      if (formState.dirtyFields?.complaintRequest?.customerDetails?.custCode) {
        setValue('complaintRequest.customerDetails.phone', selectedCustomer.telephone);
        setValue('complaintRequest.customerDetails.size', selectedCustomer.custMarket);
        setValue('complaintRequest.customerDetails.address', selectedCustomer.address);
        clearErrors(['complaintRequest.customerDetails.phone', 'complaintRequest.customerDetails.size', 'complaintRequest.customerDetails.address']);
      }
    }
  }, [customerCode]);

  return (
    <div className="form-section-block pb-4 overflow-hidden">
      <Box className="form-section-header">
        <Flex justify="between" align="center" gap="6">
          <Heading>Customer Feedback Details</Heading>
          <Flex align="end" gap="2"></Flex>
        </Flex>
        <Flex align="end" gap="2">
          <small></small>
        </Flex>
      </Box>
      <Flex wrap="wrap" className="form-section-grid !flex-row">
        <Flex className="w-full" gap="0" direction="row" wrap="wrap">
          <Box className="form-section-2x-grid-block w-1/2">
            <Heading size="3">Feedback Details</Heading>
            <div className="grid grid-cols-2 gap-x-10">
              <FormInputAutoComplete
                label="Person Raised"
                placeHolder="Please select Person"
                name="complaintRequest.feedbackDetails.raisedBy"
                list={masterData.activeUsers.map((item) => ({
                  label: item.name,
                  value: item.originator,
                }))}
                readOnly={isPersonRaisedReadOnly}
              />
              <FormDate label="Received Date" name="complaintRequest.feedbackDetails.complaintOnDate" dateFormat="dd-MMM-yyyy" returnType="string" maxDate={new Date()} readOnly={isReadOnly} />
              <FormSelect label="Feedback Classification" name="complaintRequest.feedbackDetails.feedbackType" data={masterData.feedbackTypeList} readOnly={isReadOnly} />
              <FormSelect label="Nature" name="complaintRequest.feedbackDetails.nature" data={masterData.natureList} readOnly={isReadOnly} />
            </div>
            <div>
              <FormTextArea label="Issue/Opportunity" name="complaintRequest.feedbackDetails.issue" maxLength={1080} readOnly={isReadOnly} />
            </div>
          </Box>

          <Box className="form-section-2x-grid-block w-1/2">
            <Heading size="3">Customer Details</Heading>
            <div className="grid grid-cols-2 gap-x-10">
              <FormSelect label="Depot" name="complaintRequest.customerDetails.depotCode" data={masterData.depotList} readOnly={isReadOnly} />
              <div className="col-span-2">
                <FormInputAutoCompleteVirtualized
                  label="Customer"
                  name="complaintRequest.customerDetails.custCode"
                  options={customerList.map((item) => ({
                    label: item.displayName,
                    value: item.custCode,
                  }))}
                  readOnly={isReadOnly || !depotCode}
                />
              </div>
              <FormInput label="Customer Contact" name="complaintRequest.customerDetails.contact" maxLength={30} readOnly={isReadOnly} />
              <FormInput label="Phone" name="complaintRequest.customerDetails.phone" readOnly={isReadOnly} maxLength={14} />
              <div className="col-span-2">
                <FormInput label="Address" name="complaintRequest.customerDetails.address" readOnly={isReadOnly} maxLength={180} />
              </div>
              <FormSelect label="Size" name="complaintRequest.customerDetails.size" data={masterData.sizeList} readOnly={isReadOnly} />
            </div>
          </Box>

          <Box className="form-section-2x-grid-block w-1/2">
            <Heading size="3">Product Details</Heading>
            <div>
              <FormInputAutoCompleteVirtualized
                label="Product"
                name="complaintRequest.productDetails.catlogCode"
                options={masterData.catalogList.map((item) => ({
                  label: item.displayName,
                  value: item.catlogCode,
                  other: item.partNumber,
                }))}
                readOnly={isReadOnly}
              />
            </div>
            <div className="grid grid-cols-2 gap-x-10">
              <FormInput label="Batch No" name="complaintRequest.productDetails.batchNo" maxLength={15} readOnly={isReadOnly} />
              <FormInput label="Pack Type" name="complaintRequest.productDetails.packType" maxLength={30} readOnly={isReadOnly} />
              <FormDate label="Date of Manufacturing" name="complaintRequest.productDetails.domDate" dateFormat="dd-MMM-yyyy" returnType="string" maxDate={receivedDate || new Date()} readOnly={isReadOnly} />
            </div>
          </Box>

          <Box className="form-section-2x-grid-block w-1/2">
            <Heading size="3">Communication with the complaining party</Heading>
            <div className="grid grid-cols-2 gap-x-10">
              <FormInputAutoCompleteEdit label="Who spoke with the complaining party" name="complaintRequest.communicationDetails.recordedBy" list={masterData.activeUsers.map((item) => item.name)} readOnly={isReadOnly} maxLength={50} />
            </div>
            <div>
              <FormTextArea label="What was Discussed" name="complaintRequest.communicationDetails.whatDiscussed" maxLength={1080} readOnly={isReadOnly} />
            </div>
            <div>
              <FormRadio label="Was sample taken from the complaining party" name="complaintRequest.communicationDetails.sampleTaken" itemList={globalMasterData.optionList} readOnly={isReadOnly} />
            </div>
            {watch('complaintRequest.communicationDetails.sampleTaken') === 'Y' && (
              <div className="grid grid-cols-2 gap-x-10">
                <FormInputAutoCompleteEdit label="By Whom" name="complaintRequest.communicationDetails.sampleCollectedBy" list={masterData.activeUsers.map((item) => item.name)} readOnly={isReadOnly} maxLength={50} />
                <FormInput label="Quantity" maxLength={50} name="complaintRequest.communicationDetails.sampleQty" readOnly={isReadOnly} />
                <FormDate label="Date" name="complaintRequest.communicationDetails.sampleCollectedOnDate" dateFormat="dd-MMM-yyyy" returnType="string" maxDate={receivedDate || new Date()} readOnly={isReadOnly} />
              </div>
            )}
          </Box>
          <div className="w-full">
            <ResourceUploader groupId={1} dataType="CustomerFeedback" isReadOnly={isReadOnly} currentFiles={customerFeedbackApiData.complaintResource} getFileContent={getCustomerFileContent} handleDelete={handleDeleteFile} />
          </div>
        </Flex>
      </Flex>
    </div>
  );
};

export default CustomerFeedbackDetailsBlock;
