import { LookupTable } from '@cookers/models';
import { RootState } from '@cookers/store';
import {
  FormAutoCompleterReturnType,
  FormCheckbox,
  FormDate,
  FormInput,
  FormInputAutoComplete,
  FormInputAutoCompleteEdit,
  FormRadio,
  FormSelect,
  FormTextArea,
} from '@cookers/ui';
import { Box, Flex, Heading } from '@radix-ui/themes';
import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { getEventOnDateMaxMinTime } from '../../../logic/get-incident-form-max-min-time';
import { useIncidentReadOnly } from '../../../provider/read-only-incident-provider';
import { ReportTypeAccident } from './report-type-accident';
import { ReportTypeIncident } from './report-type-incident';
type incidentventProps = {
  selectedReportType?: string;
  onValueChange?: (value: string) => void;
};

export const IncidentEventDetails: React.FC<incidentventProps> = ({ onValueChange }) => {
  const { masterData } = useSelector((state: RootState) => state.incidentManagement);
  const { globalMasterData } = useSelector((state: RootState) => state.globalMaster);
  const { control, setValue } = useFormContext();
  const { eventReadOnly } = useIncidentReadOnly();
  const reportType = useWatch({ control: control, name: 'reportType' });
  const eventOnDate = useWatch({ control: control, name: 'eventOnDate' });
  const reportTypeComponents: { [key: string]: React.FC } = {
    ACCI: ReportTypeAccident,
    INCI: ReportTypeIncident,
  };
  const ReportTypeComponent = reportTypeComponents[reportType] || null;
  const isShowInjury = reportType === 'INJU';
  const oilSpill = useWatch({ control: control, name: 'oilSpill' });
  const areaContain = useWatch({ control: control, name: 'areaContain' });
  const outsideService = useWatch({ control: control, name: 'outsideService' });
  const depotCode = useWatch({ control: control, name: 'depotCode' });

  const isShowIncident = oilSpill === 'N';
  const isOilSpill = oilSpill === 'Y';
  const isAreaContain = areaContain === true;
  const isOutsideService = outsideService === 'Y';
  const { maxTime, minTime } = getEventOnDateMaxMinTime(eventOnDate || new Date());
  const [filteredCarrierList, setFilteredCarrierList] = useState<LookupTable[]>([]);

  const empList = useMemo(() => {
    if (!masterData?.userDropdownList) return [];
    return masterData.userDropdownList.map((item) => item.name).filter((name) => typeof name === 'string' && name.trim() !== '');
  }, [masterData?.userDropdownList]);

  const supervisorList = useMemo(() => {
    if (!masterData?.userByDepotHierarchyDropdownList) return [];
    return masterData.userByDepotHierarchyDropdownList
      .filter((item) => typeof item.name === 'string' && item.name.trim() !== '' && item.groupLevel <= 28)
      .map((item) => item.name);
  }, [masterData?.userByDepotHierarchyDropdownList]);

  const carrierList = useMemo(() => {
    if (!masterData?.carrierList) return [];
    return masterData.carrierList.map((item) => item.carrierCode).filter((name) => typeof name === 'string' && name.trim() !== '');
  }, [masterData?.carrierList]);
  const handleCarrierChange = async (data: FormAutoCompleterReturnType) => {
    console.log(data);
    const carrierInfo = masterData.carrierList.filter((truck) => truck.carrierCode === data);
    console.log(carrierInfo);
    setValue('driver', carrierInfo[0]?.driverName || '');
    setValue('regoNo', carrierInfo[0]?.regoNo || '');
  };
  useEffect(() => {
    if (masterData?.carrierList && depotCode) {
      const filteredList = masterData.carrierList
        .filter((truck) => truck.depotCode === depotCode || truck.depotCode === '')
        .map((truck) => ({
          value: truck.carrierCode,
          label: truck.carrierCode,
        }));
      setFilteredCarrierList(filteredList);
    }
  }, [depotCode, masterData]);
  return (
    <div className="incident-section-block">
      <Box className="incident-section-header">
        <Heading>Details of the Incident</Heading>
        <small>To be completed by Supervisor/Manager and Employee</small>
      </Box>

      <Flex gap="4" wrap="wrap" className="incident-section-grid">
        <Box className="incident-section-grid-block">
          <Heading size="3">Time & Place of the Incident</Heading>
          <FormSelect
            size="3"
            label="Worksite of Incident"
            name="worksite"
            data={masterData.workSiteList}
            readOnly={eventReadOnly}
            placeholder="Worksite of Incident"
          />
          <FormDate
            label="Date & Time of the Incident"
            name="eventOnDate"
            showTimeSelect={true}
            maxDate={new Date()}
            maxTime={maxTime}
            minTime={minTime}
            readOnly={eventReadOnly}
          />
          <FormTextArea label="Place of Incident" name="accidentPlace" size="s" readOnly={eventReadOnly} maxLength={256} />
          <FormRadio label="" name="normalOvertime" itemList={masterData.jobTypeList} readOnly={eventReadOnly} />
        </Box>
        <Box className="incident-section-grid-block">
          <Heading size="3">Job Details</Heading>
          <FormTextArea label="Job Being Performed at the time of incident" name="jobPerformed" size="s" readOnly={eventReadOnly} maxLength={256} />
          <FormRadio
            label="Written Instructions"
            desc="Are there any written/operating instructions(include signs) for the job being performed?"
            name="anyInstruction"
            itemList={globalMasterData.optionList}
            readOnly={eventReadOnly}
          />
          <FormTextArea
            label=""
            desc="If Yes, what are they and were these instructions followed? (PLEASE EXPLAIN)"
            name="instruction"
            size="s"
            readOnly={eventReadOnly}
            maxLength={400}
          />
        </Box>
        <Box className="incident-section-grid-block">
          <Heading size="3">Incident Log Details</Heading>
          <FormTextArea
            label="Employee's description of incident"
            desc="Describe clearly how the incident occurred"
            name="eventDesc"
            size="s"
            readOnly={eventReadOnly}
            maxLength={1080}
          />

          <FormInput label="Employee Name" name="eventEmpName" readOnly={eventReadOnly} maxLength={40} />
          <FormDate
            label="Incident Log On Date"
            name="eventLogOnDate"
            dateFormat="dd-MMM-yyyy"
            minDate={new Date(eventOnDate)}
            maxDate={new Date()}
            readOnly={eventReadOnly}
          />
        </Box>

        <Box className="incident-section-grid-block">
          <Heading size="3">Cooker's Truck Details</Heading>
          <FormInputAutoComplete
            label="Cookers Truck"
            placeHolder="Enter Cookers Truck"
            name="cookersTruck"
            list={carrierList}
            readOnly={eventReadOnly}
            onItemSelect={handleCarrierChange}
          />
          <FormInput label="Truck Reg No" name="regoNo" readOnly={eventReadOnly} maxLength={8} />
          <FormInput label="Driver" name="driver" readOnly={eventReadOnly} maxLength={50} />
          <FormInput label="Licence No. & Details" name="driverLicence" readOnly={eventReadOnly} maxLength={50} />
        </Box>

        <Box className="incident-section-grid-block">
          <Heading size="3">Impact Details</Heading>
          <FormTextArea
            label="Driver Condition"
            desc="Including any injuries"
            name="driverCondi"
            size="s"
            readOnly={eventReadOnly}
            maxLength={1080}
          />
          <FormTextArea label="Cookers Vehicle Condition" name="vehicleCondi" size="s" readOnly={eventReadOnly} maxLength={1080} />
        </Box>
        <Box className="incident-section-grid-block">
          <Heading size="3">Action Details</Heading>
          <FormTextArea label="Actions put in place" name="actionTaken" size="s" readOnly={eventReadOnly} maxLength={1080} />
        </Box>
        <Box className="incident-section-grid-block">
          <Heading size="3">Oil Spill Details</Heading>
          <FormRadio label="Does this incident involve an oil spill?" name="oilSpill" itemList={globalMasterData.optionList} readOnly={eventReadOnly} />
          {isShowIncident && <FormTextArea label="Describe the Incident" name="incidentDec" size="s" readOnly={eventReadOnly} maxLength={1080} />}
          {
            isOilSpill && (
              /*  <Box style={{ backgroundColor: "var(--red-a7)", borderRadius: "var(--radius-3)",  border: "1px solid var(--red-a9)"}}> */
              <FormCheckbox label="Has area been contained?" name="areaContain" size="s" readOnly={eventReadOnly} />
            )
            /*  </Box> */
          }
          <FormRadio
            label="Were outside cleaning contractors or Emergency Services called to the site?"
            name="outsideService"
            itemList={globalMasterData.optionList}
            readOnly={eventReadOnly}
          />
          {isOutsideService && <FormInput label="Service Name" name="outsideServiceName" readOnly={eventReadOnly} maxLength={60} />}
        </Box>
        {isAreaContain && (
          <Box className="incident-section-grid-block">
            <Heading size="3">Containment Details</Heading>
            <FormDate label="Time containment achieved?" name="containTimeDate" readOnly={eventReadOnly} showTimeSelect={true} />
            <FormTextArea label="Containment Note" name="containNote" size="s" readOnly={eventReadOnly} maxLength={1080} />
            <FormRadio label="Has local authorities been informed?" name="authInform" itemList={globalMasterData.optionList} readOnly={eventReadOnly} />
          </Box>
        )}
        <Box className="incident-section-grid-block">
          <Heading size="3">Witness</Heading>
          <FormInputAutoCompleteEdit
            label="Witnesses(Name)"
            name="witnesses"
            list={empList}
            placeHolder="Enter name"
            readOnly={eventReadOnly}
            maxLength={40}
          />
          <FormInputAutoComplete
            label="Supervisor"
            name="eventSupervisor"
            list={supervisorList}
            placeHolder="Enter name"
            readOnly={eventReadOnly}
            maxLength={40}
          />
          {!isShowInjury && (
            <FormRadio
              label="Is there any injury happened?"
              name="anyInjury"
              defaultValue="N"
              itemList={globalMasterData.optionList}
              readOnly={eventReadOnly}
            />
          )}
        </Box>
      </Flex>

      {ReportTypeComponent && (
        <Box className="incident-section-report-type">
          <ReportTypeComponent />
        </Box>
      )}
    </div>
  );
};
