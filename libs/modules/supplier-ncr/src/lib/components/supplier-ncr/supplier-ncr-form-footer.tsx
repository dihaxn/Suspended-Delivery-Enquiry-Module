import { STORE, useStoreSelector } from '@cookers/store';
import { Flex, FormButton } from '@cookers/ui';
import { getUserFromLocalStorage } from '@cookers/utils';
import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
export const SupplierNcrFormFooter = () => {
  const { setValue, handleSubmit, control } = useFormContext();
  const { isCloseButtonVisible, isReadyForcompletionButtonVisible, isSaveButtonVisible, masterData, selectedSupplierNcrFormApiData } = useStoreSelector(STORE.SupplierNcr);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [rootCause, corrActionDesc, preventiveAction, status] = useWatch({
    control,
    name: ['supplierNcrCloseOut.rootCause', 'supplierNcrCloseOut.corrActionDesc', 'supplierNcrCloseOut.preventiveAction', 'supplierNcrRequest.status', 'supplierNcrRequest.raisedBy'],
  });

  const isReadyForCompletion = !!rootCause?.trim() || !!corrActionDesc?.trim() || !!preventiveAction?.trim();
  const isStatusReadyForCompletion = status === 'RC';
  const isvisibleReadyForCompletion = status === 'RR' || status === 'R';

  useEffect(() => {
    if (selectedSupplierNcrFormApiData.supplierNcrRequest?.raisedBy?.value.length > 0) {
      if (masterData.permissionLevel.readOnly) {
        setIsButtonVisible(selectedSupplierNcrFormApiData.supplierNcrRequest?.raisedBy?.value === getUserFromLocalStorage()?.originator);
      } else {
        setIsButtonVisible(true);
      }
    }
  }, [masterData, selectedSupplierNcrFormApiData]);

  const onSubmit = (actionType: string) => {
    setValue('actionType', actionType);
    handleSubmit(() => {
      console.log(`Form Submitted with action: ${actionType}`);
    })();
  };
  return (
    <Flex gap="6" wrap="wrap" align="center" style={{ backgroundColor: '#fff', padding: '1rem', height: '90px' }}>
      {isSaveButtonVisible && !isReadyForCompletion && isButtonVisible && <FormButton label="Save Supplier NCR" name="Submit" size="2" type="submit" onClick={() => onSubmit('save')} />}
      {isReadyForCompletion && isReadyForcompletionButtonVisible && isButtonVisible && <FormButton label="Ready For Completion" name="ReadyForCompletion" size="2" type="submit" onClick={() => onSubmit('readyForCompletion')} />}
      {isStatusReadyForCompletion && isCloseButtonVisible && isButtonVisible && <FormButton label="Close Supplier NCR" name="Complete" size="2" type="submit" onClick={() => onSubmit('completed')} />}
    </Flex>
  );
};
