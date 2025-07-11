import { IncidentViewModel } from '@cookers/models';
import { STORE, useStoreSelector } from '@cookers/store';
import { Badge, Button, Flex, Heading, ScrollArea, Separator, Text } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { fetchIncidentFormData } from '../../hooks/use-incident-view-query';
import {truncateTimeFromDateString} from '@cookers/utils'
import { colorSelectorByStatusName } from '../../util/incidentManagementUtils';

type BadgeColor = 'blue' | 'orange' | 'red' | 'green' | 'violet' | 'gray';
const badgeConfig: Record<string, { color: BadgeColor; label: string }> = {
  INCI: { color: 'blue', label: 'Incident' },
  ACCI: { color: 'orange', label: 'Accident' },
  INJU: { color: 'red', label: 'Injury' },
  NOTI: { color: 'green', label: 'Notification' },
  NEMI: { color: 'violet', label: 'Near Miss' },
  UNKNOWN: { color: 'gray', label: 'Unknown' },
};

export const IncidentQuickView = () => {
  const { selectedIncident, masterData } = useStoreSelector(STORE.IncidentManagement);
  const { globalMasterData } = useStoreSelector(STORE.GlobalMaster);
  const [loadVisible, setLoadVisible] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const selectedData = selectedIncident ?? {};
  const [incidentData, setIncidentData] = useState<IncidentViewModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log('selectedIncident', selectedIncident);
  console.log('RRR', selectedData);
  const isVisible = selectedData?.incidentId == 0;
  const [genderTypeLabel, setGenderTypeLabel] = useState('');
  const [firstAidLabel, setFirstAidLabel] = useState('');
  const [workInformLabel, setWorkInformLabell] = useState('');
  const [anyInjuryLabel, setAnyInjuryLabel] = useState('');
  const handleLoad = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchIncidentFormData(selectedData?.incidentId);
      setIncidentData(data); // Save the fetched data in state
      setLoadVisible(false);
      setLoadMore(true);
    } catch (err: any) {
      setError(err.message || 'Error loading incident data');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    // Reset state values when a new incident is selected
    if (selectedIncident) {
      setGenderTypeLabel('');
      setFirstAidLabel('');
      setAnyInjuryLabel('');
      setWorkInformLabell('');
      setIncidentData(null);
      setLoadVisible(true);
      setLoadMore(false);
    }
  }, [selectedIncident]);
  useEffect(() => {
    if (incidentData) {
      if (masterData?.genderList) {
        const genderTypeLabel = masterData.genderList.find((option) => option.value === incidentData.gender)?.label || '';
        setGenderTypeLabel(genderTypeLabel);
      }
      if (masterData?.firstAidList) {
        const firstAidLabel = masterData.firstAidList.find((option) => option.value === incidentData.firstAidType)?.label || '';
        setFirstAidLabel(firstAidLabel);
      }
      if (globalMasterData?.optionList) {
        const workInformLabel = globalMasterData.optionList.find((option) => option.value === incidentData.workInform)?.label || '';
        setWorkInformLabell(workInformLabel);
      }
      if (globalMasterData?.optionList) {
        const anyInjuryLabel = globalMasterData.optionList.find((option) => option.value === incidentData.anyInjury)?.label || '';
        setAnyInjuryLabel(anyInjuryLabel);
      }
    }
  }, [incidentData, masterData,globalMasterData]);

  const renderField = (label: string, value: string | undefined) => {
    return (<Text size="1">
      {label}:{' '}
      <Text size="1" weight="bold">
        {value || '---'}
      </Text>
    </Text>)
  }

  const renderReportDetails = () => {
    const badge = badgeConfig[selectedData?.reportType] || badgeConfig.UNKNOWN;
    return (<Flex direction="column">
      <Text size="1">
        Status:{' '}
        <Badge
          color={colorSelectorByStatusName(selectedData.statusName ?? '')}
          variant="soft"
        >
          <Text size="1" weight="bold">
            {selectedData.statusName}
          </Text>
        </Badge>
      </Text>
      <Text size="1" className='my-1'>
        Report Type:{' '}
        <Badge
          color={badge.color}
          variant="soft"
        >
          <Text size="1" weight="bold">
            {badge.label}
          </Text>
        </Badge>
      </Text>
      {renderField('Created By:', selectedData?.createdBy)}
      {renderField('Created Date:', selectedData?.createdDate)}
    </Flex>)
  };

  const renderEmployeeDetails = () => (
    <Flex direction="column">
      {renderField('Employee Name:', selectedData?.empName)}
      {renderField('Depot:', selectedData?.depotName)}
      {renderField('Department:', selectedData?.department)}
      {renderField('Supervisor:', selectedData?.eventSupervisor)}
    </Flex>
  );

  const renderWorkAndContactDetails = () => (
    <Flex direction="column">
      {renderField('Occupation', incidentData?.occupation)}
      {renderField('Gender', genderTypeLabel)}
      {renderField('Personal Phone No', incidentData?.homePhone)}
      {renderField('Personal Email', incidentData?.personalEmail)}
    </Flex>
  );

  const renderIncidentDetails = () => (
    <Flex direction="column">
      {renderField('Incident Date & Time', incidentData?.eventOn)}
      {renderField('Place of Incident', incidentData?.accidentPlace)}
      {renderField('Job Performed', incidentData?.jobPerformed)}
      {renderField('Description of the Incident', incidentData?.eventDesc)}
      {renderField('Any Injury', anyInjuryLabel)}
      {renderField('Employee Name', incidentData?.eventEmpName)}
      {renderField('Incident Log On Date', truncateTimeFromDateString(incidentData?.eventLogOn ?? ''))}
    </Flex>
  );

  const renderCorrectiveActionDetails = () => (
    <Flex direction="column">
      {renderField('Immediate corrective action taken', incidentData?.immCorrectAction)}
      {renderField('Action Completed On', truncateTimeFromDateString(incidentData?.completeOn ?? ''))}
      {renderField('Supervisor', incidentData?.supervisor)}
      {renderField('Date', truncateTimeFromDateString(incidentData?.supervisorOn ?? ''))}
      {renderField('Manager\'s Name', incidentData?.manager)}
      {renderField('Date', truncateTimeFromDateString(incidentData?.managerOn ?? ''))}
      {renderField('Manager\'s Comments', incidentData?.managerComm)}
    </Flex>
  )


  return !selectedIncident || selectedIncident.incidentId === 0 ? (
    <Flex gap="3" direction="column" width="100%" maxWidth="400px" height="100%">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Flex direction="column" p="4" align="center">
          <img src="./assets/quick-view-img.svg" alt="Cookers" width="200px" />
          <Heading size="4" mb="3" color="indigo">
            Incident Quick View
          </Heading>
          <Text color="gray" size="1">
            Select an Incident to view in quick view
          </Text>
        </Flex>
      </div>
    </Flex>
  ) : (
    <Flex gap="3" direction="column" width="100%" maxWidth="400px" height="100%">
      <div style={{ overflow: 'auto', flexGrow: '1' }}>
        <ScrollArea type="auto" scrollbars="vertical">
          <Flex gap="3" direction="column" p="4">
            <Heading size="4" mb="2" color="indigo">
              Incident Quick View
            </Heading>

            <Heading size="2"></Heading>
              <Flex direction="column">
                <Heading className='mb-3' size="1">
                  Report # <Badge variant="soft" color="indigo" radius="full">{selectedData.refCode}</Badge>
                </Heading>
                {/* <Text size="1">
                  Status:{' '}
                  <Badge
                    color={colorSelectorByStatusName(selectedData.statusName ?? '')}
                    variant="soft"
                  >
                    <Text size="1" weight="bold">
                      {selectedData.statusName}
                    </Text>
                  </Badge>
                </Text>
                <Text size="1">Report Type: {selectedData.reportTypeName}</Text>
              <Text size="1">Created By: {selectedData.createdBy}</Text>
              <Text size="1">Created Date: {selectedData.createdDate}</Text> */}
                {renderReportDetails()}
                {incidentData?.worksite && <Text size="1">Worksite: {incidentData?.worksite}</Text>}
              </Flex>
            <Separator orientation="horizontal" size="4" color="indigo" />

            <Flex direction="column">
              <Heading size="2">Employee Details</Heading>
              {renderEmployeeDetails()}
            </Flex>

            <Separator orientation="horizontal" size="4" color="indigo" />
          {!isVisible && loadVisible && (
            <Flex direction="column">
              <Button size="1" variant="solid" onClick={handleLoad}>
                Show More
              </Button>
            </Flex>
          )}

          

          {loadMore && (
              <Flex gap="3" direction="column">
                <Flex direction="column">
                  <Heading size="2">Work and Contact Details</Heading>

                  {/* <Text size="1">Occupation: {incidentData?.occupation}</Text>
                <Text size="1">Gender: {genderTypeLabel}</Text>
                <Text size="1">Personal Phone No: {incidentData?.homePhone}</Text>
                <Text size="1">Personal Email: {incidentData?.personalEmail}</Text> */}
                  {renderWorkAndContactDetails()}
                </Flex>
              <Separator orientation="horizontal" size="4" color="indigo" />
                <Flex direction="column">
                  <Heading size="2">Incident Details</Heading>
                  {/* <Text size="1">Incident Date & Time: {incidentData?.eventOn}</Text>
                <Text size="1">Place of Incident: {incidentData?.accidentPlace}</Text>
                <Text size="1">Job Performed: {incidentData?.jobPerformed}</Text>
                <Text size="1">Description of the Incident:{incidentData?.eventDesc} </Text>
                <Text size="1">Any Injury:{anyInjuryLabel} </Text>
                <Text size="1">Employee Name: {incidentData?.eventEmpName}</Text>
                <Text size="1">Incident Log On Date: {truncateTimeFromDateString(incidentData?.eventLogOn ?? '')}</Text> */}
                  {renderIncidentDetails()}
                </Flex>
              
              <Separator orientation="horizontal" size="4" color="indigo" />
              {(selectedData.reportType == 'INJU' || anyInjuryLabel == 'Yes') && (
                <Flex direction="column">
                  <Heading size="2">Injury Details</Heading>
                  <Text size="1">First Aider Name: {incidentData?.firstAider}</Text>
                  <Text size="1">Injury Reported At: {incidentData?.injuryReportedOn}</Text>
                  <Text size="1">Injury Details: {incidentData?.injuryNature}</Text>
                  {!incidentData?.doctor?.trim() && <Text size="1">First Aid: {firstAidLabel}</Text>}
                  {incidentData?.doctor?.trim() && <Text size="1">Sent to DR: {incidentData?.doctor}</Text>}
                  {incidentData?.doctor?.trim() && <Text size="1">Hospital: {incidentData?.hospital}</Text>}
                  <Text size="1">Treatment: {incidentData?.treatment}</Text>
                  {selectedData.reportType == 'INJU' && <Text size="1">Is Work Covered Informed/Involved? {workInformLabel}</Text>}
                  {selectedData.reportType == 'INJU' && workInformLabel == 'Yes' && (
                    <Text size="1">Date Informed? {truncateTimeFromDateString(incidentData?.informDate ?? '')}</Text>
                  )}
                 {/* <Text size="1">First Aider or Manager Name: {incidentData?.aiderName}</Text>
                  <Text size="1">Date: {truncateTimeFromDateString(incidentData?.firstAidOn ?? '')}</Text> */}
                </Flex>
              )}
              {selectedData.reportType == 'INJU' && <Separator orientation="horizontal" size="4" color="indigo" />}
            
                <Flex direction="column">
                  <Heading size="2">Corrective Action Details</Heading>
                  {/* <Text size="1">Immediate corrective action taken: {incidentData?.immCorrectAction}</Text>
                  <Text size="1">Action Completed On: {truncateTimeFromDateString(incidentData?.completeOn ?? '')}</Text>
                  <Text size="1">Supervisor: {incidentData?.supervisor}</Text>
                  <Text size="1">Date: {truncateTimeFromDateString(incidentData?.supervisorOn ?? '')}</Text>
                  <Text size="1">Manager's Name: {incidentData?.manager}</Text>
                  <Text size="1">Date: {truncateTimeFromDateString(incidentData?.managerOn ?? '')}</Text>
                  <Text size="1">Manager's Comments: {incidentData?.managerComm}</Text>
                   */}
                  {renderCorrectiveActionDetails()}
                </Flex>

              </Flex>
          )}
          </Flex>
        </ScrollArea>
      </div>
    </Flex>
  );
};
