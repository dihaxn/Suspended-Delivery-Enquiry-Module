import React, {useState,useEffect} from 'react';
import {  Text  } from '@radix-ui/themes';
import {  FormInput, FormDate,FormSelect,FormRadio } from '@cookers/ui';
import { z } from 'zod';
import styles from '../add-new-incident.module.css';

import {  RootState} from '@cookers/store';
import {  useSelector } from 'react-redux';


export const IncidentEmployeeDetails=() => {
  
  const { masterData } = useSelector((state: RootState) => state.incidentManagement);
 
  return (
    <div>
      <div className={styles.gridrow}>
        <Text>EMPLOYEE DETAILS(To be completed by Supervisor/Manager and Employee)</Text>
      </div>
      <div>
        <div>
          <section className={styles.formrow}>
            <div className={styles.formitem}>
            <FormInput label="Employee No" name="empId" icon="search" placeHolder="Employee No"   />
            </div>
            <div className={styles.formitem}>
            <FormInput label="Employee Name" name="empName" placeHolder="Employee Name" />
            </div>
            <div className={styles.formitem}>
            <FormDate label="Birth Date" name="dob" />
            </div>
             <div className={styles.formitem}>
            <FormRadio label="Gender" name="gender" itemList={masterData.genderList}  />
            </div> 
            <div className={styles.formitem}>
            <FormSelect label="Depot" name="depotCode" data={masterData.depotList} />
            </div>
          </section>
          <section className={styles.formrow}>
          <div className={styles.formitem}>
          <FormInput label="Department" name="department" placeHolder="Department" />
            </div>
            <div className={styles.formitem}>
            <FormInput label="Occupation" name="occupation" placeHolder="Occupation" />
            </div>
            <div className={styles.formitem}>
            <FormInput label="Home Phone No" name="homePhone" placeHolder="Home Phone No" />
            </div>
          </section>
          <section className={styles.formrow}>
          <div className={styles.formitem}>
          <FormInput label="Address" name="address" placeHolder="Address" />
            </div>
            <div className={styles.formitem}>
            <FormInput label="Personal Email" name="personalEmail" placeHolder="Personal Email" />
            </div>
            <div className={styles.formitem}>
            <FormInput label="Confirm Personal Email" name="confirmEmail" placeHolder="Confirm Personal Email" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
