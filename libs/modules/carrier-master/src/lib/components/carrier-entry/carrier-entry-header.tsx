import { Flex } from '@cookers/ui';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { Button, Heading, } from '@radix-ui/themes';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import {  configStore } from '@cookers/store';
import { useNavigate } from 'react-router-dom';
import { useNavigationBlock } from '@cookers/modules/common';
export function CarrierEntryHeader() {
  const navigate = useNavigate();
  const {  handleNavigation } = useNavigationBlock();
   const {  control } = useFormContext();
   const createdDate = useWatch({ control: control, name: 'createdDateString' });
  const { isDirty  } = useFormState();
   
    const OpenRedirect = () => {
     
    if (isDirty) {
      handleNavigation(`/${configStore.appName}/carrier-master`);
    } else {
      navigate(`/${configStore.appName}/carrier-master`); // Redirect directly
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
         
          
         
           
         
        </Heading> 
       
      </Flex>
      
    </Flex>
  );
}

export default CarrierEntryHeader;