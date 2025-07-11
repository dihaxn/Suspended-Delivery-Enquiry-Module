import React, { useEffect } from 'react';
import { Button, FormDate, FormInput, FormInputAutoComplete, FormInputAutoCompleteEdit, FormTextArea } from '@cookers/ui';
import { Box, Flex, Heading, IconButton } from '@radix-ui/themes';
import { BookOpenCheck, X } from 'lucide-react';
import { removeCustomerFeedbackResource, STORE, updateCustomerFeedbackPermission, useStoreSelector } from '@cookers/store';
import { useDispatch } from 'react-redux';
import { ResourceUploader } from '@cookers/modules/shared';
import { getCustomerFileContent } from '../../queries/get-customer-feedback-file-conent-query';
import { useFormContext } from 'react-hook-form';

const CustomerFeedbackActionsBlock: React.FC = () => {
  const { permission, masterData, customerFeedbackApiData } = useStoreSelector(STORE.CustomerFeedback);
  const dispatch = useDispatch();
  const isFormVisible = permission.canViewCloseOutBlock;
  const isReadOnly = !permission.canEditCloseOutBlock;
  const { unregister,  watch } = useFormContext();

  const handleDeleteFile = (documentId: number) => {
    dispatch(removeCustomerFeedbackResource(documentId));
  };

  

  const handleView = (view: boolean) => {
    dispatch(updateCustomerFeedbackPermission({ canViewCloseOutBlock: view }));
  };

  if (isFormVisible) {
    return (
      <div className="form-section-block overflow-hidden">
        <Box className="form-section-header">
          <Flex justify="between" align="center" gap="6">
            <Heading>Send Close Out Response to Customer</Heading>
            <Flex align="end" gap="2">
              <IconButton className="cursor-pointer" variant="soft" color="amber" radius="full" type="button" onClick={() => handleView(false)} disabled={isReadOnly}>
                <X width="18" height="18" />
              </IconButton>
            </Flex>
          </Flex>
          <Flex align="end" gap="2">
            <small></small>
          </Flex>
        </Box>
        <Flex wrap="wrap" className="form-section-grid !flex-row">
          <Flex className="w-full" gap="0" direction="row" wrap="wrap">
            <Box className="form-section-2x-grid-block w-3/4">
              <Heading size="3">Final Response to Customer</Heading>
              <div className="grid grid-cols-3 gap-x-10">
                <div className="col-span-2">
                  <div className="grid grid-cols-2 gap-x-10">
                    <FormInputAutoCompleteEdit
                      label="Who"
                      placeHolder="Please select Person"
                      name="complaintCloseout.custResSentBy"
                      list={masterData.activeUsers.map((item) => item.name)}
                      readOnly={isReadOnly}
                    />
                    <FormDate label="When" name="complaintCloseout.custResOnDate" dateFormat="dd-MMM-yyyy" returnType="string" maxDate={new Date()} minDate={watch('complaintActions.preventativeActions.corrActionComplOnDate')} readOnly={isReadOnly} />
                  </div>
                </div>
                <div className="col-span-1"></div>
                <div className="col-span-3">
                  <FormTextArea label="Response to Customer" name="complaintCloseout.custResComments" maxLength={300} readOnly={isReadOnly} />
                </div>
              </div>
            </Box>
            <Box className="form-section-2x-grid-block w-1/4">
              <Heading size="3">Close Out Information</Heading>
              <FormInputAutoComplete
                label="Completed By"
                placeHolder="Please select Person"
                name="complaintCloseout.completedBy"
                readOnly={true}
                list={masterData.activeUsers.map((item) => ({
                  label: item.name,
                  value: item.originator,
                }))}
              />
              <FormInput label="Title" name="complaintCloseout.title" readOnly={true} /> {/**Need to get this field from BE */}
              <FormDate label="Close Out Date" name="complaintCloseout.completedOnDate" dateFormat="dd-MMM-yyyy hh:mm:ss" showTimeSelect={true} returnType="string" readOnly={true} />
            </Box>
            <div className="w-full">
              <ResourceUploader groupId={3} dataType="CustomerFeedback" currentFiles={customerFeedbackApiData.complaintResource} getFileContent={getCustomerFileContent} handleDelete={handleDeleteFile} isReadOnly={isReadOnly} />
            </div>
          </Flex>
        </Flex>
      </div>
    );
  } else {
    return (
      <Box className="p-4 border border-solid border-gray-200 rounded-lg shadow-sm bg-white">
        <Flex align="center" justify="between" gap="4">
          {/* Left: Icon and Text Block */}
          <Flex align="center" gap="3">
            <Box className="icon-block bg-green-100 p-2 rounded-full">
              <BookOpenCheck className="text-green-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-700">
                Send Close Out Response to Customer
              </Heading>
              <p className="text-sm text-gray-500">Click the button to update Close Out Response to Customer.</p>
            </Box>
          </Flex>
          <Button size="2" variant="outline" type="button" className="border-gray-300 text-gray-700 hover:bg-gray-100" onClick={() => handleView(true)} disabled={isReadOnly} >
            Close Out
          </Button>
        </Flex>
      </Box>
    );
  }
};

export default CustomerFeedbackActionsBlock;
