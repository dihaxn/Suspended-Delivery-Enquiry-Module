import { ResourceUploader } from '@cookers/modules/shared';
import { removeSupplierNcrResource, setDetailBlockReadOnly, setSupplierNcrPendingUploadDocuments, STORE, useStoreSelector } from '@cookers/store';
import { FormDate, FormInput, FormInputAutoComplete, FormInputAutoCompleteVirtualized, FormSelect, FormTextArea } from '@cookers/ui';
import { Box, Flex, Heading, IconButton } from '@radix-ui/themes';
import { Pencil, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { SupplierNcrResponseDocuments } from './supplier-ncr-response-document';
import { useDispatch } from 'react-redux';
import { PinBottomIcon } from '@radix-ui/react-icons';
import { downloadSupplierNcrReport } from '../../queries/use-supplier-ncr-pdf';
import { convertBase64ToBlob, getUserFromLocalStorage } from '@cookers/utils';
import { getFileContent } from '../../queries/get-supplier-ncr-file-query';



export const SupplierNcrDetailsBlock = () => {
  const dispatch = useDispatch();
  const { masterData, selectedSupplierNcrId, selectedSupplierNcrFormApiData, isDetailsBlockReadOnly } = useStoreSelector(STORE.SupplierNcr);
  const [isReadOnly, setBlockReadOnly] = useState(true);

  const { control } = useFormContext();
const raiseBy = useWatch({ control: control, name: 'supplierNcrRequest.raisedBy' });
const isReadOnlyUser = masterData.permissionLevel.readOnly;

  

  const updateRequestContent = () => {
    // dispatch(setDetailBlockReadOnly(!isReadOnly));
    setBlockReadOnly(!isReadOnly);
  };

  useEffect(() => {
    selectedSupplierNcrId ? setBlockReadOnly(true) : setBlockReadOnly(false);
  }, [selectedSupplierNcrId]);

  const handleDeleteFile = (documentId: number) => {
    dispatch(removeSupplierNcrResource(documentId));
  };

  useEffect(()=>{
    if(selectedSupplierNcrId > 0 && !isDetailsBlockReadOnly && selectedSupplierNcrFormApiData?.supplierNcrRequest?.status !== 'C'){
      setBlockReadOnly(false);
    }
    if(selectedSupplierNcrFormApiData?.supplierNcrRequest?.status === 'RR' &&  !masterData.showUpdateNCRWithSuppResponse){
      setBlockReadOnly(true);
    }else if(selectedSupplierNcrFormApiData?.supplierNcrRequest?.status !== 'C' && selectedSupplierNcrFormApiData?.supplierNcrRequest?.status !== 'RC'){
      setBlockReadOnly(masterData.permissionLevel.readOnly && selectedSupplierNcrFormApiData.supplierNcrRequest?.raisedBy?.value !== getUserFromLocalStorage()?.originator && selectedSupplierNcrFormApiData.supplierNcrRequest?.status ? true : false)
    }else{
      setBlockReadOnly(true);
    }
  },[isDetailsBlockReadOnly, selectedSupplierNcrFormApiData?.supplierNcrRequest?.status, selectedSupplierNcrId])

  return (
    <div className="form-section-block">
      <Box className="form-section-header">
        <Flex justify="between" align="center" gap="6">
          {/* {selectedSupplierNcrId > 0 ? selectedSupplierNcrFormApiData?.supplierNcrRequest?.refCode : ''} // SHowing Log No. */}
          <Heading>NCR Details</Heading>
          <Flex align="end" gap="2">
            {/* {selectedSupplierNcrId > 0 && !isDetailsBlockReadOnly && selectedSupplierNcrFormApiData?.supplierNcrRequest?.status !== 'C' && (
              <IconButton className="cursor-pointer" variant="soft" color="amber" radius="full" type="button" onClick={updateRequestContent}>
                {isReadOnly ? <Pencil width="18" height="18" /> : <X width="18" height="18" />}
              </IconButton>
            )} */}
          </Flex>
        </Flex>
        <Flex align="end" gap="2">
          <small></small>
        </Flex>
      </Box>

      <Flex wrap="wrap" className="form-section-grid !flex-row">
        <Flex className="w-full" gap="0" direction="row" wrap='wrap'>
          <Box className="form-section-2x-grid-block w-1/2">
            <Heading size="3">Requester Details</Heading>
            <div className="w-full flex flex-row gap-10">
              <div className="w-1/2">
                {selectedSupplierNcrFormApiData?.supplierNcrRequest?.status !== 'C' ? (
                  <FormInputAutoComplete
                    label="Person Raised"
                    placeHolder="Enter name"
                    name="supplierNcrRequest.raisedBy"
                    list={masterData.personRaisedList.map((item) => ({
                      label: item.name, // Set the display label
                      value: item.originator, // Choose the unique identifier (userGroupId)
                    }))}
                    //onItemSelect={handleItemSelect}
                    readOnly={isReadOnly || isReadOnlyUser}
                  />
                ) : (
                  <FormInput label="Person Raised" name="raisedByName" readOnly={true} />
                )}
              </div>
              <div className="w-1/2">
                <FormSelect label="Depot" name="supplierNcrRequest.depotCode" data={masterData.depotList} readOnly={isReadOnly} />
              </div>
            </div>
          </Box>
          <Box className="form-section-2x-grid-block w-1/2">
            <Heading size="3">NCR Details</Heading>
            <div className="w-full flex flex-row gap-10">
              <div className="w-1/2">
                <FormDate label="Date NCR Received" name="supplierNcrRequest.receivedDate" dateFormat="dd-MMM-yyyy" returnType="string" readOnly={isReadOnly} maxDate={new Date()} />
              </div>
              <div className="w-1/2">
                <FormSelect label="Classification" name="supplierNcrRequest.classification" data={masterData.classificationList} readOnly={isReadOnly} />
              </div>
            </div>
            <FormTextArea label="Reason for Non-Conformance" name="supplierNcrRequest.reason" readOnly={isReadOnly} maxLength={1056} />
          </Box>
          <Box className="form-section-2x-grid-block !w-1/2">
            <Heading className="!mt-4" size="3">
              Supplier Details
            </Heading>
            <FormInputAutoCompleteVirtualized name="supplierNcrRequest.supplierCode" label="Supplier" readOnly={isReadOnly} options={masterData.suppliersList.map((item) => ({ label: item.description, value: item.supplierCode }))} />
            <FormInputAutoCompleteVirtualized
              label="Product"
              name="supplierNcrRequest.catalogCode"
              readOnly={isReadOnly}
              options={masterData.catalogList.map((item) => ({
                label: item.displayDescription,
                value: item.catlogCode,
                other: item.partNumber,
              }))}
            />
            <div className="w-full flex flex-row gap-10">
              <div className="w-1/2">
                <FormInput label="Batch Number" name="supplierNcrRequest.batchNo" readOnly={isReadOnly} maxLength={40} />
              </div>
              <div className="w-1/2">
                <FormInput label="Invoice Number" name="supplierNcrRequest.invoiceNo" readOnly={isReadOnly} maxLength={40} />
              </div>
            </div>
            <div className="w-full flex flex-row gap-10">
              <div className="w-1/2">
                <FormDate label="Date of Manufacturing" name="supplierNcrRequest.dateOfMan" dateFormat="dd-MMM-yyyy" returnType="string" readOnly={isReadOnly} maxDate={new Date()} />
              </div>
              <div className="w-1/2"></div>
            </div>
          </Box>
          <Box className="form-section-2x-grid-block w-1/2">
            <Heading className="!mt-4" size="3">
              Immediate Action
            </Heading>
            <FormTextArea label="Immediate Action Required" name="supplierNcrRequest.immActionDesc" readOnly={isReadOnly} maxLength={1080} />
          </Box>
          
        </Flex>
      </Flex>
      <ResourceUploader currentFiles={selectedSupplierNcrFormApiData.supplierNcrResource} isReadOnly={isReadOnly} onFileSelect={setSupplierNcrPendingUploadDocuments} groupId={0} dataType="SupplierNcr" getFileContent={getFileContent} handleDelete={handleDeleteFile} />
      {/* <Flex className="p-4 w-full" align="end" justify="end" gap="4">
        <SupplierNcrResponseDocuments stepId={0} readonly={isReadOnly} />
      </Flex> */}
    </div>
  );
};
