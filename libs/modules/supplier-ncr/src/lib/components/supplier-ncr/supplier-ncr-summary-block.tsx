import { STORE, useStoreSelector } from '@cookers/store';
import { FormButton } from '@cookers/ui';
import { useFormContext } from 'react-hook-form';

export const SupplierNcrSummaryBlock = () => {
  const { pendingUploadDocuments } = useStoreSelector(STORE.SupplierNcr);
  const { formState, getValues } = useFormContext();

  //const supplierNcrFormId = getValues('supplierNcrId');

  console.log('GGGG', formState, getValues());

  return (
    <div className="w-[300px] overflow-auto" style={{ maxWidth: '400px' }}>
      <FormButton label="Submit" name="Submit" size="2" type="submit" />

      {/* <pre>{JSON.stringify(formState, null, 2)}</pre> */}
      {/* <div>Form Values</div>*/}
      {/* <pre>{JSON.stringify(getValues(), null, 2)}</pre> */}
    </div>
  );
};
