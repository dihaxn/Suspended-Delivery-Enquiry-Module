import { RootState } from '@cookers/store';
import { FormDate, FormInput, FormRadio, FormSelect } from '@cookers/ui';
import { Text } from '@radix-ui/themes';
import React from 'react';
import { useSelector } from 'react-redux';
import styles from '../add-new-incident.module.css';
type incidentFormProps = {
  selectedReportType: string;
};
export const InjuryDetails: React.FC<incidentFormProps> = ({ selectedReportType }) => {
  const { masterData } = useSelector((state: RootState) => state.incidentManagement);
  const { globalMasterData } = useSelector((state: RootState) => state.globalMaster);
  return (
    <div>
      <div className={styles.gridrow}>
        <Text>DETAILS IF THERE HAS BEEN AN INJURY(To be completed by Supervisor/Manager & First Aider)</Text>
      </div>
      <section className={styles.formrow}>
        <div className={styles.formitem}>
          <FormInput label="Name of First Aider" name="firstAider" />
        </div>
        <div className={styles.formitem}>
          <FormDate label="Employee Reported Injury At" name="injuryReportedOnDate" />
        </div>
        <div className={styles.formitem}>
          <FormInput label="To" name="injuryReportedTo" />
        </div>
      </section>
      <section className={styles.formrow}>
        <div className={styles.formitem}>
          <FormInput label="Details of Injury" name="injuryNature" />
        </div>
        <div className={styles.formitem}>
          <FormInput label="Part of Body Injured" name="partInjured" />
        </div>
      </section>
      <section className={styles.formrow}>
        <div className={styles.formitem}>
          <FormSelect label="(A)FIRST AID" name="firstAidType" data={masterData.firstAidList} />
        </div>
        <div className={styles.formitem}>
          <FormInput label="(B)SENT TO DR" name="doctor" />
        </div>
        <div className={styles.formitem}>
          <FormInput label="HOSPITAL" name="hospital" />
        </div>
      </section>
      <section className={styles.formrow}>
        <div className={styles.formitem}>
          <FormInput label="Details of Treatment" name="treatment" />
        </div>
      </section>
      <div className={styles.formitem} style={{ display: selectedReportType == 'INJU' ? 'block' : 'none' }}>
        <section className={styles.formrow}>
          <div className={styles.formitem}>
            <FormRadio label="Is Work Covered Informed/Involved?" name="workInform" itemList={globalMasterData.optionList} />
          </div>
          <div className={styles.formitem}>
            <FormRadio label="Has Cookers Head Office Notified?" name="notifyHo" itemList={globalMasterData.optionList} />
          </div>
        </section>
      </div>

      <section className={styles.formrow}>
        <p>Attach Claim & Correspondence</p>
      </section>
      <section className={styles.formrow}>
        <div className={styles.formitem}>
          <FormInput label="First Aider's/Manager's Name" name="aiderName" />
        </div>
        <div className={styles.formitem}>
          <FormDate label="Date" name="firstAidOnDate" />
        </div>
      </section>
    </div>
  );
};
