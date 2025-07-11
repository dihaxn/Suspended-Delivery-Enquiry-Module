import { useMemo } from 'react';
import { STORE, useStoreSelector } from '@cookers/store';
import { Badge, Button, Flex, Heading, ScrollArea, Separator, Text } from '@radix-ui/themes';






export const CarrierQuickView = () => {
   const { selectedCarrier } = useStoreSelector(STORE.CarrierMaster);
  
  console.log(selectedCarrier);
  const isVisible = useMemo(() => {
    return !selectedCarrier || Object.keys(selectedCarrier).length === 0 || selectedCarrier.carrierCode === '';
  }, [selectedCarrier]);


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
            Carrier Quick View
          </Heading>
          <Text color="gray" size="1">
            Select a Carrier to view
          </Text>
        </Flex>
      </div>
    </Flex>
  ) : (
    <Flex gap="3" direction="column" width="100%" maxWidth="400px">
      <ScrollArea type="auto" scrollbars="vertical">
        <Flex gap="3" direction="column" p="4">
          <Heading size="4">Carrier Master Quick View</Heading>
          <Heading size="2">
            Carrier Code <Badge variant="soft">{selectedCarrier.carrierCode}</Badge>
          </Heading>
          <Flex direction="column">
            {renderField('Name', selectedCarrier.name)}
          {renderField('Depot', selectedCarrier.depotName)}
          {renderField('Truck Type', selectedCarrier.truckTypeName)}
          {renderField('Rego No', selectedCarrier.regoNo)}
          {renderField('Driver Name', selectedCarrier.driverName)}
          {renderField('Employee No', selectedCarrier.employeeNo)}
          {renderField('Contact', selectedCarrier.contact)}
          {renderField('Auto Runsheet Sequence', (selectedCarrier.autoSequenceFlag===1?'Yes':'No'))}
          {renderField('Remarks', selectedCarrier.remarks)}
           
    </Flex>
         
        </Flex>
      </ScrollArea>
    </Flex>
  );
};

