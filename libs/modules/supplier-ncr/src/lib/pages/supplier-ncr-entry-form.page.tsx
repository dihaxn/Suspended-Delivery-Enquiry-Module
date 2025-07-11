import { SpinnerProvider } from '@cookers/providers';
import { setDetailBlockReadOnly, setSelectedSupplierNcrId, STORE, useStoreSelector } from '@cookers/store';
import { FormSpinner } from '@cookers/ui';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import SupplierNcrEntryForm from '../components/supplier-ncr/supplier-ncr-entry-form';

export const SupplierNcrEntryFormPage = () => {
  const { id } = useParams<{ id?: string }>();
  const { selectedSupplierNcrId } = useStoreSelector(STORE.SupplierNcr);
  const dispatch = useDispatch();

  useEffect(() => {
    // if (id && Number(id) !== selectedSupplierNcrId && Number(id) > 0) {
    //   dispatch(setSelectedSupplierNcrId(id));
    // } else if ((id === undefined || isNaN(Number(id))) && selectedSupplierNcrId !== undefined) {
    //   dispatch(setSelectedSupplierNcrId(0));
    // }

    if (id && selectedSupplierNcrId !== Number(id)) {
      dispatch(setSelectedSupplierNcrId(id));
      dispatch(setDetailBlockReadOnly(true));
    } else if (id === undefined && selectedSupplierNcrId !== undefined) {
      dispatch(setSelectedSupplierNcrId(0));
      dispatch(setDetailBlockReadOnly(false));
    }

    console.log('1111111', id, selectedSupplierNcrId);

    return () => {
      if (selectedSupplierNcrId > 0) {
        dispatch(setSelectedSupplierNcrId(undefined));
      }
    };
  }, [id, selectedSupplierNcrId, dispatch]);

  return (
    <SpinnerProvider>
      <FormSpinner />
      <SupplierNcrEntryForm />
    </SpinnerProvider>
  );
};
