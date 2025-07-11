import { STORE, useStoreSelector } from '@cookers/store';
import { Badge, Button, Flex, Heading, ScrollArea, Separator, Text } from '@radix-ui/themes';
import React, { useEffect, useMemo, useState } from 'react';
import { FormButton } from '@cookers/ui';
import { fetchSupplierNcrViewData } from '../../queries/use-supplier-ncr-quick-view';
import { SupplierNcrView } from '@cookers/models';
import { colorSelectorByStatusName } from '../../util/supplierNcrUtils';

export const SupplierNcrQuickView: React.FC = () => {
  const { selectedSupplierNcr,masterData } = useStoreSelector(STORE.SupplierNcr);
  const [supplierNcrData, setSupplierNcrData] = useState<SupplierNcrView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadVisible, setLoadVisible] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  console.log(selectedSupplierNcr);
  const isVisible = useMemo(() => {
    return !selectedSupplierNcr || Object.keys(selectedSupplierNcr).length === 0 || selectedSupplierNcr.supplierNcrId === 0;
  }, [selectedSupplierNcr]);

  const handleLoad = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSupplierNcrViewData(selectedSupplierNcr?.supplierNcrId || 0);
      setSupplierNcrData(data);
      setLoadVisible(false);
      setLoadMore(true);
    } catch (err: any) {
      setError(err.message || 'Error loading incident data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSupplierNcr) {
      setLoadVisible(true);
      setLoadMore(false);
    }
  }, [selectedSupplierNcr]);

  const renderField = (label:string, value:string | undefined) => {
    return (<Text size="1">
      {label}:{' '}
      <Text size="1" weight="bold">
        {value || '---'}
      </Text>
    </Text>)
  }
  

  const renderSupplierDetails = () => (
    <Flex direction="column">
      <Text size="1">
        Status:{' '}
        <Badge color={colorSelectorByStatusName(selectedSupplierNcr.statusName ?? '')} variant="soft">
          <Text size="1" weight="bold">
            {selectedSupplierNcr.statusName}
          </Text>
        </Badge>
      </Text>
      {renderField('Raised Date', selectedSupplierNcr.createdDate)}
      {renderField('Supplier Name', selectedSupplierNcr.supplierName)}
      {renderField('Product', selectedSupplierNcr.productName)}
      {renderField('Classification', selectedSupplierNcr.classificationName)}
      {renderField('Depot', selectedSupplierNcr.depotName)}
    </Flex>
  );

  const renderLoadMoreSection = () => {
    return (
      <Flex direction="column">
        {renderField('Raised by', supplierNcrData?.raisedByName)}
        {renderField('Reason for Non-Conformance', supplierNcrData?.reason)}
        {renderField('Immediate Action Required', supplierNcrData?.immActionDesc)}
      </Flex>
    );
  };

  const renderCloseoutDetails = () => (
    <Flex direction="column">
      <Heading size="2">Close Out Details</Heading>
      {renderField('Investigation', supplierNcrData?.rootCause)}
      {renderField('Corrective Action', supplierNcrData?.corrActionDesc)}
      {renderField('Preventative Action', supplierNcrData?.preventiveAction)}
      {renderField('Supplier Name', supplierNcrData?.suppRespBy)}
      {renderField('Supplier Title', supplierNcrData?.suppRespTitle)}
      {renderField('Supplier Response Date', supplierNcrData?.suppRespOn)}
      {renderField('Further Actions', supplierNcrData?.anyFurtherAction)}
      {renderField('By When', supplierNcrData?.closeOutCommOn)}
      {renderField('Comments', supplierNcrData?.closeOutComm)}
      {renderField('Date Completed', supplierNcrData?.closeOutOn)}
    </Flex>
  );

  return isVisible ? (
    <Flex gap="3" direction="column" width="100%" maxWidth="400px" height="100%">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Flex direction="column" p="4" align="center">
          <img src="./assets/quick-view-img.svg" alt="Cookers" width="200px" />
          <Heading size="4" mb="3" color="indigo">
            Supplier NCR Quick View
          </Heading>
          <Text color="gray" size="1">
            Select a Supplier NCR to view
          </Text>
        </Flex>
      </div>
    </Flex>
  ) : (
    <Flex gap="3" direction="column" width="100%" maxWidth="400px">
      <ScrollArea type="auto" scrollbars="vertical">
        <Flex gap="3" direction="column" p="4">
          <Heading size="4">Supplier NCR Quick View</Heading>
          <Heading size="2">
            Log # <Badge variant="soft">{selectedSupplierNcr.refCode}</Badge>
          </Heading>
          {renderSupplierDetails()}
          <Separator orientation="horizontal" size="4" color="indigo" />
          {!isVisible && loadVisible && (
            <Button size="1" onClick={handleLoad}>
              Show More
            </Button>
          )}

          {loadMore && renderLoadMoreSection()}
          {loadMore && <Separator orientation="horizontal" size="4" color="indigo" />}
          {loadMore &&  renderCloseoutDetails()}
        </Flex>
      </ScrollArea>
    </Flex>
  );
};

export default SupplierNcrQuickView;
