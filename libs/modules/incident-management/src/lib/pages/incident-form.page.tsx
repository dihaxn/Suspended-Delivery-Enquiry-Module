import { IncidentForm } from '../components';
import { FormSpinner} from '@cookers/ui';
import { SpinnerProvider } from "@cookers/providers";
export const IncidentFormPage = () => {
  return (
    <SpinnerProvider>
      <FormSpinner />
      <IncidentForm />
    </SpinnerProvider>
  );
};
