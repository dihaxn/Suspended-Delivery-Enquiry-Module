import { STORE, useStoreSelector } from '@cookers/store';
import { Badge, Flex, Heading, ScrollArea, Separator, Text } from '@radix-ui/themes';
import React, { useEffect, useMemo, useState } from 'react';
import { SuspendedDeliveryList } from '@cookers/models';


export const SuspendedDeliveryQuickView: React.FC = () => {
  const { quickview  } = useStoreSelector(STORE.SuspendedDelivery);
  const [suspendedDeliveryData, setSuspendedDeliveryData] = useState<SuspendedDeliveryList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadVisible, setLoadVisible] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const isVisible = useMemo(() => {
    return !quickview || Object.keys(quickview).length === 0 || quickview.customerCode === '';
  }, [quickview]);

  // const handleLoad = async () => {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     const data = await fetchSuspendedDeliveryViewData(quickview?.customerCode || "0 ");
  //     setSuspendedDeliveryData(data);
  //     setLoadVisible(false);
  //     setLoadMore(true);
  //   } catch (err: any) {
  //     setError(err.message || 'Error loading order data');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    if (quickview) {
      setLoadVisible(true);
      setLoadMore(false);
    }
  }, [quickview]);

  const renderField = (label: string, value: string | undefined) => {
    return (
      <Text size="1">
        {label}:{' '}
        <Text size="1" weight="bold">
          {value || '---'}
        </Text>
      </Text>
    );
  };

  const renderSuspendedDeliveryDetails = () => (
    <Flex direction="column">
      <Heading size="2">Suspended Delivery Details</Heading>
          {renderField('Customer Name', quickview?.customerName)}
          {renderField('Cust Group', quickview?.custGroup)}
          {renderField('ETA for return - Fresh', quickview?.ETAFresh)}
          {renderField('ETA for return - UCO', quickview?.ETAUCO)}
          {renderField('BDM Code', quickview?.BDMCode)}         
          {renderField('Carrier Code', quickview?.carrierCode)}
          {renderField('Contact', quickview?.contact)}
          {renderField('Phone', quickview?.phone)}       
          {renderField('Mobile', quickview?.mobile)}
          {renderField('Email Address', quickview?.email)}
          {renderField('Suspension Comment', quickview?.suspensionComments)}
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
            Select a Suspended Delivery to view
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
            Customer Code <Badge variant="soft">{quickview?.customerCode}</Badge>
          </Heading>
          {renderSuspendedDeliveryDetails()}
          <Separator orientation="horizontal" size="4" color="indigo" />
        </Flex>
      </ScrollArea>
    </Flex>
  );
};

export default SuspendedDeliveryQuickView;


