import { Route, Routes } from 'react-router-dom';
import { SuspendedDeliveryLayout } from '.';
import { SuspendedDeliveryPage } from '../pages';
import { ToastProvider } from '@cookers/modules/shared';
import { configStore } from '@cookers/store';


export const SuspendedDelivery = () => {
  return (
    <ToastProvider actionUrl={`/${configStore.appName}/suspended-delivery`} actionLabel="Go to List">
      <Routes>
        <Route element={<SuspendedDeliveryLayout />}>
           <Route index element={<SuspendedDeliveryPage />} />
        </Route>
      </Routes>
    </ToastProvider>
    
  );
};
