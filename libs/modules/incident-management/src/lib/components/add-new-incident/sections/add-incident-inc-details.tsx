import {useState} from 'react';
import { Flex, Text, Box } from '@radix-ui/themes';
import { FormInput, FormRadio, FormDate,FormTextArea} from '@cookers/ui';
import { z } from 'zod';
import styles from '../add-new-incident.module.css';
import { ReadOnlyProvider } from '@cookers/providers';
import { IncidentFormValue } from '@cookers/models';
import { useFormContext } from 'react-hook-form';
import { RootState } from '@cookers/store';
import {  useDispatch,useSelector } from 'react-redux';


export const IncidentEventSubDetails = () => {
    const { masterData } = useSelector((state: RootState) => state.incidentManagement);
    const { globalMasterData } = useSelector((state: RootState) => state.globalMaster);

  const [incidentDecVisibility, setIncidentDecVisibility] = useState(false);
  const [areaContainVisibility, setAreaContainVisibility] = useState(false);
  const [containSectionVisibility, setContainSectionVisibility] = useState(false);
  const [injuryInvolveVisibility, setInjuryInvolveVisibility] = useState(false);
  const [otherInvolveVisibility, setOtherInvolveVisibility] = useState(false);
 const handleOilSpillChange = (flag:any) => {
   if(flag==="1"){
       setIncidentDecVisibility(true);
       setAreaContainVisibility(false);
   }    
   else{
       setIncidentDecVisibility(false);
       setAreaContainVisibility(true);
   }
 };
 const handleContainChange = (flag:any) => {
   if(flag==="2"){
       setContainSectionVisibility(true);
   }    
   else{
       setContainSectionVisibility(false);
   }
 };
 const handleInjuryInvolveChange = (flag:any) => {
   if(flag==="2"){
       setInjuryInvolveVisibility(true);
   }    
   else{
       setInjuryInvolveVisibility(false);
   }
 };
 const handleOtherInvolveChange = (flag:any) => {
   if(flag==="2"){
       setOtherInvolveVisibility(true);
   }    
   else{
       setOtherInvolveVisibility(false);
   }
 };

  return (
    <div >
    <div className={styles.gridrow}>
      <Text>DETAILS OF EVENT(To be completed by Supervisor/Manager and Employee)</Text>
    </div>
    <div>
        <section>
            <div className={styles.formitem}>
                <FormRadio label="Is incident involve oil spill?" name="oilSpill" itemList={globalMasterData.optionList} onValueChange={handleOilSpillChange}/>
            </div>
        </section>
        <div>
        <section style={{ display: incidentDecVisibility ? 'block' : 'none' }}>
            <div className={styles.formitem}>
                <FormTextArea label="Describe the Incident" name="incidentDec" size='s'/>
            </div>
        </section>
        <section style={{ display: areaContainVisibility ? 'block' : 'none' }}>
            <div className={styles.formitem}>
            <FormRadio label="Has area been contained?" name="areaContain" itemList={globalMasterData.optionList} onValueChange={handleContainChange}/>
            </div>
        </section>
        </div>
       <div style={{ display: containSectionVisibility ? 'block' : 'none' }}>
        <section className={styles.formrow} >
            <div className={styles.formitem}>
            <FormDate label="Time containment achieved?" name="containTime" />
            </div>
            <div className={styles.formitem}>
            <FormRadio label="Has local authorities been informed?" name="authInform" itemList={globalMasterData.optionList} />
            </div>
            <div className={styles.formitem}>
            <FormTextArea label="Contain Note" name="containNote" size='s'/>
            </div>
        </section>
        </div>
        <section className={styles.formrow}>
            <div className={styles.formitem}>
            <FormRadio label="Was there any Injury involved?" name="injuryInvolve" itemList={globalMasterData.optionList}  onValueChange={handleInjuryInvolveChange}/>
            </div>
           
        </section>
        <section className={styles.formrow} style={{ display: injuryInvolveVisibility ? 'block' : 'none' }}>
            <div className={styles.formitem}>
            <FormRadio label="Who is involved?" name="whoInvolve" itemList={masterData.injuredPersonList}  onValueChange={handleOtherInvolveChange}/>
            </div>
           
        </section>
        <div style={{ display: otherInvolveVisibility ? 'block' : 'none' }}>
        <section className={styles.formrow}>
            <div className={styles.formitem}>
            <FormInput label="Name" name="involverName" placeHolder="Name" />
            </div>
            <div className={styles.formitem}>
            <FormInput label="Contact No" name="involverContact" placeHolder="Contact No" />
            </div>
            <div className={styles.formitem}>
            <FormInput label="Address" name="involverAddress" placeHolder="Address" />
            </div>
            <div className={styles.formitem}>
            <FormInput label="Email" name="involverEmail" placeHolder="Email" />
            </div>
        </section>
        </div>
    </div>
  </div>

  );
};
