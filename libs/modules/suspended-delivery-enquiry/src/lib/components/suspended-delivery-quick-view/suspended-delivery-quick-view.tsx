import { STORE, useStoreSelector } from '@cookers/store';
import { Badge, Button, Flex, Heading, ScrollArea, Separator, Text } from '@radix-ui/themes';
import React, { useEffect, useMemo, useState } from 'react';
import { CustomerFeedbackView } from '@cookers/models';
import { fetchCustomerFeedbackViewData } from '../../queries/use-customer-feedback-quick-view';
import { colorSelectorByStatusName } from '../utils/customerFeedbackUtils';

export const SuspendedDeliveryQuickView: React.FC = () => {
  const { selectedCustomerFeedback, masterData } = useStoreSelector(STORE.CustomerFeedback);
  const [customerFeedbackData, setCustomerFeedbackData] = useState<CustomerFeedbackView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadVisible, setLoadVisible] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const isVisible = useMemo(() => {
    const result = !selectedCustomerFeedback || Object.keys(selectedCustomerFeedback).length === 0 || selectedCustomerFeedback.complaintId === 0;
    return result;
  }, [selectedCustomerFeedback]);

  const handleLoad = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      const data = await fetchCustomerFeedbackViewData(selectedCustomerFeedback?.complaintId || 0);
      setCustomerFeedbackData(data);
      setLoadVisible(false);
      setLoadMore(true);
    } catch (err: any) {
      setError('Failed to load feedback details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCustomerFeedback) {
      setLoadVisible(true);
      setLoadMore(false);
    }
  }, [selectedCustomerFeedback]);


  const renderField = (label: string, value: string | undefined) => (
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
        <Badge color={colorSelectorByStatusName(selectedCustomerFeedback.statusName ?? '')} variant="soft">
          <Text size="1" weight="bold">
            {selectedCustomerFeedback.statusName}
          </Text>
        </Badge>
      </Text>
      {renderField('Received Date', selectedCustomerFeedback.complaintOnDate)}
      {renderField('Customer Name', selectedCustomerFeedback.customerName)}
      {renderField('Product', selectedCustomerFeedback.catlogName)}
      {renderField('Feedback Classification', selectedCustomerFeedback.feedbackTypeName)}
      {renderField('Depot', selectedCustomerFeedback.depotName)}
    </Flex>
  );

  const renderShowMore = () => (
    <Flex direction="column">
      {renderField('Raised By', customerFeedbackData?.raisedByName)}
      {renderField('Raised Date', customerFeedbackData?.createdOnDate)}
      {renderField('Nature', customerFeedbackData?.natureDesc)}
      {renderField('Issue/Opportunity', customerFeedbackData?.issue)}
    </Flex>
  );

  const renderImmediateActions = () => (
    <Flex direction="column">
      <Heading size="2">Immediate Action</Heading>
      {renderField('Who', customerFeedbackData?.immActionBy)}
      {renderField('When', customerFeedbackData?.immActionOnDate)}
      {renderField('Action Taken', customerFeedbackData?.immediateAction)}
      {renderField('Investigation & Findings', customerFeedbackData?.investigation)}
      {renderField('Corrective Action Taken', customerFeedbackData?.corrActionDesc)}
      {renderField('Preventive Action Taken', customerFeedbackData?.corrActionComplDesc)}
      {renderField('What needs to be done', customerFeedbackData?.corrActionNeedToDo)}
    </Flex>
  );

  const renderCloseOut = () => (
    <Flex direction="column">
      <Heading size="2">Send Close out Response to Customer</Heading>
      {renderField('Close out Response to Customer', customerFeedbackData?.custResComments)}
      {renderField('Sent By', customerFeedbackData?.custResSentBy)}
      {renderField('When', customerFeedbackData?.custResOnDate)}
    </Flex>
  );

  return isVisible ? (
    <Flex gap="3" direction="column" width="100%" maxWidth="400px" height="100%">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Flex direction="column" p="4" align="center">
          <img src="./assets/quick-view-img.svg" alt="Cookers" width="200px" />
          <Heading size="4" mb="3" color="indigo">
            Customer Feedback Quick View
          </Heading>
          <Text color="gray" size="1">
            Select a Customer Feedback to view
          </Text>
        </Flex>
      </div>
    </Flex>
  ) : (
    <Flex gap="3" direction="column" width="100%" maxWidth="400px">
      <ScrollArea type="auto" scrollbars="vertical">
        <Flex gap="3" direction="column" p="4">
          <Heading size="4">Customer Feedback Quick View</Heading>
          <Heading size="2">
            Log # <Badge variant="soft">{selectedCustomerFeedback.refCode}</Badge>
          </Heading>
          {renderBasicDetails()}
          <Separator orientation="horizontal" size="4" color="indigo" />
          {loadVisible && (
            <Button size="1" onClick={handleLoad} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Show More'}
            </Button>
          )}

          {loadMore && renderShowMore()}
          {loadMore && <Separator orientation="horizontal" size="4" color="indigo" />}
          {loadMore && renderImmediateActions()}
          {loadMore && <Separator orientation="horizontal" size="4" color="indigo" />}
          {loadMore && renderCloseOut()}
        </Flex>
      </ScrollArea>
    </Flex>
  );
};

export default SuspendedDeliveryQuickView;
