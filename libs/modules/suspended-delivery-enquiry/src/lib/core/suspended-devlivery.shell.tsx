import { Route, Routes } from 'react-router-dom';
import { SuspendedDeliveryLayout } from '.';
import { SuspendedDeliveryPage } from '../pages';

export const SuspendedDelivery = () => {
  return (
    <Routes>
      <Route element={<SuspendedDeliveryLayout />}>
        <Route index element={<SuspendedDeliveryPage />} />
      </Route>
    </Routes>
  );
};
