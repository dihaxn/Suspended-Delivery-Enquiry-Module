import { STORE, useStoreSelector } from '@cookers/store';
import { Flex, FormButton } from '@cookers/ui';
import { getUserFromLocalStorage } from '@cookers/utils';
import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
export const CustomerFeedbackEntryFooter: React.FC = () => {
  const { setValue, handleSubmit, control } = useFormContext();
  const { masterData, permission } = useStoreSelector(STORE.CustomerFeedback);

  const onSubmit = (actionType: string) => {
    setValue('actionType', actionType);
    handleSubmit(() => {
      // console.log(`Form Submitted with action: ${actionType}`);
    })();
  };
  return (
    <Flex gap="6" wrap="wrap" align="center" style={{ backgroundColor: '#fff', padding: '1rem', height: '90px' }}>
      {permission.canSaveEntry && <FormButton label="Save Customer Feedback" name="Submit" size="2" type="submit" onClick={() => onSubmit('R')} />}
      {/* {permission.canInvestigateEntry && <FormButton label="Customer Feedback Investigated" name="Submit" size="2" type="submit" onClick={() => onSubmit('I')} />} */}
      {permission.canCloseEntry && <FormButton label="Close Customer Feedback" name="Complete" size="2" type="submit" onClick={() => onSubmit('C')} />}
    </Flex>
  );
};

export default CustomerFeedbackEntryFooter;