import { TruckSettingsViewModel } from '@cookers/models';
import { STORE, useStoreSelector } from '@cookers/store';
import { Badge, Button, Flex, Heading, ScrollArea, Separator, Text } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { fetchTruckSettingsFormData } from '../../hooks/use-truck-settings-view-query';
import { truncateTimeFromDateString } from '@cookers/utils';

export const TruckSettingsQuickView = () => {
  const { selectedTruckSetting, masterData } = useStoreSelector(STORE.TruckSettings);
  const [loadVisible, setLoadVisible] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const selectedData = selectedTruckSetting ?? {};
  const [truckSettingsData, setTruckSettingsData] = useState<TruckSettingsViewModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isVisible = selectedData?.truckSettingId == 0;
  const [maintenanceTypeLabel, setMaintenanceTypeLabel] = useState('');
  const [serviceActionLabel, setServiceActionLabel] = useState('');
  const [anyIssueLabel, setAnyIssueLabel] = useState('');

  const handleLoad = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchTruckSettingsFormData(selectedData?.truckSettingId);
      setTruckSettingsData(data); // Save the fetched data in state
      setLoadVisible(false);
      setLoadMore(true);
    } catch (err: any) {
      setError(err.message || 'Error loading truck settings data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reset state values when a new truck setting is selected
    if (selectedTruckSetting) {
      setMaintenanceTypeLabel('');
      setServiceActionLabel('');
      setAnyIssueLabel('');
      setTruckSettingsData(null);
      setLoadVisible(true);
      setLoadMore(false);
    }
  }, [selectedTruckSetting]);

  useEffect(() => {
    if (truckSettingsData) {
      // if (masterData?.truckTypeList) {
      //     const maintenanceTypeLabel = masterData.truckTypeList.find((option) => option.value === truckSettingsData.maintenanceType)?.label || '';
      //     setMaintenanceTypeLabel(maintenanceTypeLabel);
      // }
      // if (masterData?.serviceActionList) {
      //     const serviceActionLabel = masterData.serviceActionList.find((option) => option.value === truckSettingsData.serviceAction)?.label || '';
      //     setServiceActionLabel(serviceActionLabel);
      // }
      // if (masterData?.optionList) {
      //     const anyIssueLabel = masterData.optionList.find((option) => option.value === truckSettingsData.anyIssue)?.label || '';
      //     setAnyIssueLabel(anyIssueLabel);
      // }
    }
  }, [truckSettingsData, masterData]);

  return !selectedTruckSetting || selectedTruckSetting.truckSettingId === 0 ? (
    <Flex gap="3" direction="column" width="100%" maxWidth="400px" height="100%">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Flex direction="column" p="4" align="center">
          <img src="./assets/quick-view-img.svg" alt="Cookers" width="200px" />
          <Heading size="4" mb="3" color="indigo">
            Truck Settings Quick View
          </Heading>
          <Text color="gray" size="1">
            Select an Truck Settings to view in quick view
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
              Truck Settings Quick View
            </Heading>

            <Heading size="2"></Heading>
            <Flex direction="column">
              <Heading size="1">
                Setting Id:{' '}
                <Badge variant="soft" color="indigo" radius="full">
                  {selectedData.settingId}
                </Badge>
              </Heading>
              <Heading size="1">General Settings</Heading>
              <Text size="1">Carrier Code: {selectedData.carrierCode}</Text>
              <Text size="1">Truck Type: {selectedData.truckTypeName}</Text>
              <Text size="1">Auto Sync: {selectedData.pushSync === 'Y' ? 'On' : 'Off'}</Text>
              <Text size="1">Reset Checklist: {selectedData.restChecklist === 'Y' ? 'On' : 'Off'}</Text>
              <Text size="1">Enable Fault Report: {selectedData.faultReportOn === 'Y' ? 'On' : 'Off'}</Text>
              <Text size="1">Test Update: {selectedData.testUpdate === 0 ? 'Off' : 'On'}</Text>
            </Flex>
            <Separator orientation="horizontal" size="4" color="indigo" />
            <Flex direction="column">
              <Heading size="1">Totaliser Settings</Heading>
              <Text size="1">Totaliser Type: {selectedData.totaliserType}</Text>
              {selectedData.truckType === 'WST' && <Text size="1">UCO Truck Capacity: {selectedData.capacity}</Text>}
              {selectedData.truckType !== 'WST' && selectedData.totaliserType !== 'PACK' && (
                <>
                  <Text size="1">Totaliser 1 Oil Code: {selectedData.totaliser1}</Text>
                  <Text size="1">Tank 1 Farm No: {selectedData.tankFarmNo1}</Text>
                  <Text size="1">Totaliser 2 Oil Code: {selectedData.totaliser2}</Text>
                  <Text size="1">Tank 2 Farm No: {selectedData.tankFarmNo2}</Text>
                </>
              )}
            </Flex>
            {selectedData.truckType === 'CKG' && (
              <>
                <Separator orientation="horizontal" size="4" color="indigo" />
                <Flex direction="column">
                  <Heading size="1">Packaged Oil Settings</Heading>
                  <Text size="1">Packaged Oil Code: {selectedData.packagedOilCode}</Text>
                  <Text size="1">Packaged Oil Price: {selectedData.oliveoilPrice}</Text>
                  <Text size="1">Spare Oil Code(Tot 2): {selectedData.spareOilCode}</Text>
                  <Text size="1">Schd. Packed Oil Code 1: {selectedData.schdPackedOidCode1}</Text>
                  <Text size="1">Schd. Packed Oil Code 2: {selectedData.schdPackedOidCode2}</Text>
                  <Text size="1">Schd. Packed Oil Code 3: {selectedData.schdPackedOidCode3}</Text>
                  <Text size="1">Schd. Packed Oil Code 4: {selectedData.schdPackedOidCode4}</Text>
                  <Text size="1">Schd. Packed Oil Code 5: {selectedData.schdPackedOidCode5}</Text>
                </Flex>
              </>
            )}
          </Flex>
        </ScrollArea>
      </div>
    </Flex>
  );
};
