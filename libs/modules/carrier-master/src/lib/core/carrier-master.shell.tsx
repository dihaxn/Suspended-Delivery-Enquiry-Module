import { Route, Routes } from 'react-router-dom';
import { CarrierMasterLayout } from './carrier-master.layout';
import { CarrierEntryFormPage, CarrierMasterPage } from '../pages';

export const CarrierMasterShell = () => {
  return (
    <Routes>
      <Route element={<CarrierMasterLayout />}>
        <Route index element={<CarrierMasterPage />} />
        <Route path=":code" element={<CarrierEntryFormPage />} />
        <Route path="new" element={<CarrierEntryFormPage />} />
      </Route>
    </Routes>
  );
};
