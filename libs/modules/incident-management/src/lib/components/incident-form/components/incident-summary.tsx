import { useNavigationBlock } from '@cookers/modules/common';
import { useSpinner } from '@cookers/providers';
import { configStore, RootState, setDocUnsaveCount, setIncidentDocDeleted, setIncidentRefreshFlag } from '@cookers/store';
import { Button, ConfirmAlertDialog, Flex, FormSwitch, Grid, Heading, PopupMessageBox, Text } from '@cookers/ui';
import { convertBase64ToBlob } from '@cookers/utils';
import * as Toast from '@radix-ui/react-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from 'libs/ui/src/lib/shadcn/tooltip';
import { IconButton, ScrollArea, Separator } from '@radix-ui/themes';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { postIncidentAcceptanceDetails } from '../../../hooks/use-incident-acceptance-query';
import { downloadIncidentReport } from '../../../hooks/use-incident-pdf';
import { postWorkCoverDetails } from '../../../hooks/use-workcover-query';
import { mapIncidentAcceptanceDetails } from '../../../logic/get-incident-acceptance';
import { getIncidentSummaryDetails } from '../../../logic/get-summary-details';
import { mapIncidentWorkCoverDetails } from '../../../logic/get-work-cover';
import { useIncidentReadOnly } from '../../../provider/read-only-incident-provider';
import { IncidentFormSchemaType } from '../form-schema';
import { IncidentDocDetails } from './incident-doc-details';
import { downloadIncidentHelperDoc } from '../../../hooks/use-incident-helper';
import { RefreshCw } from 'lucide-react';
interface IncidentSummaryProps {
  status: string | undefined;
  submitError?: string | null;
  sendForApproval: () => void;
  // save: () => void;
  incidentId: number;

