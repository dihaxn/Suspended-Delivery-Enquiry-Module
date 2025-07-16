import { useMemo } from 'react';
import { STORE, useStoreSelector } from '@cookers/store';
import { Badge ,Flex, Heading, ScrollArea, Text } from '@radix-ui/themes';

export const SuspendedDeliveryQuickView = () => {
  // Use quickview from SuspendedDelivery slice
  const { quickview } = useStoreSelector(STORE.SuspendedDelivery);

  console.log(quickview);
  const isVisible = useMemo(() => {
    return !quickview || Object.keys(quickview).length === 0 || quickview.customerCode === '';
  }, [quickview]);

  const renderField = (label:string, value:string |number| undefined) => {
    return (<Text size="1">
      {label}:{' '}
      <Text size="1" weight="bold">
        {value || '---'}
      </Text>
    </Text>)
  }

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
            Customer Code <Badge variant="soft">{quickview.customerCode}</Badge>
          </Heading>
          <Flex direction="column">
            {renderField('Customer Name', quickview.customerName)}
            {renderField('Cust Group', quickview.custGroup)}
            {renderField('ETA for return - Fresh', quickview.ETAfresh?.toString())}
            {renderField('ETA for return - UCO', quickview.ETAUCO?.toString())}
            {renderField('BDM Code', quickview.BDMCode)}
            {renderField('Carrier Code', quickview.carrierCode)}
            {renderField('Contact', quickview.contact)}
            {renderField('Phone', quickview.phone)}
            {renderField('Mobile', quickview.mobile)}
            {renderField('Email Address', quickview.email)}
            {renderField('Suspension Comment', quickview.suspensionComments)}
          </Flex>
        </Flex>
      </ScrollArea>
    </Flex>
  );
};

export default SuspendedDeliveryQuickView;