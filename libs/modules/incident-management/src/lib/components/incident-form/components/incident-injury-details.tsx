import { RootState } from '@cookers/store';
import React, { useMemo } from 'react';
import { FormDate, FormInput, FormRadio, FormSelect, FormTextArea, FormInputAutoCompleteEdit } from '@cookers/ui';
import { Box, Flex, Heading } from '@radix-ui/themes';
import { useFormContext, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { getInjuryReportMinTime } from '../../../logic/get-incident-form-max-min-time';
import { useIncidentReadOnly } from '../../../provider/read-only-incident-provider';
export const IncidentInjuryDetails = () => {
  const { masterData } = useSelector((state: RootState) => state.incidentManagement);
  const { globalMasterData } = useSelector((state: RootState) => state.globalMaster);
  const { control } = useFormContext();
  const { injuryReadOnly,workcoverReadOnly,isLoggedinUser } = useIncidentReadOnly();
  const eventOnDate = useWatch({ control: control, name: 'eventOnDate' });
  const eventLogOnDate = useWatch({ control: control, name: 'eventLogOnDate' });
  const injuryReportedOnDate = useWatch({ control: control, name: 'injuryReportedOnDate' });
  const workInform = useWatch({ control: control, name: 'workInform' });
  const isWorkInform = workInform === 'Y';
  const ishrOnly = masterData?.showWorkCover;
  const treatmentTypeList = [
    { value: "A", label: "FIRST AID" },
    { value: "B", label: "SENT TO DR" }
  ];
  const treatmentType = useWatch({ control: control, name: 'treatmentgiven' });
  const isFirstAid = treatmentType === 'A';
 
  //const minDate = injuryReportedOnDate ? eventOnDate : undefined;
  const { maxTime, minTime } = injuryReportedOnDate
  ? getInjuryReportMinTime(eventOnDate, eventLogOnDate, injuryReportedOnDate)
  : { maxTime: undefined, minTime: undefined };
  const empList = useMemo(() => {
    if (!masterData?.userDropdownList) return [];
    return masterData.userDropdownList.map((item) => item.name).filter((name) => typeof name === 'string' && name.trim() !== '');
  }, [masterData?.userDropdownList]);

  return (
    <div className="incident-section-block">
      <Box className="incident-section-header">
        <Heading>Details if there has been an Injury</Heading>
        <small>To be completed by Supervisor/Manager and Employee</small>
      </Box>

      <Flex gap="1" wrap="wrap" className="incident-section-grid">
        <Box className="incident-section-grid-block">
          <Heading size="3">Injury Details</Heading>
          <FormInputAutoCompleteEdit
            label="Name of First Aider"
            name="firstAider"
            list={empList}
            placeHolder="Enter name"
            readOnly={injuryReadOnly}
            maxLength={40}
          />
          <FormDate
            label="Employee Reported Injury At"
            name="injuryReportedOnDate"
            showTimeSelect={true}
            minDate={new Date(eventLogOnDate)}
            maxDate={new Date()}
            maxTime={maxTime}
            minTime={minTime}
            readOnly={injuryReadOnly}
          />
          <FormInput label="Employee Reported Injury To" name="injuryReportedTo" readOnly={injuryReadOnly} maxLength={40} />
          <FormTextArea label="Details of Injury" desc="" name="injuryNature" size="s" readOnly={injuryReadOnly} maxLength={1080} />
          <FormInput label="Part of Body Injured" name="partInjured" readOnly={injuryReadOnly} maxLength={80} />
           <FormRadio label="" name="treatmentgiven" itemList={treatmentTypeList} readOnly={injuryReadOnly} />
         {isFirstAid &&( <FormSelect
            label="(A)FIRST AID"
            name="firstAidType"
            data={masterData.firstAidList}
            readOnly={injuryReadOnly}
            placeholder="Select first aid"
            setDefaultToPlaceholder={true}
          />) }
         {!isFirstAid &&( <FormInput label="(B)SENT TO DR" name="doctor" readOnly={injuryReadOnly} maxLength={40} /> )}

         {!isFirstAid &&(  <FormInput label="HOSPITAL" name="hospital" readOnly={injuryReadOnly} maxLength={40} />)}
          <FormTextArea label="Details of Treatment" desc="" name="treatment" size="s" readOnly={injuryReadOnly} maxLength={1080} />
        </Box>

      
          <Box className="incident-section-grid-block">
            <Heading size="3">WorkCover Details</Heading>

            <FormRadio label="Has Cookers Head Office Notified?" name="notifyHo" itemList={globalMasterData.optionList} readOnly={injuryReadOnly} />

            <FormRadio label="Is WorkCover Informed/Involved?" name="workInform" itemList={globalMasterData.optionList} readOnly={injuryReadOnly} />
            {isWorkInform && ishrOnly && !isLoggedinUser && <FormDate label="Date Informed" name="informDateOn" dateFormat="dd-MMM-yyyy" readOnly={workcoverReadOnly}/>}
            {isWorkInform && ishrOnly && !isLoggedinUser && <FormInput label="WorkCover Claim No." name="workClaimNo" readOnly={workcoverReadOnly} maxLength={40} />}
            {isWorkInform && ishrOnly && !isLoggedinUser && <FormDate label="Claim Lodgement Date" name="claimLodgementOnDate" dateFormat="dd-MMM-yyyy" readOnly={workcoverReadOnly} />}
            {isWorkInform && ishrOnly && !isLoggedinUser &&<FormDate label="Approval Date" name="claimApprovalOnDate" dateFormat="dd-MMM-yyyy" readOnly={workcoverReadOnly} />}
            {isWorkInform && ishrOnly && !isLoggedinUser &&(
              <FormSelect
                label="Insurer"
                name="insurer"
                data={masterData.insurerList}
                readOnly={workcoverReadOnly}
                placeholder="Select Insurer"
                setDefaultToPlaceholder={true}
              />
            )}
            {isWorkInform && ishrOnly && !isLoggedinUser &&(
              <FormSelect
                label="Status"
                name="claimStatus"
                data={masterData.claimStatusList}
                readOnly={workcoverReadOnly}
                placeholder="Select Status"
                setDefaultToPlaceholder={true}
              />
            )}
          </Box>
       
        {/* removed  as per new change*/}
        {/*  <Box className="incident-section-grid-block">
          <Heading size="3">Claim & Correspondence</Heading>
          <FormInputAutoComplete label="First Aider's/Manager's Name" name="aiderName" list={empList} placeHolder='Enter name' readOnly={injuryReadOnly} maxLength={40}/>
          <FormDate
            label="Date"
            name="firstAidOnDate"
            dateFormat="dd-MMM-yyyy"
            minDate={new Date(injuryReportedOnDate)}
            maxDate={new Date()}
            readOnly={injuryReadOnly}
          />
        </Box> */}
      </Flex>
    </div>
  );
};