  isSummaryUpdateRequired: boolean;
  onSummaryUpdated: () => void;
}
export const IncidentSummary: React.FC<IncidentSummaryProps> = ({
  status,
  submitError,
  sendForApproval,
  incidentId,
  isSummaryUpdateRequired,
  onSummaryUpdated,
}) => {
  const { masterData, isproxyReadOnly } = useSelector((state: RootState) => state.incidentManagement);
  const { globalMasterData } = useSelector((state: RootState) => state.globalMaster);
  const { formState, getValues, setValue, watch, reset } = useFormContext();
  const currentValues = getValues();
  console.log(currentValues);
  const dispatch = useDispatch();
  const [summaryModel, setSummaryModel] = useState(getIncidentSummaryDetails(currentValues as IncidentFormSchemaType, masterData,globalMasterData));
  const { setBlocked } = useNavigationBlock();
  const [open, setOpen] = useState(false);
  const [toastState, setToastState] = useState({
    title: '',
    message: '',
    type: '',
  });
  const eventDateRef = useRef(new Date());
  const timerRef = useRef(0);
  const {
    isReadOnly,
    saveBtnVisible,
    approvalBtnVisible,
    confirmByEmpBtnVisible,
    confirmByMgrBtnVisible,
    workcoverBtnVisible,
    ownRecordReadOnly,
    isReadOnlyAccess,
  } = useIncidentReadOnly();
  console.log('RRR', formState.isSubmitting, formState.isSubmitted, formState.isSubmitSuccessful, formState.isDirty);
  const navigate = useNavigate();
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isDocConfirmOpen, setDocConfirmOpen] = useState(false);
  const [docConfirmMsg, setDocConfirmMsg] = useState('');
  const confirmText =
    'By selecting ‘Confirm,’ you acknowledge that the above information is true and accurate to the best of your knowledge, and that you agree with the description provided for this incident. This confirmation will serve as your electronic agreement, logged with your employee ID and login timestamp';
  const onBehalfOf = watch('acceptOnBehalfEmp');
  const confirmByEmp = watch('confirmByEmp');
  const confirmByMgr = watch('confirmByMgr');
  const workInform = watch('workInform');
  const isWorkInform = workInform == 'Y';
  const { setIsSpinnerLoading } = useSpinner();
  /*  useEffect(() => {
    if (isSaved) {
      // Fetch updated values and update summary
      const currentValues = getValues(); // Assuming getValues is accessible here
      const updatedSummary = getIncidentSummaryDetails(currentValues as IncidentFormSchemaType, masterData);
      setSummaryModel(updatedSummary);

      // Notify parent that save event has been acknowledged
    }
  }, [isSaved]); */
  /* useEffect(() => {
    if (isloaded) {
      // Fetch updated values and update summary
      const currentValues = getValues(); // Assuming getValues is accessible here
      const updatedSummary = getIncidentSummaryDetails(currentValues as IncidentFormSchemaType, masterData);
      setSummaryModel(updatedSummary);

      // Notify parent that save event has been acknowledged
    }
  }, [isloaded]); */
  useEffect(() => {
    if (isSummaryUpdateRequired) {
      const currentValues = getValues();
      setSummaryModel(getIncidentSummaryDetails(currentValues as IncidentFormSchemaType, masterData,globalMasterData));
      onSummaryUpdated();
    }
  }, [getValues, masterData, isSummaryUpdateRequired, onSummaryUpdated]);
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      setToastState({ type: 'Success', message: 'Incident Submitted Successfully', title: 'Incident Submitted Successfully' });
      setOpen(true);
      eventDateRef.current = oneWeekAway(new Date());
      timerRef.current = window.setTimeout(() => {
        setOpen(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [formState.isSubmitSuccessful]);
  useEffect(() => {
    if (submitError) {
      setToastState({ type: 'Error', message: submitError, title: 'Submission Failed' });
      setOpen(true);
      timerRef.current = window.setTimeout(() => {
        setOpen(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [submitError]);
  const handleSummaryUpdate = () => {
    //if (formState.isDirty) {
    const currentValues = getValues();

    setSummaryModel(getIncidentSummaryDetails(currentValues as IncidentFormSchemaType, masterData,globalMasterData));
    //}
  };
  const handleSendForApproval = () => {
    setValue('internalStatus', 'E');
    sendForApproval();
  };
  /* const handleSave = () => {
    setValue('internalStatus', 'O');
    save();
  }; */
  const validationSuccess = (): boolean => {
    const data = getValues();

    if (
      data.acceptOnBehalfEmp === true && // "acceptOnBehalfEmp" is true
      (data.incidentResource.length === 0 || // No incident resources
        !data.incidentResource.some((resource: any) => resource.docType === 'PROF')) // No resource with docType 'TRIN'
    ) {
      return false; // Validation fails
    }

    return true; // Validation succeeds
  };

  const validationEvidenceSuccess = (): boolean => {
    const data = getValues();

    if (data.internalStatus === 'E' && data.evidenceAttach === 'Y' && (
      data.incidentResource.length == 0 ||
      !data.incidentResource.some((resource: any) => resource.docType === 'EVID')
    )) {
      return false;
    }

    return true; // Validation succeeds
  };

  const handleSaveConfirmation = async () => {
    if (!validationEvidenceSuccess()) {
      setDocConfirmOpen(true);
      setDocConfirmMsg('Evidence is not attached');
    } else {
      if (validationSuccess()) {
        setConfirmDialogOpen(true);
      } else {
        setDocConfirmOpen(true);
        setDocConfirmMsg('Proof of Entrust Document is Mandatory');
      }
    }
  };
  const handleValidationConfirmation = async () => {
    setDocConfirmOpen(false);
    setDocConfirmMsg('');
  };
  const handleConfirmation = async () => {
    setConfirmDialogOpen(false);
    setIsSpinnerLoading(true);
    try {
      const acceptDetails = mapIncidentAcceptanceDetails(status ?? 'E', currentValues as IncidentFormSchemaType);
      const result = await postIncidentAcceptanceDetails(acceptDetails);

      if (result.success) {
        dispatch(setDocUnsaveCount({ type: 'set', value: 0 }));
        dispatch(setIncidentDocDeleted(false));
        setBlocked(false);
        console.log('Updated successfully:', result);
        dispatch(setIncidentRefreshFlag(true));
        dispatch(setDocUnsaveCount({ type: 'set', value: 0 }));
        navigate(`/${configStore.appName}/incident-management`);
      } else {
        console.error('Error updating:', result);
      }
    } catch (error) {
      console.error('Error mapping incident details:', error);
    } finally {
      setIsSpinnerLoading(false);
    }
  };
  const handleSaveWorkCover = async () => {
    setIsSpinnerLoading(true);
    try {
      const workCoverValues = getValues();
      const acceptDetails = mapIncidentWorkCoverDetails(workCoverValues as IncidentFormSchemaType);
      const result = await postWorkCoverDetails(acceptDetails);

      if (result.success) {
        console.log('Updated successfully:', result);
        dispatch(setDocUnsaveCount({ type: 'set', value: 0 }));
        dispatch(setIncidentDocDeleted(false));
        setBlocked(false);
        setToastState({ type: 'Success', message: 'WorkCover Saved Successfully', title: 'WorkCover Saved Successfully' });
        setOpen(true);
        reset(workCoverValues);
        eventDateRef.current = oneWeekAway(new Date());
        timerRef.current = window.setTimeout(() => {
          setOpen(false);
        }, 3000);
      } else {
        console.error('Error updating:', result);
        setToastState({ type: 'Error', message: 'Fail to save WorkCover', title: 'Fail to save WorkCover' });
        setOpen(true);
        eventDateRef.current = oneWeekAway(new Date());
        timerRef.current = window.setTimeout(() => {
          setOpen(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error mapping incident details:', error);
    } finally {
      setIsSpinnerLoading(false);
    }
  };

  return (
    <Toast.Provider swipeDirection="right">
      <Flex gap="3" direction="column" width="100%" maxWidth="400px" height="100%">
        {/*  <Text size="1" color="red">
          <pre>{JSON.stringify(formState, null, 2)}</pre>
        </Text>
 */}
        <div style={{ overflow: 'auto', flexGrow: '1' }}>
          <ScrollArea type="auto" scrollbars="vertical">
            <Flex gap="3" direction="column" p="4">
              <Flex gap="3" direction="row" align="center" justify="between" >
                <Heading size="4">
                  Incident Summary
                </Heading>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconButton variant="soft" color="blue" className="cursor-pointer" radius="full" type="button" onClick={handleSummaryUpdate}>
                      <RefreshCw size={20} />
                    </IconButton>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8}>Refresh Summary</TooltipContent>
                </Tooltip>
              </Flex>
              <Flex direction="column" maxWidth="350px">
                <Heading size="1">Incident</Heading>
                <Text size="1" wrap="pretty">
                  Report ID: {summaryModel.refCode}
                </Text>
                <Text size="1" wrap="pretty">
                  Report Type: {summaryModel.reportTypeLabel}
                </Text>
                <Text size="1" wrap="pretty">
                  Worksite: {summaryModel.workSiteLabel}
                </Text>
                <Text size="1" wrap="pretty">
                  Status: {summaryModel.statusLabel}
                </Text>
                {summaryModel.acceptOnBehalfEmpLabel === 'Yes' && (
                  <Text size="1" wrap="pretty">
                    Accept on Behalf of Employee: {summaryModel.acceptOnBehalfEmpLabel}
                  </Text>
                )}
                <Text size="1" wrap="pretty">
                  Employee Accepted: {summaryModel.empAcceptByName}
                </Text>
                <Text size="1" wrap="pretty">
                  Employee Accepted On: {summaryModel.empAcceptOn}
                </Text>
                <Text size="1" wrap="pretty">
                  Manager Accepted: {summaryModel.mgrAcceptByName}
                </Text>
                <Text size="1" wrap="pretty">
                  Manager Accepted On: {summaryModel.mgrAcceptOn}
                </Text>
              </Flex>
              <Separator orientation="horizontal" size="4" color="indigo" />

              <Heading size="2">Employee Details</Heading>
              <Flex direction="column" maxWidth="350px">
                <Heading size="1">Personal</Heading>
                <Text size="1" wrap="pretty">
                  Employee ID: {summaryModel.empId}
                </Text>
                <Text size="1" wrap="pretty">
                  Employee Name: {summaryModel.empName}
                </Text>
                <Text size="1" wrap="pretty">
                  Gender: {summaryModel.genderTypeLabel}
                </Text>
                <Text size="1" wrap="pretty">
                  Dob: {summaryModel.dobOn}
                </Text>
              </Flex>
              <Flex direction="column" maxWidth="350px">
                <Heading size="1">Contact Details</Heading>
                <Text size="1" wrap="pretty">
                  Address: {summaryModel.address}
                </Text>
                <Text size="1" wrap="pretty">
                  Personal Phone: {summaryModel.homePhone}
                </Text>
                <Text size="1" wrap="pretty">
                  Personal Email: {summaryModel.personalEmail}
                </Text>
              </Flex>

              <Flex direction="column" maxWidth="350px">
                <Heading size="1">Work Details</Heading>
                <Text size="1" wrap="pretty">
                  Depot: {summaryModel.depotCodeLabel}
                </Text>
                <Text size="1" wrap="pretty">
                  Department: {summaryModel.department}
                </Text>
                <Text size="1" wrap="pretty">
                  Occupation: {summaryModel.occupation}
                </Text>
              </Flex>

              <Separator orientation="horizontal" size="4" color="indigo" />

              <Heading size="2">Incident Details</Heading>
              <Flex direction="column" maxWidth="350px">
                <Heading size="1">Time & Place of the Incident</Heading>
                <Text size="1" wrap="pretty">
                  Date & Time of Incident: {summaryModel.eventOn}
                </Text>
                <Text size="1" wrap="pretty">
                  Place of Incident: {summaryModel.accidentPlace}
                </Text>
                <Text size="1" wrap="pretty">
                  Work Time: {summaryModel.normalOvertimeLabel}
                </Text>
              </Flex>
              <Flex direction="column" maxWidth="350px">
                <Heading size="1">Job Details</Heading>
                <Text size="1" wrap="pretty">
                  Job Performed: {summaryModel.jobPerformed}
                </Text>
                <Text size="1" wrap="pretty">
                  Written Instruction: {summaryModel.anyInstructionLabel}
                </Text>
                {summaryModel.anyInstructionLabel === 'Yes' && <Text size="1">Instruction: {summaryModel.instruction}</Text>}
              </Flex>

              <Flex direction="column" maxWidth="350px">
                <Heading size="1">Incident Log Details</Heading>
                <Text size="1" wrap="pretty">
                  Employee Desc: {summaryModel.eventDesc}
                </Text>
                <Text size="1" wrap="pretty">
                  Employee Name: {summaryModel.eventEmpName}
                </Text>
                <Text size="1" wrap="pretty">
                  Incident Log On Date: {summaryModel.eventLogOn}
                </Text>
              </Flex>
              <Flex direction="column" maxWidth="350px">
                <Heading size="1">Witness Details</Heading>
                <Text size="1" wrap="pretty">
                  Witness: {summaryModel.witnesses}
                </Text>
                <Text size="1" wrap="pretty">
                  Supervisor: {summaryModel.eventSupervisor}
                </Text>
                <Text size="1" wrap="pretty">
                  Any Injury Happened: {summaryModel.anyInjuryLabel}
                </Text>
              </Flex>
              <Flex direction="column" maxWidth="350px">
                <Heading size="1">Cookers Driver and Vehicle Impact Details</Heading>
                <Text size="1" wrap="pretty">
                  Cooker Truck: {summaryModel.cookersTruck}
                </Text>
                <Text size="1" wrap="pretty">
                  Name: {summaryModel.driver}
                </Text>
                <Text size="1" wrap="pretty">
                  Licence No: {summaryModel.driverLicence}
                </Text>
                <Text size="1" wrap="pretty">
                  Driver Condition: {summaryModel.driverCondi}
                </Text>
                <Text size="1" wrap="pretty">
                  Vehicle Condition: {summaryModel.vehicleCondi}
                </Text>
                <Text size="1" wrap="pretty">
                  Action Taken: {summaryModel.actionTaken}
                </Text>
              </Flex>

              <Flex direction="column" maxWidth="350px">
                <Heading size="1">Oil Spill Details</Heading>
                <Text size="1" wrap="pretty">{`Oil Spilled: ${summaryModel.olispillLabel}${summaryModel.incidentDec ? ', ' + summaryModel.incidentDec : ''}`}</Text>

                {summaryModel.olispillLabel == 'Yes' && (
                  <Text size="1" wrap="pretty">
                    Has area been Contained: {summaryModel.areaContainLabel}
                  </Text>
                )}
                {summaryModel.areaContainLabel == 'Yes' && (
                  <Text size="1" wrap="pretty">
                    Time of Containment: {summaryModel.containTime}
                  </Text>
                )}
                {summaryModel.areaContainLabel == 'Yes' && (
                  <Text size="1" wrap="pretty">
                    Containment Note: {summaryModel.containNote}
                  </Text>
                )}
                {summaryModel.areaContainLabel == 'Yes' && (
                  <Text size="1" wrap="pretty">
                    Informed to authorities: {summaryModel.authInformLabel}
                  </Text>
                )}
                <Text size="1" wrap="pretty">
                  Were outside cleaning contractors or Emergency Services called to the site? {summaryModel.emergencyServiceLabel}
                </Text>
                {summaryModel.emergencyServiceLabel == 'Yes' && (
                  <Text size="1" wrap="pretty">
                    Service Name: {summaryModel.outsideServiceName}
                  </Text>
                )}
                <Text size="1" wrap="pretty">
                  {' '}
                  Was anyone injured? {summaryModel.injuryInvolveLabel}{' '}
                </Text>
                {summaryModel.injuryInvolveLabel == 'Yes' && (
                  <Text size="1" wrap="pretty">
                    {' '}
                    {`Who is involved: ${summaryModel.whoInvolveLabel === 'You' ? summaryModel.empName : summaryModel.whoInvolveLabel}`}
                  </Text>
                )}
              </Flex>

              {summaryModel.reportType == 'INCI' && summaryModel.whoInvolveLabel == 'Someone Else' && (
                <Flex direction="column" maxWidth="350px">
                  <Heading size="1">Injured Other Person Details</Heading>
                  <Text size="1" wrap="pretty">
                    Name: {summaryModel.involverName}
                  </Text>
                  <Text size="1" wrap="pretty">
                    Address: {summaryModel.involverAddress}
                  </Text>
                  <Text size="1" wrap="pretty">
                    Contact No: {summaryModel.involverContact}
                  </Text>
                  <Text size="1" wrap="pretty">
                    Email: {summaryModel.involverEmail}
                  </Text>
                </Flex>
              )}
              {summaryModel.reportType == 'ACCI' && (
                <Flex direction="column" maxWidth="350px">
                  <Heading size="1">Accident Details</Heading>

                  <Text size="1" wrap="pretty">
                    Other Vehicle Involve: {summaryModel.othVehicleInvolveLabel}
                  </Text>
                </Flex>
              )}
              {summaryModel.reportType == 'ACCI' && summaryModel.othVehicleInvolveLabel == 'Yes' && (
                <Flex direction="column" maxWidth="350px">
                  <Heading size="1">Other Driver and Vehicle Impact Details</Heading>
                  <Text size="1" wrap="pretty">
                    Name: {summaryModel.othDriver}
                  </Text>
                  <Text size="1" wrap="pretty">
                    Contact No: {summaryModel.othDriverContact}
                  </Text>

                  <Text size="1" wrap="pretty">
                    Licence No: {summaryModel.othDriverLicence}
                  </Text>
                  <Text size="1" wrap="pretty">
                    Vehicle Reg No: {summaryModel.othVehicle}
                  </Text>
                  <Text size="1" wrap="pretty">
                    Driver Condition: {summaryModel.othDriverCondi}
                  </Text>
                  <Text size="1" wrap="pretty">
                    Vehicle Condition: {summaryModel.othVehicleCondi}
                  </Text>
                  <Text size="1" wrap="pretty">
                    Action Taken: {summaryModel.othActionTaken}
                  </Text>
                </Flex>
              )}
              <Separator orientation="horizontal" size="4" color="indigo" />
              {(summaryModel.reportType == 'INJU' || summaryModel.anyInjuryLabel == 'Yes') && <Heading size="2">Injury Details</Heading>}
              {(summaryModel.reportType == 'INJU' || summaryModel.anyInjuryLabel == 'Yes') && (
                <Flex direction="column" maxWidth="350px">
                  <Heading size="1">First Aid Details</Heading>
                  <Text size="1" wrap="pretty">
                    First Aider Name: {summaryModel.firstAider}
                  </Text>
                  <Text size="1" wrap="pretty">
                    {`Reported At: ${summaryModel.injuryReportedOn}${summaryModel.injuryReportedTo ? `  To: ${summaryModel.injuryReportedTo}` : ''}`}
                  </Text>
                  <Text size="1" wrap="pretty">
                    Details of Injury: {summaryModel.injuryNature}
                  </Text>
                  <Text size="1" wrap="pretty">
                    Injured Body Part: {summaryModel.partInjured}
                  </Text>
                  <Text size="1" wrap="pretty">
                    First Aid: {summaryModel.firstAidTypeLabel}
                  </Text>
                  <Text size="1" wrap="pretty">
                    Sent to DR: {summaryModel.doctor}
                  </Text>
                  {summaryModel.doctor && (
                    <Text size="1" wrap="pretty">
                      Hospital: {summaryModel.hospital}
                    </Text>
                  )}
                  <Text size="1" wrap="pretty">
                    Treatment given: {summaryModel.treatment}
                  </Text>
                  {summaryModel.reportType == 'INJU' && (
                    <Text size="1" wrap="pretty">
                      Is Work Covered Informed/Involved? {summaryModel.workInformLabel}
                    </Text>
                  )}
                  {summaryModel.reportType == 'INJU' && summaryModel.workInformLabel == 'Yes' && (
                    <Text size="1" wrap="pretty">
                      Date Informed: {summaryModel.informDate}
                    </Text>
                  )}
                  {summaryModel.reportType == 'INJU' && summaryModel.workInformLabel == 'Yes' && (
                    <Text size="1" wrap="pretty">
                      Work Cover Claim No: {summaryModel.workClaimNo}
                    </Text>
                  )}
                  {summaryModel.reportType == 'INJU' && (
                    <Text size="1" wrap="pretty">
                      Has Cookers Head Office Notified? {summaryModel.notifyHoLabel}
                    </Text>
                  )}
                  {/*  <Text size="1">First Aider or Manager Name: {summaryModel.aiderName}</Text>
                  <Text size="1">Date: {summaryModel.firstAidOn}</Text> */}
                </Flex>
              )}
              {(summaryModel.reportType == 'INJU' || summaryModel.anyInjuryLabel == 'Yes') && <Separator orientation="horizontal" size="4" color="indigo" />}
              <Heading size="2">Corrective Action Details</Heading>

              <Flex direction="column" maxWidth="350px">
                <Text size="1" wrap="pretty">
                  Corrective Action: {summaryModel.immCorrectAction}
                </Text>
                <Text size="1" wrap="pretty">
                  {`Date Completed: ${summaryModel.immActionOn}${summaryModel.immActionOn ? `  By: ${summaryModel.immActionBy}` : ''}`}
                </Text>
                <Text size="1" wrap="pretty">
                  Feasible Action: {summaryModel.feasibleActionTypeLabel}
                </Text>
                <Text size="1" wrap="pretty">
                  Proposed Completion Date: {summaryModel.feasibleActionOn}
                </Text>
                <Text size="1" wrap="pretty">
                  Reminder Date: {summaryModel.feasibleReminderOn}
                </Text>
                <Text size="1" wrap="pretty">
                  Comment: {summaryModel.feasibleAction}
                </Text>
                <Text size="1" wrap="pretty">
                  {`Action Completed On: ${summaryModel.completeOn}${summaryModel.completeOn ? `  By: ${summaryModel.feasibleActionBy}` : ''}`}
                </Text>

                <Text size="1" wrap="pretty">
                  Supervisor: {summaryModel.supervisor}
                </Text>
                <Text size="1" wrap="pretty">
                  Date: {summaryModel.supervisorOn}
                </Text>
                <Text size="1" wrap="pretty">
                  Comment: {summaryModel.managerComm}
                </Text>
                <Text size="1" wrap="pretty">
                  Manager: {summaryModel.manager}
                </Text>
                <Text size="1" wrap="pretty">
                  Date: {summaryModel.managerOn}
                </Text>
                <Text size="1" wrap="pretty">
                  Evidence Attached: {summaryModel.evidenceAttachLabel}
                </Text>
                {/*  <Text size="1">Signed By All: {summaryModel.signedByAllLabel}</Text> */}
              </Flex>

              <Separator orientation="horizontal" size="4" color="indigo" />
              <div className="file-uploader">
                <IncidentDocDetails />
              </div>
            </Flex>
          </ScrollArea>
        </div>
        {isReadOnlyAccess && (
          <Flex direction="column" p="3">
            <Grid columns="1" gap="3" rows="repeat(2, auto)" width="auto">
              {status == 'E' && masterData.editFourthSection === true && !isproxyReadOnly && !masterData.editWorkCover && (
                <div>
                  <div>
                    <FormSwitch name="acceptOnBehalfEmp" label="Confirm on behalf of employee" size="2" />
                  </div>
                  <div>
                    <Text as="label" size="1" color="gray">
                      {confirmText}
                    </Text>
                  </div>
                </div>
              )}
              {status == 'E' && isproxyReadOnly && !masterData.editWorkCover && (
                <div>
                  <div>
                    <FormSwitch name="confirmByEmp" label="Confirm" size="2" />
                  </div>
                  <div>
                    <Text as="label" size="1" color="gray">
                      {confirmText}
                    </Text>
                  </div>
                </div>
              )}
              {status == 'M' && masterData.editFourthSection === true && !isproxyReadOnly && !masterData.editWorkCover && (
                <div>
                  <div>
                    <FormSwitch name="confirmByMgr" label="Confirm" size="2" />
                  </div>
                  <div>
                    <Text as="label" size="1" color="gray">
                      {confirmText}
                    </Text>
                  </div>
                </div>
              )}
            </Grid>

            <Grid columns="2" gap="3" rows="repeat(2, auto)" width="auto">
              {saveBtnVisible && (
                <Button type="submit" disabled={formState.isSubmitting} onClick={() => setValue('internalStatus', 'O')}>
                  {submitError ? 'Save' : formState.isSubmitting ? 'Saving...' : formState.isSubmitSuccessful ? 'Saved' : 'Save'}
                </Button>
              )}
              {approvalBtnVisible && incidentId !== 0 && !isproxyReadOnly && (
                <Button type="button" onClick={handleSendForApproval}>
                  Send for Acceptance
                </Button>
              )}
              {confirmByEmpBtnVisible && (onBehalfOf || confirmByEmp) && (
                <Button type="button" onClick={handleSaveConfirmation}>
                  Accept Content
                </Button>
              )}
              {confirmByMgrBtnVisible && confirmByMgr && (
                <Button type="button" onClick={handleSaveConfirmation}>
                  Accept Content
                </Button>
              )}
              {workcoverBtnVisible && isWorkInform && incidentId !== 0 && (
                <Button type="button" onClick={handleSaveWorkCover}>
                  Save WorkCover
                </Button>
              )}
            </Grid>
          </Flex>
        )}
        <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
          <Toast.Title className="ToastTitle">{toastState.title}</Toast.Title>
          <Toast.Description asChild>{toastState.type === 'Error' ? <Text className="ToastDescription">{toastState.message}</Text> : ''}</Toast.Description>
          {!submitError && (
            <Toast.Action className="ToastAction" asChild altText="Goto schedule to undo">
              <Button size="1" color="indigo" radius="full" variant="outline" onClick={() => navigate(`/${configStore.appName}/incident-management/`)}>
                Go to List
              </Button>
            </Toast.Action>
          )}
        </Toast.Root>

        <Toast.Viewport className="ToastViewport" />
        {isConfirmDialogOpen && (
          <ConfirmAlertDialog
            isOpen={isConfirmDialogOpen}
            onOpenChange={setConfirmDialogOpen}
            dialogTitle="Confirm"
            dialogDescription={status === 'E' ? 'Are you sure you want to confirm the incident?' : 'Are you sure you want to confirm the incident? It will be closed once confirmed'}
            confirmButtonText="Yes"
            onConfirm={() => handleConfirmation()}
          />
        )}
        {isDocConfirmOpen && <PopupMessageBox isOpen={isDocConfirmOpen} onOpenChange={setConfirmDialogOpen} dialogTitle="" dialogDescription={docConfirmMsg} onConfirm={() => handleValidationConfirmation()} />}
      </Flex>
    </Toast.Provider>
  );
};

function oneWeekAway(date: Date) {
  const now = new Date();
  const inOneWeek = now.setDate(now.getDate() + 7);
  return new Date(inOneWeek);
}

function prettyDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(date);
}
