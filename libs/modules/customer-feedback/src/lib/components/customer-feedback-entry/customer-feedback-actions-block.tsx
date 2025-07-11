import React, { useEffect } from 'react';
import { Button, FormDate, FormInputAutoComplete, FormInputAutoCompleteEdit, FormRadio, FormTextArea } from '@cookers/ui';
import { Box, Flex, Heading, IconButton } from '@radix-ui/themes';
import { ClipboardList, X } from 'lucide-react';
import { removeCustomerFeedbackResource, STORE, updateCustomerFeedbackPermission, useStoreSelector } from '@cookers/store';
import { useDispatch } from 'react-redux';
import { ResourceUploader } from '@cookers/modules/shared';
import { getCustomerFileContent } from '../../queries/get-customer-feedback-file-conent-query';
import { useFormContext } from 'react-hook-form';

const CustomerFeedbackActionsBlock: React.FC = () => {
  const { globalMasterData } = useStoreSelector(STORE.GlobalMaster);
  const { permission, masterData, customerFeedbackApiData } = useStoreSelector(STORE.CustomerFeedback);
  const dispatch = useDispatch();
  const isFormVisible = permission.canViewActionsBlock;
  const isReadOnly = !permission.canEditActionsBlock;
  const { watch, getValues } = useFormContext();

  const handleDeleteFile = (documentId: number) => {
    dispatch(removeCustomerFeedbackResource(documentId));
  };

  const handleView = (view: boolean) => {
    dispatch(updateCustomerFeedbackPermission({ canViewActionsBlock: view }));
  };

  const corrActionFixIssue = watch('complaintActions.preventativeActions.corrActionFixIssue');

  //Date validation for actions block
  const receivedDate = getValues('complaintRequest.feedbackDetails.complaintOnDate');
  const immActionOnDate = watch('complaintActions.immediateActions.immActionOnDate');
  const corrActionOnDate = watch('complaintActions.correctiveActions.corrActionOnDate');
  const preventActionOnDate = watch('complaintActions.preventativeActions.corrActionComplOnDate');

  if (isFormVisible) {
    return (
      <div className="form-section-block overflow-hidden">
        <Box className="form-section-header">
          <Flex justify="between" align="center" gap="6">
            <Heading>Update Performed Actions</Heading>
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
            {/* Immediate Action */}
            <Box className="form-section-2x-grid-block w-full">
              <Heading size="3">Immediate Action</Heading>
              <div className="grid grid-cols-4 gap-x-10">
                <div className="col-span-3">
                  <FormTextArea label="Action Taken" name="complaintActions.immediateActions.immediateAction" maxLength={300} readOnly={!permission.canEditActionsBlock} />
                </div>
                <div className="col-span-1 mb-4">
                  <FormInputAutoCompleteEdit label="Who" name="complaintActions.immediateActions.immActionBy" list={masterData.activeUsers.map((item) => item.name)} readOnly={!permission.canEditActionsBlock} maxLength={50} />
                  <FormDate label="When" name="complaintActions.immediateActions.immActionOnDate" dateFormat="dd-MMM-yyyy" returnType="string" minDate={receivedDate} maxDate={corrActionOnDate || preventActionOnDate || new Date()} readOnly={!permission.canEditActionsBlock} />
                  <FormRadio label="Has Product been Isolated?" name="complaintActions.immediateActions.productIsolated" itemList={globalMasterData.optionList} readOnly={!permission.canEditActionsBlock} />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-x-10">
                <div className="col-span-3">
                  <FormTextArea label="Investigation and Findings" name="complaintActions.immediateActions.investigation" maxLength={1080} readOnly={!permission.canEditActionsBlock} />
                </div>
                <div className="col-span-1">
                  <FormRadio label="Is Issue Due to" name="complaintActions.immediateActions.issueDueTo" itemList={masterData.issueList} readOnly={!permission.canEditActionsBlock} />
                </div>
              </div>
            </Box>
            {/* Corrective Action */}
            <Box className="form-section-2x-grid-block w-full">
              <Heading size="3">Corrective Action</Heading>
              <div className="grid grid-cols-4 gap-x-10">
                <div className="col-span-3">
                  <FormTextArea label="Corrective Action Taken" name="complaintActions.correctiveActions.corrActionDesc" maxLength={1080} readOnly={!permission.canEditActionsBlock} />
                </div>
                <div className="col-span-1">
                  <FormInputAutoCompleteEdit label="Who" name="complaintActions.correctiveActions.corrActionBy" list={masterData.activeUsers.map((item) => item.name)} readOnly={!permission.canEditActionsBlock} maxLength={50} />
                  <FormDate label="When" name="complaintActions.correctiveActions.corrActionOnDate" dateFormat="dd-MMM-yyyy" returnType="string" maxDate={preventActionOnDate || new Date()} readOnly={!permission.canEditActionsBlock} minDate={immActionOnDate || receivedDate} />
                </div>
              </div>
            </Box>
            {/* Preventative Action */}
            <Box className="form-section-2x-grid-block w-full">
              <Heading size="3">Preventative Action</Heading>
              <div className="grid grid-cols-4 gap-x-10">
                <div className="col-span-3">
                  <FormTextArea label="Preventative Action Taken" name="complaintActions.preventativeActions.corrActionComplDesc" maxLength={1080} readOnly={!permission.canEditActionsBlock} />
                </div>
                <div className="col-span-1">
                  <FormInputAutoCompleteEdit label="Who" name="complaintActions.preventativeActions.preventActionBy" list={masterData.activeUsers.map((item) => item.name)} readOnly={!permission.canEditActionsBlock} maxLength={50} />
                  <FormDate label="When" name="complaintActions.preventativeActions.corrActionComplOnDate" dateFormat="dd-MMM-yyyy" returnType="string" maxDate={new Date()} readOnly={!permission.canEditActionsBlock} minDate={corrActionOnDate || immActionOnDate || receivedDate} />
                </div>
              </div>
            </Box>
            <Box className="form-section-2x-grid-block w-full">
              {/* <Heading size="3"></Heading> */}
              <div className="grid grid-cols-4 gap-x-10">
                <div className="col-span-4">
                  <FormRadio label="Has CPA taken fixed the issue" name="complaintActions.preventativeActions.corrActionFixIssue" itemList={globalMasterData.optionList} />
                </div>
                {corrActionFixIssue === 'N' && (
                  <div className="col-span-3">
                    <FormTextArea label="What Needs to be Done" name="complaintActions.preventativeActions.corrActionNeedToDo" maxLength={200} readOnly={!permission.canEditActionsBlock} />
                  </div>
                )}
              </div>
            </Box>
            <div className="w-full">
              <ResourceUploader groupId={2} dataType="CustomerFeedback" isReadOnly={!permission.canEditActionsBlock} currentFiles={customerFeedbackApiData.complaintResource} getFileContent={getCustomerFileContent} handleDelete={handleDeleteFile} />
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
            <Box className="icon-block bg-orange-100 p-2 rounded-full">
              <ClipboardList className="text-orange-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-700">
                Update Performed Actions
              </Heading>
              <p className="text-sm text-gray-500">Click the button to update the Performed Actions.</p>
            </Box>
          </Flex>
          <Button size="2" variant="outline" type="button" className="border-gray-300 text-gray-700 hover:bg-gray-100" onClick={() => handleView(true)} disabled={isReadOnly}>
            Update
          </Button>
        </Flex>
      </Box>
    );
  }
};

export default CustomerFeedbackActionsBlock;
