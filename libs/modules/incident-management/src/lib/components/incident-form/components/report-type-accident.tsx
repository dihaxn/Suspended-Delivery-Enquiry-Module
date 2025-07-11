import { RootState } from '@cookers/store';
import { FormInput, FormRadio, FormTextArea } from '@cookers/ui';
import { Box, Flex, Heading, Text } from '@radix-ui/themes';
import { useFormContext, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useIncidentReadOnly  } from '../../../provider/read-only-incident-provider';
export const ReportTypeAccident = () => {
  const { masterData } = useSelector((state: RootState) => state.incidentManagement);
    const { globalMasterData } = useSelector((state: RootState) => state.globalMaster);
  const { control } = useFormContext();
  const { eventReadOnly } = useIncidentReadOnly();
  const othVehicleInvolve = useWatch({ control: control, name: 'othVehicleInvolve' });
  const isOtherVehicle = othVehicleInvolve === 'Y';
  return (
    <div style={{ backgroundColor: '#fef8f2' }}>
       <Flex gap="4" wrap="wrap" className="incident-section-grid">
        
        <Box className="incident-section-grid-block">
          <Heading size="3">Accident Details</Heading>
         
          <FormRadio label="Is another vehicle involved in the accident?" name="othVehicleInvolve" itemList={globalMasterData.optionList} readOnly={eventReadOnly}/>
          <Text color="red" size="1" weight="bold">
            Driver Must Complete OHSFORM-020 Vehicle Accident Detail Report & supervisor must scan and add to the report
          </Text>
        </Box>
      </Flex> 
      {isOtherVehicle && (
        <Flex gap="4" wrap="wrap" className="incident-section-grid">
          <Box className="incident-section-grid-block">
            <Heading size="3">Other Vehicle Details</Heading>
            <FormInput label="Driver" name="othDriver"  readOnly={eventReadOnly} maxLength={50}/>
            <FormInput label="Licence No. & Details" name="othDriverLicence"  readOnly={eventReadOnly} maxLength={50}/>
            <FormInput label="Driver Contact Details" name="othDriverContact" readOnly={eventReadOnly} maxLength={14}/>
            <FormInput label="Vehicle Rego No. & Details" name="othVehicle"  readOnly={eventReadOnly} maxLength={50}/>
          </Box>
          <Box className="incident-section-grid-block">
            <Heading size="3">Impact Details</Heading>
            <FormTextArea label="Driver Condition" desc="Including any injuries" name="othDriverCondi" size="s" readOnly={eventReadOnly} maxLength={1080}/>
            <FormTextArea label="Vehicle Condition" name="othVehicleCondi" size="s" readOnly={eventReadOnly} maxLength={1080}/>
          </Box>
          <Box className="incident-section-grid-block">
            <Heading size="3">Action Details</Heading>
            <FormTextArea label="Actions put in place" name="othActionTaken" size="s" readOnly={eventReadOnly} maxLength={1080}/>
          </Box>
        </Flex>
      )}
    </div>
  );
};
