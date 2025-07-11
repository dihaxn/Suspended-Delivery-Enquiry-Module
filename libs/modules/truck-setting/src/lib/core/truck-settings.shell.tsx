import { Route, Routes } from 'react-router-dom';
import { TruckSettingsLayout } from './truck-settings.layout';
import { TruckSettingsPage, TruckSettingFormPage } from '../pages';

export const TruckSettingsShell = () => {
    return (
        <Routes>
            <Route element={<TruckSettingsLayout />}>
                <Route index element={<TruckSettingsPage />} />
                <Route path=":id" element={<TruckSettingFormPage />} />
                <Route path="new" element={<TruckSettingFormPage />} />
            </Route>
        </Routes>
    );
}; 
