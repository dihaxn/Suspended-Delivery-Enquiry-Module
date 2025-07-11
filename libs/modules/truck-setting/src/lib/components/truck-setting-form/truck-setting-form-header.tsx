import { useNavigationBlock } from '@cookers/modules/common';
import { RootState, setProxyReadOnlyFlag, useStoreSelector, STORE, configStore } from '@cookers/store';
import { Flex } from '@cookers/ui';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { Button, Heading, Badge } from '@radix-ui/themes';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
export const TruckSettingFormHeader = () => {
  const navigate = useNavigate();
  const {  control } = useFormContext();
  const { isDirty  } = useFormState();
  const { isBlocked, setBlocked, handleNavigation } = useNavigationBlock();
  const { selectedTruckSettingId } = useStoreSelector(STORE.TruckSettings);
  const createdDate = useWatch({ control: control, name: 'createdDate' });
  const createdBy = useWatch({ control: control, name: 'createdBy' });
  const OpenRedirect = () => {  
    if (isDirty) {
      handleNavigation(`/${configStore.appName}/truck-settings`);
    } else {
      navigate(`/${configStore.appName}/truck-settings`); // Redirect directly
    }
  };

  return (
    <Flex gap="6" wrap="wrap" align="center" style={{ backgroundColor: '#fff', padding: '1rem' }}>
      <Button type="button" size="3" color="gray" variant="ghost" onClick={OpenRedirect} highContrast>
        <ArrowLeftIcon width="18" height="18" /> Back
      </Button>
      <Flex align="center" gap="2">
        <Heading size="2">
          {createdDate && (
            <span className="mx-2">
              <span className="opacity-85 font-thin">Created Date: </span> {createdDate}
            </span>
          )}
          {createdDate && <span className="text-lg opacity-65 font-extralight">|</span>}
          <span className="mx-2 ">
            <span className="opacity-85 font-thin">Setting Id: </span> <Badge variant="soft">{selectedTruckSettingId}</Badge>
          </span>
        </Heading>
      </Flex>
    </Flex>
  );
};
