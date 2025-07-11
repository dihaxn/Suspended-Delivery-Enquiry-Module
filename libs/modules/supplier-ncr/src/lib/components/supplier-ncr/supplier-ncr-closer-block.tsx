import { ResourceUploader } from '@cookers/modules/shared';
import { removeSupplierNcrResource, setSupplierNcrPendingUploadDocuments, STORE, useStoreSelector } from '@cookers/store';
import { Button, FormDate, FormInput, FormRadio, FormTextArea } from '@cookers/ui';
import { Box, Flex, Heading, IconButton } from '@radix-ui/themes';
import { BookOpenCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { SupplierNcrFormSchemaApiType } from '../../schema';
import { getFileContent } from '../../queries/get-supplier-ncr-file-query';
import { useDispatch } from 'react-redux';

export const SupplierNcrCloserBlock = () => {
  const { selectedSupplierNcrFormApiData, selectedSupplierNcrId, isCloseOutBlockReadOnly, isReadyForCompletionSectionReadOnly, isCloseOutSectionReadOnly } = useStoreSelector(STORE.SupplierNcr);
  const dispatch = useDispatch();
  const { globalMasterData } = useStoreSelector(STORE.GlobalMaster);
  const data: SupplierNcrFormSchemaApiType = selectedSupplierNcrFormApiData;
  const [showEntryBlock, setShowEntryBlock] = useState(false);
  const { formState, getValues, setValue } = useFormContext();

  const { control } = useFormContext();

  const responsesLength = data.supplierNcrMessage?.length || 0;
  const handleDeleteFile = (documentId: number) => {
    dispatch(removeSupplierNcrResource(documentId));
  };
  const [futherAction, status] = useWatch({
    control,
    name: ['supplierNcrCloseOut.anyFurtherAction', 'supplierNcrRequest.status'],
  });

  const [isFutherAction, setIsFutherAction] = useState(futherAction === 'Y');
  const [isFutherActionVisible, setIsFutherActionVisible] = useState(status === 'RC' || status === 'C');
  const isNew = status === '';

  useEffect(() => {
    const _status = selectedSupplierNcrFormApiData?.supplierNcrRequest?.status;
    setShowEntryBlock(!!(_status === 'RC' || _status === 'C'));
    if (_status === 'RC' || _status === 'C') {
      setIsFutherAction(true);
      setIsFutherActionVisible(true);
    }
  }, [selectedSupplierNcrFormApiData?.supplierNcrRequest?.status]);

  useEffect(() => {
    if (futherAction !== 'N') {
      setIsFutherAction(true);
    } else {
      setIsFutherAction(false);
      setValue('supplierNcrCloseOut.closeOutComm', '');
      setValue('supplierNcrCloseOut.closeOutCommOn', '');
      if (formState.errors?.supplierNcrCloseOut) {
      if ('closeOutComm' in formState.errors.supplierNcrCloseOut) {
        formState.errors.supplierNcrCloseOut.closeOutComm = undefined;
      }
      if ('closeOutCommOn' in formState.errors.supplierNcrCloseOut) {
        formState.errors.supplierNcrCloseOut.closeOutCommOn = undefined;
      }
      }
    }
    formState.errors?.supplierNcrCloseOut && 'closeOutComm' in formState.errors.supplierNcrCloseOut && setValue('supplierNcrCloseOut.closeOutComm', '');
  }, [futherAction]);

  const handleAddResponse = () => {
    // append();
    setShowEntryBlock(true);
  };

  const handleCancelResponse = () => {
    // if (fields.length > 0) {
    //   const currentValues = getValues('supplierNcrMessage');
    //   const lastIndex = currentValues.length - 1;
    //   remove(lastIndex); // Remove the last added field using its index
    // }
    setShowEntryBlock(false);
  };
  console.log('close', isFutherAction, isCloseOutSectionReadOnly);
  return (
    <div className="form-section-block">
      {!showEntryBlock && <AddNewResponseBlock handleEvent={handleAddResponse} isReadOnly={isCloseOutBlockReadOnly} />}

      {showEntryBlock && (
        <>
          <Box className="form-section-header">
            <Flex justify="between" align="center" gap="6">
              <Heading>Close Out</Heading>
              <Flex align="end" gap="2">
                {selectedSupplierNcrFormApiData?.supplierNcrRequest?.status !== 'C' && selectedSupplierNcrFormApiData?.supplierNcrRequest?.status !== 'RC' && (
                  <IconButton variant="soft" className="cursor-pointer" color="amber" radius="full" type="button" onClick={handleCancelResponse}>
                    <X width="18" height="18" />
                  </IconButton>
                )}
              </Flex>
            </Flex>
            <Flex align="end" gap="2">
              <small></small>
            </Flex>
          </Box>
          <Flex gap="1" wrap="wrap" className="form-section-grid">
            <Box className="form-section-2x-grid-block">
              <Heading size="3">Investigation Details</Heading>

              <FormTextArea label="Investigation/Root Cause Analysis" name={`supplierNcrCloseOut.rootCause`} readOnly={isReadyForCompletionSectionReadOnly} maxLength={1040} />
              <FormTextArea label="Corrective Action" name={`supplierNcrCloseOut.corrActionDesc`} readOnly={isReadyForCompletionSectionReadOnly} maxLength={1040} />
              <FormTextArea label="Preventive Action" name={`supplierNcrCloseOut.preventiveAction`} readOnly={isReadyForCompletionSectionReadOnly} maxLength={1040} />
            </Box>
            <Box className="form-section-grid-block">
              <Heading size="3">Provided By</Heading>

              <FormInput label="Supplier Contact" name={`supplierNcrCloseOut.suppRespBy`} readOnly={isReadyForCompletionSectionReadOnly} maxLength={40} />
              <FormInput label="Contact Title" name={`supplierNcrCloseOut.suppRespTitle`} readOnly={isReadyForCompletionSectionReadOnly} maxLength={40} />
              <FormDate label="Date" name={`supplierNcrCloseOut.suppRespOn`} dateFormat="dd-MMM-yyyy" returnType="string" readOnly={isReadyForCompletionSectionReadOnly} minDate={getValues('supplierNcrRequest.receivedDate')} maxDate={new Date()} />
            </Box>
            <Box className="form-section-grid-block">
              <Heading size="3">Ready For Completion</Heading>

              <FormInput label="By Whom" name={`supplierNcrCloseOut.readyForCompletionBy`} readOnly={true} />
              <FormDate label="By When" name={`supplierNcrCloseOut.readyForCompletionOn`} dateFormat="dd-MMM-yyyy" returnType="string" readOnly={true} />
            </Box>
          </Flex>
          <ResourceUploader isReadOnly={isCloseOutSectionReadOnly && isReadyForCompletionSectionReadOnly} currentFiles={selectedSupplierNcrFormApiData.supplierNcrResource} onFileSelect={setSupplierNcrPendingUploadDocuments} groupId={1000} dataType="SupplierNcr" handleDelete={handleDeleteFile} getFileContent={getFileContent} />
          {isFutherActionVisible && (
            <Flex gap="1" wrap="wrap" className="form-section-grid">
              <Box className="form-section-2x-grid-block">
                <Heading size="3">Further Action</Heading>
                <FormRadio label="Any Further Actions?" name={`supplierNcrCloseOut.anyFurtherAction`} itemList={globalMasterData.optionList} readOnly={isCloseOutSectionReadOnly} />
                {isFutherAction && <>
                <FormTextArea label="Further Action" name={`supplierNcrCloseOut.closeOutComm`} readOnly={!isFutherAction || isCloseOutSectionReadOnly} maxLength={1080} />
                <Box width="230px">
                  <FormDate label="By When" name={`supplierNcrCloseOut.closeOutCommOn`} dateFormat="dd-MMM-yyyy" returnType="string" readOnly={!isFutherAction || isCloseOutSectionReadOnly} minDate={getValues('supplierNcrRequest.receivedDate')} maxDate={new Date()} />
                </Box>
                </>}
              </Box>
              <Box className="form-section-grid-block">
                <Heading size="3">Closed By</Heading>
                <FormInput label="By Whom" name={`supplierNcrCloseOut.closeOutBy`} readOnly={true} />
                <FormInput label="Title" name="supplierNcrCloseOut.closeOutTitle" readOnly={true} maxLength={40} />
                <FormDate label="By When" name={`supplierNcrCloseOut.closeOutOn`} dateFormat="dd-MMM-yyyy" returnType="string" readOnly={true} />
              </Box>
            </Flex>
          )}
        </>
      )}
    </div>
  );
};

const AddNewResponseBlock: React.FC<{ handleEvent: () => void; isReadOnly: boolean }> = ({ handleEvent, isReadOnly }) => {
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
              Close Out this NCR
            </Heading>
            <p className="text-sm text-gray-500">Click the button to Close out the NCR.</p>
          </Box>
        </Flex>

        {/* Right: Button */}
        <Button size="2" variant="outline" type="button" className="border-gray-300 text-gray-700 hover:bg-gray-100" onClick={handleEvent} disabled={isReadOnly}>
          Close Out
        </Button>
      </Flex>
    </Box>
  );
};
