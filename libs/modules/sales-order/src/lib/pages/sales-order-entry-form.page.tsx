import { SpinnerProvider } from '@cookers/providers';
import { setDetailBlockReadOnly, setSelectedSalesOrderId, STORE, useStoreSelector } from '@cookers/store';
import { FormSpinner } from '@cookers/ui';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SalesOrderEntryForm } from '../components/sales-order-entry/sales-order-entry-form';

export const SalesOrderEntryFormPage = () => {
  const { id } = useParams<{ id?: string }>();
  const { no } = useParams<{ no?: string }>();
  const { selectedSalesOrderId } = useStoreSelector(STORE.SalesOrder);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id && selectedSalesOrderId !== Number(id)) {
      dispatch(setSelectedSalesOrderId(id));
      dispatch(setDetailBlockReadOnly(true));
    } else if (id === undefined && selectedSalesOrderId !== undefined) {
      dispatch(setSelectedSalesOrderId(0));
      dispatch(setDetailBlockReadOnly(false));
    }

    console.log('1111111', id, selectedSalesOrderId);

    return () => {
      if (selectedSalesOrderId > 0) {
        dispatch(setSelectedSalesOrderId(undefined));
      }
    };
  }, [id,no, selectedSalesOrderId, dispatch]);

  return (
    <SpinnerProvider>
      <FormSpinner />
      <SalesOrderEntryForm />
    </SpinnerProvider>
  );
};