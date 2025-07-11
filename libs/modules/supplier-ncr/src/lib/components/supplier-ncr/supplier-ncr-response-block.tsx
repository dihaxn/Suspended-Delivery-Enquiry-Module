import { ResourceUploader } from '@cookers/modules/shared';
import { removeSupplierNcrResource, setSupplierNcrPendingUploadDocuments, STORE, useStoreSelector } from '@cookers/store';
import { Button, FormAutoCompleterReturnType, FormDate, FormInput, FormInputAutoComplete, FormTextArea } from '@cookers/ui';
import * as fa from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Flex, Heading, IconButton } from '@radix-ui/themes';
import { FileCode, FileText, MailPlus, X } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { SupplierNcrFormSchemaApiType } from '../../schema';
import { SupplierNcrResponseDocuments } from './supplier-ncr-response-document';
import { useDispatch } from 'react-redux';
import { getFileContent } from '../../queries/get-supplier-ncr-file-query';

export const SupplierNcrResponseBlock = () => {
  const { selectedSupplierNcrFormApiData, selectedSupplierNcrId, isResponseBlockReadOnly, masterData } = useStoreSelector(STORE.SupplierNcr);
  const dispatch = useDispatch();
  const data: SupplierNcrFormSchemaApiType = selectedSupplierNcrFormApiData;
  const [showEntryBlock, setShowEntryBlock] = useState(false);
  const { formState, getValues, setValue } = useFormContext();
  const [originator, setOriginator] = useState('');
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'supplierNcrMessage',
  });
  const [status] = useWatch({
    control,
    name: ['supplierNcrRequest.status'],
  });
  const responsesLength = data.supplierNcrMessage?.length || 0;
  const isNew = status === '';
  console.log('AA', fields, selectedSupplierNcrId, data.supplierNcrMessage);
  const handleDeleteFile = (documentId: number) => {
    dispatch(removeSupplierNcrResource(documentId));
  };
  const handleAddResponse = (responseOriginator: string) => {
    console.log('responseOriginator', responseOriginator);
    // const lastResponseBy = data.supplierNcrMessage?.[responsesLength - 1]?.responseOriginator || 'S';
    append({
      stepId: responsesLength + 1,
      createdBy: '',
      createdDate: '',
      lastModifiedBy: '',
      lastModifiedDate: '',
      responseId: 0,
      responseOriginator: responseOriginator,
    });
    setOriginator(responseOriginator);
    setShowEntryBlock(true);
  };

  const handleCancelResponse = () => {
    if (fields.length > 0) {
      const currentValues = getValues('supplierNcrMessage');
      const lastIndex = currentValues.length - 1;

      remove(lastIndex); // Remove the last added field using its index
    }

    setShowEntryBlock(false);
  };

  const handleItemSelect = async (value: FormAutoCompleterReturnType) => {
    const employeeName = value;
    const supplierObj = masterData.personRaisedList.filter((per) => per.name === employeeName)[0];
    setValue(
      `supplierNcrMessage[${responsesLength}].responseTitle`,
      supplierObj.occupation || '',
      { shouldValidate: true, shouldDirty: true }
    );
  };

  return (
    <div className="form-section-block">
      {fields && fields.length > 0 && (
        <Box className="form-section-header">
          <Flex justify="between" align="center" gap="6">
            <Heading>Responses</Heading>
            {showEntryBlock && (
              <Flex align="end" gap="2">
                <IconButton variant="soft" className="cursor-pointer" color="amber" radius="full" type="button" onClick={handleCancelResponse}>
                  <X width="18" height="18" />
                </IconButton>
              </Flex>
            )}
          </Flex>
          <Flex align="end" gap="2">
            <small></small>
          </Flex>
        </Box>
      )}

      {fields && <ResponseDisplayer responses={data.supplierNcrMessage} handleDeleteFile={handleDeleteFile} isResponseBlockReadOnly={isResponseBlockReadOnly} />}

      {!showEntryBlock && <AddNewResponseBlock handleEvent={handleAddResponse} isReadOnly={isResponseBlockReadOnly || isNew} />}

      {showEntryBlock && (
        <>
          <Flex gap="1" wrap="wrap" className="form-section-grid">
            <Box className="form-section-grid-block">
              <Heading size="3">Person Replied {}</Heading>

              {originator === 'S' ? (
                <FormInput label="Responded By" name={`supplierNcrMessage[${responsesLength}].responseBy`} maxLength={40} />
              ) : (
                <FormInputAutoComplete label="Responded By" placeHolder="Responded By" name={`supplierNcrMessage[${responsesLength}].responseBy`} list={masterData.personRaisedList.map((item) => item.name)} onItemSelect={handleItemSelect} />
              )}
              {originator === 'S' ? <FormInput label="Responder Title" name={`supplierNcrMessage[${responsesLength}].responseTitle`} maxLength={40} /> : <FormInput label="Responder Title" name={`supplierNcrMessage[${responsesLength}].responseTitle`} maxLength={40} readOnly={true} />}
              <FormDate label="Responded on" name={`supplierNcrMessage[${responsesLength}].responseDate`} dateFormat="dd-MMM-yyyy" returnType="string" minDate={getValues('supplierNcrRequest.receivedDate')} maxDate={new Date()} />
            </Box>
            <Box className="form-section-2x-grid-block">
              <Heading size="3">Response</Heading>

              <FormTextArea label="Response details" name={`supplierNcrMessage[${responsesLength}].responseDesc`} maxLength={1080} />
            </Box>
          </Flex>
          <ResourceUploader currentFiles={selectedSupplierNcrFormApiData.supplierNcrResource} onFileSelect={setSupplierNcrPendingUploadDocuments} groupId={responsesLength === 0 ? 1 : responsesLength + 1} dataType="SupplierNcr" getFileContent={getFileContent} />
          {/* <ResourceUploader
            dataType="SupplierNcr"
            onFileSelect={setSupplierNcrPendingUploadDocuments}
            groupId={responsesLength === 0 ? 1 : responsesLength + 1}
          /> */}
        </>
      )}
    </div>
  );
};

