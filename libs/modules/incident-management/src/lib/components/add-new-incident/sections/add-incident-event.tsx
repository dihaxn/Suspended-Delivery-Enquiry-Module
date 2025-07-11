import React,{useState,useEffect} from 'react';
import { Flex, Text,Box } from '@radix-ui/themes';
import { FormInput, FormRadio, FormDate,FormTextArea} from '@cookers/ui';
import { z } from 'zod';
import styles from '../add-new-incident.module.css';
import { IncidentMasterData } from '@cookers/models';
import { useFormContext } from 'react-hook-form';
import {  RootState} from '@cookers/store';
import {  useSelector } from 'react-redux';
type incidentventProps = {
 
  selectedReportType:string;
  onValueChange?: (value: string) => void;
  
};

export const IncidentEventDetails : React.FC<incidentventProps> = ({ selectedReportType,onValueChange}) => {

  const { masterData } = useSelector((state: RootState) => state.incidentManagement);
  const { globalMasterData } = useSelector((state: RootState) => state.globalMaster);
 
  return (
    <div>
      <div className={styles.gridrow}>
        <Text>DETAILS OF EVENT(To be completed by Supervisor/Manager and Employee)</Text>
      </div>
      <div>
        <div>
          <section className={styles.formrow}>
              <div className={styles.formitem}>
              <FormDate label="Date & Time of the Event" name="eventOnDate" />
              </div>
              <div className={styles.formitem}>
              <FormRadio label="" name="normalOvertime" itemList={masterData.jobTypeList} />
              </div>
            </section>
            <section className={styles.formrow}>
              <div className={styles.formitem}>
              <FormTextArea label="Job Being Performed at the time of event" name="jobPerformed" size='s'/>
              </div>
              <div className={styles.formitem}>
              <FormTextArea label="Place of Accident" name="accidentPlace" size='s'/>
              </div>
            </section>
            <section className={styles.formrow}>
              <div className={styles.formitem}>
              <FormInput label="Witnesses(Name)" name="witnesses" placeHolder="Witnesses" />
              </div>
              <div className={styles.formitem}>
              <FormInput label="Supervisor" name="eventSupervisor" placeHolder="Supervisor" />
              </div>
            </section>
            <section className={styles.formrow}>
              <div className={styles.formitem}>
              <FormRadio label="Are there any written/operating instructions(include signs) for the job being performed?" name="anyInstruction" itemList={globalMasterData.optionList} />
              </div>
              <div className={styles.formitem}>
              <FormTextArea label="If so, what are they and were these instructions followed? (PLEASE EXPLAIN)" name="instruction" size='s'/>
              </div>
            </section>
            <section className={styles.formrow}>
              <div className={styles.formitem}>
              <FormTextArea label="Employee's description of event(Describe clearly how the event occured)" name="eventDesc" size='s'/>
              </div>
            </section>
            <section className={styles.formrow}>
              <div className={styles.formitem}>
              <FormInput label="Employee Name" name="eventEmpName" placeHolder="Employee Name" />
              </div>
              <div className={styles.formitem}>
              <FormDate label="Event Log On Date" name="eventLogOnDate" />
              </div>
           
              <div className={styles.formitem} style={{ display: selectedReportType !== "INJU" ? 'block' : 'none' }}>
              <FormRadio label="Is there any injury happened?" name="anyInjury" itemList={globalMasterData.optionList}  onValueChange={onValueChange }/>
              </div>
              
            </section>
        </div>
       
      </div>
    </div>
  );
};
