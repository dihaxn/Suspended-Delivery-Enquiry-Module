import * as React from 'react';
import { STORE, useStoreSelector } from '@cookers/store';
import { Badge, Button, Flex, Heading, ScrollArea, Separator, Text } from '@radix-ui/themes';
import { SuspendedDeliveryRecord } from '@cookers/store';
import { useEffect, useMemo, useState } from 'react';
import { selectSuspendedDeliveryState } from '@cookers/store';
import { useSelector } from 'react-redux';

// Extended interface for detailed suspended delivery view
interface SuspendedDeliveryView {
  // Address Information
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  territory?: string;
  region?: string;

  // Financial Information
  creditLimit?: number;
  outstandingBalance?: number;
  paymentTerms?: string;
  accountStatus?: string;
  riskLevel?: string;

  // Order History
  lastOrderDate?: string;
  lastDeliveryDate?: string;
  averageOrderValue?: number;
  totalOrdersYTD?: number;

  // Suspension Details
  suspendedSince?: string;
  suspendedBy?: string;
  suspendReason?: string;
  reactivationDate?: string;

  // Contact Management
  lastContactDate?: string;
  nextFollowUpDate?: string;
  specialInstructions?: string;
  deliveryNotes?: string;

  // ETA Details
  etaFreshStatus?: string;
  etaUcoStatus?: string;
  etaFreshLastUpdate?: string;
  etaUcoLastUpdate?: string;
  estimatedReactivation?: string;

  // Internal Notes
  internalNotes?: string;
}

// Mock API function - replace with actual API call
const fetchSuspendedDeliveryViewData = async (custCode: string): Promise<SuspendedDeliveryView> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    address: '123 Business Street, Suite 100',
    city: 'Business City',
    postalCode: '12345',
    country: 'United States',
    territory: 'North Region',
    region: 'Northeast',
    creditLimit: 50000,
    outstandingBalance: 12500,
    paymentTerms: 'Net 30',
    accountStatus: 'Suspended',
    riskLevel: 'Medium',
    lastOrderDate: '2023-12-15',
    lastDeliveryDate: '2023-12-18',
    averageOrderValue: 2500,
    totalOrdersYTD: 45,
    suspendedSince: '2024-01-01',
    suspendedBy: 'Admin User',
    suspendReason: 'Credit limit exceeded',
    reactivationDate: '2024-02-01',
    lastContactDate: '2024-01-10',
    nextFollowUpDate: '2024-01-25',
    specialInstructions: 'Contact finance before reactivation',
    deliveryNotes: 'Delivery between 9 AM - 5 PM only',
    etaFreshStatus: 'Pending',
    etaUcoStatus: 'Confirmed',
    etaFreshLastUpdate: '2024-01-12',
    etaUcoLastUpdate: '2024-01-13',
    estimatedReactivation: '2024-02-01',
    internalNotes: 'Customer is working on payment plan. Finance team has been notified about the outstanding balance.'
  };
};

// Status color selector function
const colorSelectorByStatusName = (statusName: string) => {
  switch (statusName.toLowerCase()) {
    case 'active':
      return 'green';
    case 'suspended':
      return 'red';
    case 'pending':
      return 'yellow';
    case 'confirmed':
      return 'blue';
    case 'medium':
      return 'yellow';
    case 'high':
      return 'red';
    case 'low':
      return 'green';
    default:
      return 'gray';
  }
};

