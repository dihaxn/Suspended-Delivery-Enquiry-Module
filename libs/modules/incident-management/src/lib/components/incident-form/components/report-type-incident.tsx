import { RootState } from '@cookers/store';
import { FormDate, FormInput, FormRadio, FormTextArea } from '@cookers/ui';
import { Box, Flex, Heading } from '@radix-ui/themes';
import { useFormContext, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useIncidentReadOnly  } from '../../../provider/read-only-incident-provider';
export const ReportTypeIncident = () => {
  const { masterData } = useSelector((state: RootState) => state.incidentManagement);
  const { globalMasterData } = useSelector((state: RootState) => state.globalMaster);
  const { control } = useFormContext();
  const { eventReadOnly } = useIncidentReadOnly();

  const injuryInvolve = useWatch({ control: control, name: 'injuryInvolve' });
  const otherInvolve = useWatch({ control: control, name: 'whoInvolve' });
  
  
  
  const isInjuryInvolve = injuryInvolve === 'Y';
  const isOtherInvolve = otherInvolve === 'S';
  
  return (
    <div style={{ backgroundColor: '#fef8f2' }}>
      {/* <Box>
        <Heading size="3">Incident Report Type Details {incidentForm.reportType}</Heading>
        <small>To be completed by Supervisor/Manager and Employee</small> 
      </Box> */}

      <Flex gap="4" wrap="wrap" className="incident-section-grid">
       
        <Box className="incident-section-grid-block">
          <Heading size="3">Injury Details</Heading>
          <FormRadio label="Was anyone injured?" name="injuryInvolve" itemList={globalMasterData.optionList} readOnly={eventReadOnly}/>

          {isInjuryInvolve && <FormRadio label="Who is involved?" name="whoInvolve" itemList={masterData.injuredPersonList} readOnly={eventReadOnly}/>}
        </Box>

        {isOtherInvolve && (
          <Box className="incident-section-grid-block">
            <Heading size="3">Injured Person Details</Heading>
            <FormInput label="Name" name="involverName"  readOnly={eventReadOnly} maxLength={40}/>
            <FormInput label="Contact No" name="involverContact"  readOnly={eventReadOnly} maxLength={14}/>
            <FormInput label="Address" name="involverAddress"  readOnly={eventReadOnly} maxLength={100}/>

            <FormInput label="Email" name="involverEmail"  readOnly={eventReadOnly} maxLength={120}/>
          </Box>
        )}
      </Flex>
    </div>
  );
};