const AddNewResponseBlock: React.FC<{ handleEvent: (responseOriginator: string) => void; isReadOnly: boolean }> = ({ handleEvent, isReadOnly }) => {
  return (
    <Box className="p-4 border border-solid border-gray-200 rounded-lg shadow-sm bg-white">
      <Flex align="center" justify="between" gap="4">
        {/* Left: Icon and Text Block */}
        <Flex align="center" gap="3">
          <Box className="icon-block bg-orange-100 p-2 rounded-full">
            <MailPlus className="text-orange-400" />
          </Box>
          <Box>
            <Heading size="4" className="text-gray-700">
              Add your Responses
            </Heading>
            <p className="text-sm text-gray-500">Add your responses </p>
          </Box>
        </Flex>
        <Flex justify="center" gap="4" align="center">
          <Button size="2" variant="outline" type="button" className="border-gray-300 text-gray-700 hover:bg-gray-100" onClick={() => handleEvent('S')} disabled={isReadOnly}>
            Supplier Response
          </Button>
          <Button size="2" variant="outline" type="button" className="border-gray-300 text-gray-700 hover:bg-gray-100" onClick={() => handleEvent('C')} disabled={isReadOnly}>
            Cookers Response
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

const ResponseDisplayer: React.FC<{ responses: SupplierNcrFormSchemaApiType['supplierNcrMessage']; handleDeleteFile: (documentId: number) => void; isResponseBlockReadOnly:boolean }> = ({ responses, handleDeleteFile, isResponseBlockReadOnly }) => {
  const { selectedSupplierNcrFormApiData } = useStoreSelector(STORE.SupplierNcr);
  return (
    <div className={responses && responses.length > 0 ? 'divide-y divide-gray-200 ' : ''}>
      {responses?.map((item) => (
        <div key={item.stepId} className="flex flex-col bg-white">
          <div className="flex items-start gap-4 p-4">
            {/* Circle with responseOriginator */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold">{item.responseOriginator}</div>

            {/* Response Description */}
            <div className="flex-1">
              <p className="text-gray-800">{item.responseDesc}</p>

              {/* Title, Responded By, and Date */}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>{item.responseBy}</span>
                <span>|</span>
                <span>{item.responseTitle}</span>
                <span>|</span>
                <span>{item.responseDate}</span>
                {/* <div className="ml-auto">
                  <SupplierNcrResponseDocuments stepId={item.stepId} />
                  </div> */}
              </div>
            </div>
          </div>
          <ResourceUploader hideFileUploader currentFiles={selectedSupplierNcrFormApiData.supplierNcrResource} onFileSelect={setSupplierNcrPendingUploadDocuments} groupId={item.stepId} dataType="SupplierNcr" handleDelete={handleDeleteFile} getFileContent={getFileContent} isReadOnly={isResponseBlockReadOnly} />
        </div>
      ))}
    </div>
  );
};