export const SuspendedDeliveryQuickView: React.FC = () => {
  const suspendedDeliveryState = useSelector(selectSuspendedDeliveryState);
  const selectedRecord = suspendedDeliveryState.records?.[0]; // or implement your own selection logic
  const [suspendedDeliveryData, setSuspendedDeliveryData] = useState<SuspendedDeliveryView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadVisible, setLoadVisible] = useState(true);
  const [loadMore, setLoadMore] = useState(false);

  const isVisible = useMemo(() => {
    const result = !selectedRecord || Object.keys(selectedRecord).length === 0 || !selectedRecord.custCode;
    return result;
  }, [selectedRecord]);

  const handleLoad = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      const data = await fetchSuspendedDeliveryViewData(selectedRecord?.custCode || '');
      setSuspendedDeliveryData(data);
      setLoadVisible(false);
      setLoadMore(true);
    } catch (err: any) {
      setError('Failed to load suspended delivery details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRecord) {
      setLoadVisible(true);
      setLoadMore(false);
    }
  }, [selectedRecord]);

  const renderField = (label: string, value: string | number | undefined) => (
    <Text size="1">
      {label}:{' '}
      <Text size="1" weight="bold">
        {value || '---'}
      </Text>
    </Text>
  );

  const renderBasicDetails = () => (
    <Flex direction="column">
      <Text size="1">
        Status:{' '}
        <Badge color={colorSelectorByStatusName(suspendedDeliveryData?.accountStatus || selectedRecord?.custGroup || '')} variant="soft">
          <Text size="1" weight="bold">
            {suspendedDeliveryData?.accountStatus || selectedRecord?.custGroup || 'Unknown'}
          </Text>
        </Badge>
      </Text>
      {renderField('Customer Code', selectedRecord?.custCode)}
      {renderField('Customer Name', selectedRecord?.name)}
      {renderField('Customer Group', selectedRecord?.custGroup)}
      {renderField('Representative', selectedRecord?.repCode)}
      {renderField('Carrier', selectedRecord?.carrierCode)}
      {renderField('Contact Person', selectedRecord?.contact)}
      {renderField('Telephone', selectedRecord?.telephone)}
      {renderField('Mobile', selectedRecord?.mobile)}
      {renderField('Email', selectedRecord?.email)}
      {selectedRecord?.etaFresh && renderField('ETA Fresh', selectedRecord.etaFresh)}
      {selectedRecord?.etaUco && renderField('ETA UCO', selectedRecord.etaUco)}
    </Flex>
  );

  const renderShowMore = () => (
    <Flex direction="column">
      {renderField('Address', suspendedDeliveryData?.address)}
      {renderField('City', suspendedDeliveryData?.city)}
      {renderField('Postal Code', suspendedDeliveryData?.postalCode)}
      {renderField('Country', suspendedDeliveryData?.country)}
      {renderField('Territory', suspendedDeliveryData?.territory)}
      {renderField('Region', suspendedDeliveryData?.region)}
    </Flex>
  );

  const renderFinancialDetails = () => (
    <Flex direction="column">
      <Heading size="2">Financial Information</Heading>
      {renderField('Credit Limit', suspendedDeliveryData?.creditLimit ? `$${suspendedDeliveryData.creditLimit.toLocaleString()}` : undefined)}
      {renderField('Outstanding Balance', suspendedDeliveryData?.outstandingBalance ? `$${suspendedDeliveryData.outstandingBalance.toLocaleString()}` : undefined)}
      {renderField('Payment Terms', suspendedDeliveryData?.paymentTerms)}
      <Text size="1">
        Risk Level:{' '}
        <Badge color={colorSelectorByStatusName(suspendedDeliveryData?.riskLevel || '')} variant="soft">
          <Text size="1" weight="bold">
            {suspendedDeliveryData?.riskLevel || '---'}
          </Text>
        </Badge>
      </Text>
    </Flex>
  );

  const renderOrderHistory = () => (
    <Flex direction="column">
      <Heading size="2">Order History</Heading>
      {renderField('Last Order Date', suspendedDeliveryData?.lastOrderDate)}
      {renderField('Last Delivery Date', suspendedDeliveryData?.lastDeliveryDate)}
      {renderField('Average Order Value', suspendedDeliveryData?.averageOrderValue ? `$${suspendedDeliveryData.averageOrderValue.toLocaleString()}` : undefined)}
      {renderField('Total Orders YTD', suspendedDeliveryData?.totalOrdersYTD?.toString())}
    </Flex>
  );

  const renderSuspensionDetails = () => (
    <Flex direction="column">
      <Heading size="2">Suspension Information</Heading>
      {renderField('Suspended Since', suspendedDeliveryData?.suspendedSince)}
      {renderField('Suspended By', suspendedDeliveryData?.suspendedBy)}
      {renderField('Suspend Reason', suspendedDeliveryData?.suspendReason)}
      {renderField('Reactivation Date', suspendedDeliveryData?.reactivationDate)}
      {renderField('Suspend Comments', selectedRecord?.suspendComments)}
      {renderField('Last Contact Date', suspendedDeliveryData?.lastContactDate)}
      {renderField('Next Follow-up Date', suspendedDeliveryData?.nextFollowUpDate)}
      {renderField('Special Instructions', suspendedDeliveryData?.specialInstructions)}
      {renderField('Delivery Notes', suspendedDeliveryData?.deliveryNotes)}
    </Flex>
  );

  const renderETADetails = () => (
    <Flex direction="column">
      <Heading size="2">ETA Status Updates</Heading>
      <Text size="1">
        ETA Fresh Status:{' '}
        <Badge color={colorSelectorByStatusName(suspendedDeliveryData?.etaFreshStatus || '')} variant="soft">
          <Text size="1" weight="bold">
            {suspendedDeliveryData?.etaFreshStatus || '---'}
          </Text>
        </Badge>
      </Text>
      <Text size="1">
        ETA UCO Status:{' '}
        <Badge color={colorSelectorByStatusName(suspendedDeliveryData?.etaUcoStatus || '')} variant="soft">
          <Text size="1" weight="bold">
            {suspendedDeliveryData?.etaUcoStatus || '---'}
          </Text>
        </Badge>
      </Text>
      {renderField('ETA Fresh Last Update', suspendedDeliveryData?.etaFreshLastUpdate)}
      {renderField('ETA UCO Last Update', suspendedDeliveryData?.etaUcoLastUpdate)}
      {renderField('Estimated Reactivation', suspendedDeliveryData?.estimatedReactivation)}
    </Flex>
  );

  const renderInternalNotes = () => (
    <Flex direction="column">
      <Heading size="2">Internal Notes</Heading>
      <Text size="1" style={{ backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px', border: '1px solid #e9ecef' }}>
        {suspendedDeliveryData?.internalNotes || 'No internal notes available'}
      </Text>
    </Flex>
  );

  return isVisible ? (
    <Flex gap="3" direction="column" width="100%" maxWidth="400px" height="100%">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Flex direction="column" p="4" align="center">
          <img src="./assets/quick-view-img.svg" alt="Cookers" width="200px" />
          <Heading size="4" mb="3" color="indigo">
            Suspended Delivery Quick View
          </Heading>
          <Text color="gray" size="1">
            Select a Suspended Delivery record to view
          </Text>
        </Flex>
      </div>
    </Flex>
  ) : (
    <Flex gap="3" direction="column" width="100%" maxWidth="400px">
      <ScrollArea type="auto" scrollbars="vertical">
        <Flex gap="3" direction="column" p="4">
          <Heading size="4">Suspended Delivery Quick View</Heading>
          <Heading size="2">
            Customer # <Badge variant="soft">{selectedRecord?.custCode}</Badge>
          </Heading>
          {renderBasicDetails()}
          <Separator orientation="horizontal" size="4" color="indigo" />
          {loadVisible && (
            <Button size="1" onClick={handleLoad} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Show More'}
            </Button>
          )}

          {error && (
            <Text size="1" color="red">
              {error}
            </Text>
          )}

          {loadMore && renderShowMore()}
          {loadMore && <Separator orientation="horizontal" size="4" color="indigo" />}
          {loadMore && renderFinancialDetails()}
          {loadMore && <Separator orientation="horizontal" size="4" color="indigo" />}
          {loadMore && renderOrderHistory()}
          {loadMore && <Separator orientation="horizontal" size="4" color="indigo" />}
          {loadMore && renderSuspensionDetails()}
          {loadMore && <Separator orientation="horizontal" size="4" color="indigo" />}
          {loadMore && renderETADetails()}
          {loadMore && <Separator orientation="horizontal" size="4" color="indigo" />}
          {loadMore && renderInternalNotes()}
        </Flex>
      </ScrollArea>
    </Flex>
  );
};

export default SuspendedDeliveryQuickView;
