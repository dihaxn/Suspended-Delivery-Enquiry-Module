//import { TruckSettingForm } from '../components';
import { FormSpinner } from '@cookers/ui';
import { SpinnerProvider } from '@cookers/providers';
//import {TruckSettingDetails } from '../components/truck-setting-form/components/truck-settings-details';
import { TruckSettingForm } from '../components/truck-setting-form/truck-setting-entry-form';
import { useParams } from 'react-router-dom';
import { setSelectedTruckSettingId, STORE, useStoreSelector } from '@cookers/store';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
//import {TruckSettingForm} from '../components';
export const TruckSettingFormPage = () => {
  const { id } = useParams<{ id?: string }>();
  const { selectedTruckSettingId } = useStoreSelector(STORE.TruckSettings);
  const dispatch = useDispatch();
  useEffect(() => {
    // if (id && Number(id) !== selectedSupplierNcrId && Number(id) > 0) {
    //   dispatch(setSelectedSupplierNcrId(id));
    // } else if ((id === undefined || isNaN(Number(id))) && selectedSupplierNcrId !== undefined) {
    //   dispatch(setSelectedSupplierNcrId(0));
    // }

    if (id && selectedTruckSettingId !== Number(id)) {
      dispatch(setSelectedTruckSettingId(id));
    } else if (id === undefined && selectedTruckSettingId !== undefined) {
      dispatch(setSelectedTruckSettingId(0));
    }

    return () => {
      if (selectedTruckSettingId > 0) {
        dispatch(setSelectedTruckSettingId(undefined));
      }
    };
  }, [id, selectedTruckSettingId, dispatch]);

  return (
    <SpinnerProvider>
      <FormSpinner />
      <TruckSettingForm />
    </SpinnerProvider>
  );
};
