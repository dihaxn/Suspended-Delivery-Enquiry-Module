import { SpinnerProvider } from '@cookers/providers';
import {   STORE, useStoreSelector, setSelectedCarrierCode } from '@cookers/store';
import { FormSpinner } from '@cookers/ui';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {CarrierEntryForm} from '../components/carrier-entry/carrier-entry-form';

export const CarrierEntryFormPage = () => {
  const { code } = useParams<{ code?: string }>();
  const { selectedCarrierCode } = useStoreSelector(STORE.CarrierMaster);
  const dispatch = useDispatch();

 useEffect(() => {
  const newCode = code || '';
  if (selectedCarrierCode !== newCode) {
    dispatch(setSelectedCarrierCode(newCode));
  }

  return () => {
    if (selectedCarrierCode) {
      dispatch(setSelectedCarrierCode(undefined));
    }
  };
}, [code, dispatch, selectedCarrierCode]);


  return (
    <SpinnerProvider>
      <FormSpinner />
      <CarrierEntryForm /> 
    </SpinnerProvider>
  );
};
