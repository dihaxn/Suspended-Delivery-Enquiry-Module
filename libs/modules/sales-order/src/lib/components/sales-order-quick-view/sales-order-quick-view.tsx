import { STORE, useStoreSelector } from '@cookers/store';
import { Badge, Button, Flex, Heading, ScrollArea, Separator, Text } from '@radix-ui/themes';
import React, { useEffect, useMemo, useState } from 'react';
import { FormButton } from '@cookers/ui';
import { fetchSalesOrderViewData } from '../../queries/use-sales-order-quick-view';
import { SalesOrderView } from '@cookers/models';
import { colorSelectorByStatusName } from '../utils';

export const SalesOrderQuickView: React.FC = () => {
  const { selectedSalesOrder, masterData } = useStoreSelector(STORE.SalesOrder);
  const [salesOrderData, setSalesOrderData] = useState<SalesOrderView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadVisible, setLoadVisible] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const isVisible = useMemo(() => {
    return !selectedSalesOrder || Object.keys(selectedSalesOrder).length === 0 || selectedSalesOrder.sOrderNo === 0;
  }, [selectedSalesOrder]);

  const handleLoad = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSalesOrderViewData(selectedSalesOrder?.sOrderNo || 0);
      setSalesOrderData(data);
      setLoadVisible(false);
      setLoadMore(true);
    } catch (err: any) {
      setError(err.message || 'Error loading order data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSalesOrder) {
      setLoadVisible(true);
      setLoadMore(false);
    }
  }, [selectedSalesOrder]);

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

  const renderOrderDetails = () => (
    <Flex direction="column">
      <Heading size="2">Order Details</Heading>
      <Text size="1">
        Status:{' '}
        <Badge color={colorSelectorByStatusName(selectedSalesOrder.statusName ?? '')} variant="soft">
          <Text size="1" weight="bold">
            {selectedSalesOrder.statusName}
          </Text>
        </Badge>
      </Text>
      {selectedSalesOrder?.pListNo != 0 && renderField('A.T.D', selectedSalesOrder.pListNo?.toString())}
      {renderField('Customer Code', selectedSalesOrder.custCode)}
      {renderField('Customer Name', selectedSalesOrder.customerName?.trim())}
      {renderField('BDM', selectedSalesOrder.repName)}
    </Flex>
  );

  const renderLoadMoreOrderDetails = () => {
    return (
      <Flex direction="column">
      {renderField('Date Ordered', salesOrderData?.orderHeader?.orderDate)}
      {renderField('Customer Order No', salesOrderData?.orderHeader?.custOrderNo.trim())}
      </Flex>
    );
  };
  const renderLoadMoreSection = () => {
    return (
      <Flex direction="column">
        <Heading size="2">Product Details</Heading>
        {renderField('Product', salesOrderData?.orderDetailList?.[0]?.catlogCode.trim())}
        {renderField('Description', salesOrderData?.orderDetailList?.[0]?.catlogName.trim())}
        {renderField('Market', salesOrderData?.orderDetailList?.[0]?.marketDesc)}
        {renderField('Depot', salesOrderData?.orderDetailList?.[0]?.depotName)}
        {renderField('UOM', salesOrderData?.orderDetailList?.[0]?.uomOrder)}
        {renderField('QTY', salesOrderData?.orderDetailList?.[0]?.orderQty?.toString())}
        {renderField('Price', salesOrderData?.orderDetailList?.[0]?.price?.toFixed(2).toString())}
        {renderField('Net Amount', salesOrderData?.orderDetailList?.[0]?.netAmount?.toFixed(2).toString())}
        {renderField('Date Required', salesOrderData?.orderDetailList?.[0]?.dateRequired)}
        {renderField('Day of Week', new Date(salesOrderData?.orderDetailList?.[0]?.dateRequired + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' }))}
        {selectedSalesOrder?.pListNo == 0 && renderField('Interval', salesOrderData?.orderDetailList?.[0]?.payPeriodCode?.toString())}
      </Flex>
    );
  };
  const renderOtherDetails = () => {
    return (
      <Flex direction="column">
        <Heading size="2">Other Details</Heading>
        {renderField('Carrier', salesOrderData?.orderHeader?.carrierCode)}
        {renderField('Special Instruction', salesOrderData?.specialInst)}
        {salesOrderData?.isOneOff == true && renderField('One-Off Reason', salesOrderData?.orderHeader?.reason)}
      </Flex>
    );
  };

  return isVisible ? (
    <Flex gap="3" direction="column" width="100%" maxWidth="400px" height="100%">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Flex direction="column" p="4" align="center">
          <img src="./assets/quick-view-img.svg" alt="Cookers" width="200px" />
          <Heading size="4" mb="3" color="indigo">
            Order Quick View
          </Heading>
          <Text color="gray" size="1">
            Select a Order to view
          </Text>
        </Flex>
      </div>
    </Flex>
  ) : (
    <Flex gap="3" direction="column" width="100%" maxWidth="400px">
      <ScrollArea type="auto" scrollbars="vertical">
        <Flex gap="3" direction="column" p="4">
          <Heading size="4">Order Quick View</Heading>
          <Heading size="2">
            Order # <Badge variant="soft">{selectedSalesOrder.sOrderNo}</Badge>
          </Heading>
          {renderOrderDetails()}
          <Separator orientation="horizontal" size="4" color="indigo" />
          {!isVisible && loadVisible && (
            <Button size="1" onClick={handleLoad}>
              Show More
            </Button>
          )}
          {loadMore && renderLoadMoreOrderDetails()}
          {loadMore && <Separator orientation="horizontal" size="4" color="indigo" />}
          {loadMore && renderLoadMoreSection()}
          {loadMore && <Separator orientation="horizontal" size="4" color="indigo" />}
          {loadMore &&  renderOtherDetails()}
        </Flex>
      </ScrollArea>
    </Flex>
  );
};

export default SalesOrderQuickView;