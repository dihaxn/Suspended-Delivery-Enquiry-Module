import {useState,useEffect} from 'react';
import { Flex, Text, Box } from '@radix-ui/themes';
import { FormInput, FormRadio, FormDate,FormTextArea} from '@cookers/ui';
import { z } from 'zod';
import styles from '../add-new-incident.module.css';
import { ReadOnlyProvider } from '@cookers/providers';
import { IncidentFormValue } from '@cookers/models';
import { useFormContext } from 'react-hook-form';
import { RootState } from '@cookers/store';
import {  useDispatch,useSelector } from 'react-redux';


export const AccidentEventSubDetails  = () => {
    const { masterData } = useSelector((state: RootState) => state.incidentManagement);
    const { globalMasterData } = useSelector((state: RootState) => state.globalMaster);
    const [involveVisibility, setInvolveVisibility] = useState(false);
    
    const handleOtherInvolveChange = (involveFlag:any) => {
        console.log(involveFlag);
      if(involveFlag==="2")
          setInvolveVisibility(true);
      else
      setInvolveVisibility(false);
    };
  
  return (
    <div >
      <div className={styles.gridrow}>
        <Text>DETAILS OF ACCIDENT(To be completed by Supervisor/Manager and Employee)</Text>
      </div>
      <div>
      <section className={styles.formrow}>
        <div className={styles.formitem}>
                <FormInput label="Cookers Truck" name="cookersTruck" placeHolder="Cookers Truck" />
        </div>
        <div className={styles.formitem}>
             <FormInput label="Driver" name="driver" placeHolder="Driver" />
        </div>
        <div className={styles.formitem}>
            <FormInput label="Licence No. & Details" name="driverLicence" placeHolder="Licence No. & Details" />
        </div>
      </section>
      <section>
        <div className={styles.formitem}> 
            <FormTextArea label="Driver Condition (including any injuries)" name="driverCondi" size='s' />
        </div>
      </section>
      <section>
        <div className={styles.formitem}> 
        <FormTextArea label="Cookers Vehicle Condition" name="vehicleCondi" size='s'/>
        </div>
      </section>
      <section>
        <div className={styles.formitem}> 
        <FormTextArea label="Actions put in place" name="actionTaken" size='s'/>
        </div>
      </section>
      
      <section>
        <div className={styles.formitem}> 
        <Text color='red' size='1' weight='bold'>Driver Must Complete OHSFORM-020 – Vehicle Accident Detail Report & supervisor must scan and add to the report</Text>
        </div>
      </section>
      <section>
        <div className={styles.formitem}> 
        <FormRadio label="Is another vehicle involved in the accident?" name="othVehicleInvolve" itemList={globalMasterData.optionList}  onValueChange={handleOtherInvolveChange} />
        </div>
      </section>
     
         <div style={{ display: involveVisibility ? 'block' : 'none' }}>
      <section>
       
        <div className={styles.formitem}> 
            <FormInput label="Driver" name="othDriver" placeHolder="Driver" />
        </div>
        <div className={styles.formitem}> 
        <FormInput label="Licence No. & Details" name="othDriverLicence" placeHolder="Licence No. & Details" />
        </div>
      
      </section>
      <section>
       
        <div className={styles.formitem}> 
        <FormInput label="Driver Contact Details" name="othDriverContact" placeHolder="Driver Contact Detailsriver" />
        </div>
        <div className={styles.formitem}> 
        <FormInput label="Vehicle Rego No. & Details" name="othVehicle" placeHolder="Vehicle Rego No. & Details" />
        </div>
      
      </section>
      <section>
        <div className={styles.formitem}> 
        <FormTextArea label="Driver Condition (including any injuries)" name="othDriverCondi" size='s' />
        </div>
      </section>
      <section>
        <div className={styles.formitem}> 
        <FormTextArea label="Vehicle Condition" name="othVehicleCondi" size='s'/>
        </div>
      </section>
      <section>
        <div className={styles.formitem}> 
        <FormTextArea label="Actions put in place" name="othActionTaken" size='s'/>
        </div>
      </section>
      </div>
       
    
      </div>

    </div>
  );
};
