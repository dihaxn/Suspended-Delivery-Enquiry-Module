import { AuthProvider, LoginPage, PrivateRouteValidator, useAuthContext, AuthPage } from '@cookers/auth';
import { IncidentManagementShell } from '@cookers/modules/incident-management';
import { CustomerFeedbackShell } from '@cookers/modules/customer-feedback';
import { SupplierNCRShell } from '@cookers/modules/supplier-ncr';
import { SystemImprovements } from '@cookers/modules/system-improvements';
import { TruckSettingsShell } from '@cookers/modules/truck-setting';
import { AppStateProvider, ReactQueryProvider } from '@cookers/providers';
import { Theme } from '@radix-ui/themes';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { OperationsAppLayout } from './operations-app.layout';
import { configStore, store } from '@cookers/store';
import { NavigationBlockProvider } from '@cookers/modules/common';
import { CarrierMasterShell } from '@cookers/modules/carrier-master';
import { SalesOrderShell } from '@cookers/modules/sales-order';
import { InvoicesShell } from '@cookers/modules/invoices';
import { SuspendedDelivery } from '@cookers/modules/suspended-delivery-enquiry';
export function OperationsAppShell() {
  return (
    <Theme>
      <BrowserRouter
        basename={`${configStore.hostName}`}
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        <Provider store={store}>
          <NavigationBlockProvider>
            <ReactQueryProvider>
              <AuthProvider>
                <AppStateProvider>
                  <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route element={<PrivateRouteValidator />}>
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/operations" element={<OperationsAppLayout />}>
                        <Route path="system-improvements" element={<SystemImprovements />} />
                        <Route path="incident-management/*" element={<IncidentManagementShell />} />
                        <Route path="truck-settings/*" element={<TruckSettingsShell />} />
                        <Route path="customer-feedback/*" element={<CustomerFeedbackShell />} />
                        <Route path="supplier-ncr/*" element={<SupplierNCRShell />} />
                        <Route path="carrier-master/*" element={<CarrierMasterShell />} />
                        <Route path="sales-order/*" element={<SalesOrderShell />} />
                        <Route path="invoices/*" element={<InvoicesShell />} />
                        <Route path="suspended-delivery/*" element={<SuspendedDelivery />} />
                      </Route>
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppStateProvider>
              </AuthProvider>
            </ReactQueryProvider>
          </NavigationBlockProvider>
        </Provider>
      </BrowserRouter>
    </Theme>
  );
}

export function NotFound() {
  return <div>NotFound</div>;
}

export function LogOutComponent() {
  const { handleLogout } = useAuthContext();
  return <button onClick={handleLogout}>Logout</button>;
}
