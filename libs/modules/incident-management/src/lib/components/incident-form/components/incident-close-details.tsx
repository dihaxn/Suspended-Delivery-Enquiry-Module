import React,{useMemo,useState,useEffect} from 'react';
import { Flex, Box } from '@radix-ui/themes';
import { FormDate, FormInput, FormRadio, Heading, FormTextArea, FormSelect,FormInputAutoComplete } from '@cookers/ui';
import { RootState } from '@cookers/store';
import { useSelector } from 'react-redux';
import { useFormContext, useWatch } from 'react-hook-form';
import { useIncidentReadOnly } from '../../../provider/read-only-incident-provider';

export const IncidentCloseAction = () => {
  const { masterData } = useSelector((state: RootState) => state.incidentManagement);
  const { globalMasterData } = useSelector((state: RootState) => state.globalMaster);
  //const methods = useFormContext();
  const methods = useFormContext();
  const { actionReadOnly } = useIncidentReadOnly();
  console.log("actionReadOnly",actionReadOnly);
 
 
  const eventLogOnDate = useWatch({ control: methods.control, name: 'eventLogOnDate' });
  //const firstAidOnDate = useWatch({ control: methods.control, name: 'firstAidOnDate' });
  const maxImmDate = eventLogOnDate;
  const immActionOnDate = useWatch({ control: methods.control, name: 'immActionOnDate' });
  const feasibleActionOnDate = useWatch({ control: methods.control, name: 'feasibleActionOnDate' });
  const supervisorOnDate = useWatch({ control: methods.control, name: 'supervisorOnDate' });
  const furtherCorrectAction = useWatch({ control: methods.control, name: 'furtherCorrectAction' });
  const isFurtherCorrectAction = furtherCorrectAction === 'Y';
  const empList = useMemo(() => {
    if (!masterData?.userDropdownList) return [];
    return masterData.userDropdownList
      .map(item => item.name)
      .filter(name => typeof name === 'string' && name.trim() !== '');
  }, [masterData?.userDropdownList]);
  const supervisorList = useMemo(() => {
      if (!masterData?.userByDepotHierarchyDropdownList) return [];
      return masterData.userByDepotHierarchyDropdownList
      .filter(item => typeof item.name === 'string' && item.name.trim() !== '' && item.groupLevel <= 28)
      .map(item => item.name);
    }, [masterData?.userByDepotHierarchyDropdownList]);
const managerList = useMemo(() => {
    if (!masterData?.userByDepotHierarchyDropdownList) return [];
    return masterData.userByDepotHierarchyDropdownList
    .filter(item => typeof item.name === 'string' && item.name.trim() !== '' && item.groupLevel <= 24)
    .map(item => item.name);
  }, [masterData?.userByDepotHierarchyDropdownList]);
  return (
    <div className="incident-section-block">
      <Box className="incident-section-header">
        <Heading>ACTION TAKEN TO PREVENT RECURRENCE</Heading>
        <small>To be completed by Supervisor/Manager</small>
      </Box>
      <Flex gap="4" wrap="wrap" className="incident-section-grid">
        <Box className="incident-section-grid-block">
          <Heading size="3">Corrective Action</Heading>
          <FormTextArea label="Immediate corrective action taken" desc="" name="immCorrectAction" size="s" readOnly={actionReadOnly } maxLength={1080}/>
          <FormInputAutoComplete label="By Whom" name="immActionBy" list={empList} placeHolder='Enter name' readOnly={actionReadOnly } maxLength={40}/>
          <FormDate
            label="Date Completed"
            name="immActionOnDate"
            dateFormat="dd-MMM-yyyy"
            minDate={new Date(maxImmDate)}
            maxDate={new Date()}
            readOnly={actionReadOnly  }
          />
           <FormRadio label="Further corrective action needed?" name="furtherCorrectAction" itemList={globalMasterData.optionList} readOnly={actionReadOnly } />
        </Box>
        {isFurtherCorrectAction &&  <Box className="incident-section-grid-block">
          <Heading size="3">Additional Action</Heading>
          <FormSelect
            size="3"
            label="Further feasible corrective action recommended"
            name="feasibleActionType"
            data={masterData.feasibleActionList}
            readOnly={actionReadOnly }
            placeholder='Select feasible action'
            setDefaultToPlaceholder={true}
          />
          <FormDate
            label="Proposed Completion Date"
            name="feasibleActionOnDate"
            dateFormat="dd-MMM-yyyy"
            minDate={new Date(immActionOnDate)}
            
            readOnly={actionReadOnly }
          />
          <FormDate
            label="Reminder Date"
            name="feasibleReminderDate"
            dateFormat="dd-MMM-yyyy"
            maxDate={new Date(feasibleActionOnDate)}
            minDate={new Date(eventLogOnDate)}
            readOnly={actionReadOnly }
          />
          <FormInputAutoComplete label="By Whom" name="feasibleActionBy" list={empList} placeHolder='Enter name' readOnly={actionReadOnly } maxLength={40}/>
          <FormTextArea label="Comment" name="feasibleAction" size="s" desc="" readOnly={actionReadOnly } maxLength={1080}/>
        </Box>}
       <Box className="incident-section-grid-block">
          <Heading size="3">Action Completed</Heading>
          
          <FormDate
            label="Action Completed On"
            name="completeOnDate"
            dateFormat="dd-MMM-yyyy"
            minDate={new Date(immActionOnDate)}
            maxDate={new Date()}
            readOnly={actionReadOnly }
          />
        </Box>
        <Box className="incident-section-grid-block">
          <Heading size="3">Supervisor Details</Heading>
          <FormInputAutoComplete label="Supervisor's Name" name="supervisor" list={supervisorList} placeHolder='Enter name' readOnly={actionReadOnly } maxLength={40}/>
          <FormDate
            label="Date"
            name="supervisorOnDate"
            dateFormat="dd-MMM-yyyy"
            minDate={new Date(immActionOnDate)}
            maxDate={new Date()}
            readOnly={actionReadOnly }
          />
        </Box>
        <Box className="incident-section-grid-block">
          <Heading size="3">Manager Details</Heading>
          <FormTextArea label="Manager's Comments" name="managerComm" readOnly={actionReadOnly } maxLength={1080} size="s"/>
          <FormInputAutoComplete label="Manager's Name" name="manager" list={managerList} placeHolder='Enter name' readOnly={actionReadOnly } maxLength={40}/>
          <FormDate
            label="Date"
            name="managerOnDate"
            dateFormat="dd-MMM-yyyy"
            minDate={new Date(supervisorOnDate)}
            maxDate={new Date()}
            readOnly={actionReadOnly }
          />
        </Box>
        <Box className="incident-section-grid-block">
          <Heading size="3">Evidence</Heading>
          <FormRadio label="Has Evidence been attached?" name="evidenceAttach" itemList={globalMasterData.optionList} readOnly={actionReadOnly } />
         {/*  <FormRadio label="Completed Form SIGNED by all parties" name="signedByAll" itemList={masterData.optionList} readOnly={actionReadOnly } /> */}
        </Box>
      </Flex>
    </div>
  );
};
