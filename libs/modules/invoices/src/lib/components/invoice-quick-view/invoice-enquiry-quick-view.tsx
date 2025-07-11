import { InvoiceStatus } from '@cookers/models';
import { STORE, useStoreSelector } from '@cookers/store';
import { Badge, Flex, Heading, ScrollArea, Separator } from '@radix-ui/themes';
import { QuickViewListItem } from '@cookers/modules/shared';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormDate, FormInputAutoCompleteVirtualized } from '@cookers/ui';
import { useInvoiceEnquiryTotalInfo } from '../../queries/invoice-enquiry-total-info-query';
import { useInvoiceEnquiryDeliveryDetails } from '../../queries/invoice-enquiry-delivery-details-query';
import { useInvoiceEnquiryQuantityBreakdown } from '../../queries/invoice-enquiry-quantity-breakdown-query';
import { useInvoiceEnquirySlackSummary } from '../../queries/invoice-enquiry-slack-query';
import { decodeArrayFromQueryParam, isSameDate } from '@cookers/utils';
import { invoiceStatusColorSelectorByStatusName } from '../../util';

// Type definitions for better type safety
interface CarrierCodeFilter {
  carrierCode?: string;
}

interface QuantityBreakdownItem {
  catlogCode?: string;
  despQtySum?: string;
}

interface SlackSummaryItem {
  weekLable?: string;
  slackTime?: string;
}

const formatNumber = (value: string | number | undefined, minimumFractionDigits?: number, maximumFractionDigits?: number): string => {
  if (value === undefined || value === null || value === '') {
    return '0.00';
  }
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numberValue)) {
    return '0.00';
  }
  return numberValue.toLocaleString('en-US', { minimumFractionDigits: minimumFractionDigits ?? 2, maximumFractionDigits: maximumFractionDigits ?? 2 });
};

const InvoiceEnquiryQuickView: React.FC = React.memo(() => {
  const { selectedInvoice, filter, masterData } = useStoreSelector(STORE.Invoice);
  const [shouldFetchDeliveryDetails, setShouldFetchDeliveryDetails] = useState(false);
  const [shouldFetchQuantityBreakdown, setShouldFetchQuantityBreakdown] = useState(false);
  const [shouldFetchSlackSummary, setShouldFetchSlackSummary] = useState(false);
  // Form methods for the dropdown
  const methods = useForm({
    defaultValues: {
      carrierCode: selectedInvoice?.carrierCode ? { value: selectedInvoice.carrierCode, label: selectedInvoice.carrierCode } : { value: '', label: '' },
      dateFrom: filter.dateFrom,
      dateTo: filter.dateTo,
    },
  });

  const { data: totalInfoData, isLoading: isLoadingTotalInfo } = useInvoiceEnquiryTotalInfo(filter);
  const { data: deliveryInfoData, isLoading: isLoadingDeliveryInfo } = useInvoiceEnquiryDeliveryDetails(methods.getValues('carrierCode').value, methods.getValues('dateFrom'), methods.getValues('dateTo'), filter, shouldFetchDeliveryDetails);
  const { data: quantityBreakdownData, isLoading: isLoadingQuantityBreakdown } = useInvoiceEnquiryQuantityBreakdown(methods.getValues('carrierCode').value, methods.getValues('dateFrom'), methods.getValues('dateTo'), filter, shouldFetchQuantityBreakdown);
  const { data: slackSummaryData, isLoading: isLoadingSlackSummary } = useInvoiceEnquirySlackSummary(methods.getValues('carrierCode').value, methods.getValues('dateFrom'), filter, shouldFetchSlackSummary);

  // Derive delivery info visibility from data state instead of using useEffect
  const deliveryInfoVisible = useMemo(() => {
    return Boolean(deliveryInfoData && !isLoadingDeliveryInfo && shouldFetchDeliveryDetails);
  }, [deliveryInfoData, isLoadingDeliveryInfo, shouldFetchDeliveryDetails]);

  // Derive quantity breakdown visibility from data state
  const quantityBreakdownVisible = useMemo(() => {
    return Boolean(quantityBreakdownData && !isLoadingQuantityBreakdown && shouldFetchQuantityBreakdown);
  }, [quantityBreakdownData, isLoadingQuantityBreakdown, shouldFetchQuantityBreakdown]);

  // Derive slack summary visibility from data state
  const slackSummaryVisible = useMemo(() => {
    return Boolean(slackSummaryData && !isLoadingSlackSummary && shouldFetchSlackSummary);
  }, [slackSummaryData, isLoadingSlackSummary, shouldFetchSlackSummary]);

  // Update showDetails based on deliveryInfoVisible and quantityBreakdownVisible
  const currentShowDetails = useMemo(
    () => ({
      deliveryInfo: deliveryInfoVisible,
      quantityBreakdown: quantityBreakdownVisible,
      slackInformation: slackSummaryVisible,
    }),
    [deliveryInfoVisible, quantityBreakdownVisible, slackSummaryVisible]
  );

  // Handler functions with useCallback for better performance
  const handleFetchQuantityBreakdown = useCallback(() => {
    const formValues = methods.getValues();
    if (!shouldFetchQuantityBreakdown && formValues.carrierCode && formValues.dateFrom && formValues.dateTo) {
      setShouldFetchQuantityBreakdown(true);
    } else {
      setShouldFetchQuantityBreakdown(false);
    }
  }, [shouldFetchQuantityBreakdown, methods]);

  const handleFetchSlackInformation = useCallback(() => {
    const formValues = methods.getValues();
    if (!shouldFetchSlackSummary && formValues.carrierCode && formValues.dateFrom && formValues.dateTo) {
      setShouldFetchSlackSummary(true);
    } else {
      setShouldFetchSlackSummary(false);
    }
  }, [shouldFetchSlackSummary, methods]);

  const handleFetchDeliveryInfo = useCallback(() => {
    const formValues = methods.getValues();
    if (!shouldFetchDeliveryDetails && formValues.carrierCode && formValues.dateFrom && formValues.dateTo) {
      setShouldFetchDeliveryDetails(true);
    } else {
      setShouldFetchDeliveryDetails(false);
    }
  }, [shouldFetchDeliveryDetails, methods]);

  // Consolidated useEffect for form updates and state management
  useEffect(() => {
    // Reset all states when selectedInvoice or filter changes
    setShouldFetchDeliveryDetails(false);
    setShouldFetchQuantityBreakdown(false);
    setShouldFetchSlackSummary(false);
    if (filter.columnFilters) {
      const columnFilter = decodeArrayFromQueryParam(filter.columnFilters);
      const carrierCodeFilter = columnFilter?.find((item: unknown) => (item as CarrierCodeFilter).carrierCode) as CarrierCodeFilter;
      const carrierCodeValue = carrierCodeFilter?.carrierCode;
      methods.setValue('carrierCode', carrierCodeValue ? { value: carrierCodeValue, label: carrierCodeValue } : { value: '', label: '' });
    } else {
      methods.setValue('carrierCode', { value: '', label: '' });
    }
    // Update form values
    methods.setValue('dateFrom', filter?.dateFrom ?? '');
    methods.setValue('dateTo', filter?.dateTo ?? '');

    // Set up form watcher for resetting details when form changes
    const subscription = methods.watch(() => {
      // Debounce the state updates to prevent excessive re-renders
      const timeoutId = setTimeout(() => {
        setShouldFetchDeliveryDetails(false);
        setShouldFetchQuantityBreakdown(false);
        setShouldFetchSlackSummary(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    });

    return () => subscription.unsubscribe();
  }, [filter, methods]);
  return (
    <FormProvider {...methods}>
      <Flex gap="3" direction="column" width="100%" height="100%" className="pb-10" maxWidth="400px">
        <QuickViewListItem
          heading={
            <Flex gap="3" direction="row" justify="between" className="w-full" align="center">
              <Heading color="gray" size="4">
                <span>Invoice #</span> {selectedInvoice?.ivceNo ?? '-------'}
              </Heading>
              <Flex gap="3" direction="row">
                {selectedInvoice && (
                  <Heading size="4">
                    <Badge radius="large" size={'3'} color={invoiceStatusColorSelectorByStatusName(selectedInvoice.status)} variant="soft">
                      {InvoiceStatus[selectedInvoice.status]}
                    </Badge>
                  </Heading>
                )}
              </Flex>
            </Flex>
          }
          infoList={[
            { label: 'Customer Name', value: selectedInvoice?.custName ?? '-------' },
            { label: 'Product', value: selectedInvoice?.description ?? '-------' },
            { label: 'BDM', value: selectedInvoice?.repName ?? '-------' },
            ...(selectedInvoice?.sOrderReason ? [{ label: 'Reason for One-Off order', value: selectedInvoice.sOrderReason }] : []),
          ]}
          showSeparator={true}
        />

        <div className="mx-4 pt-4">
          <Separator orientation="horizontal" size="4" color="gray" />
        </div>
        <QuickViewListItem
          heading="Summary"
          showDetails={!isLoadingTotalInfo}
          isLoading={isLoadingTotalInfo}
          infoList={[
            { label: 'No of Invoices', value: totalInfoData?.totalInvoiceCount ?? '0' },
            { label: 'Total Amount', value: formatNumber(totalInfoData?.totalAmount) },
            { label: 'Total Liters', value: formatNumber(totalInfoData?.totalLitres, 0, 0) },
            { label: '$/L (Dollars per litre)', value: totalInfoData?.totalPrecentage ?? '0' },
          ]}
          showSeparator={true}
        />
        <div className="mx-4 pt-4">
          <Separator orientation="horizontal" size="4" color="gray" />
        </div>
        {/* <Flex direction="column" align="center" justify="between" p="4" pb="0">
          <div className="w-full">
            <FormInputAutoCompleteVirtualized label="Carrier" name="carrierCode" options={masterData.carrierList || []} />
          </div>
          <div className="w-full flex flex-row justify-between">
            <FormDate popperPlacement="bottom-start" label="Date From" name="dateFrom" dateFormat="dd-MMM-yyyy" />
            <FormDate popperPlacement="bottom-end" label="Date To" name="dateTo" defaultValue={new Date()} dateFormat="dd-MMM-yyyy" />
          </div>
        </Flex> */}
        <QuickViewListItem
          isDisabled={!methods.getValues('carrierCode').value || !methods.getValues('dateFrom') || !methods.getValues('dateTo')}
          disabledTooltip="Please select a carrier to view the Delivery Information."
          showDetails={currentShowDetails.deliveryInfo}
          setShowDetails={handleFetchDeliveryInfo}
          isLoading={isLoadingDeliveryInfo}
          heading="Delivery Information"
          infoList={[
            { label: 'No. of Customers Completed', value: deliveryInfoData?.customersCompletedCount ?? '0' },
            { label: 'No. of Customers Scheduled', value: deliveryInfoData?.customersScheduledCount?.toString() ?? '0' },
            { label: 'No. of Completed Jobs', value: deliveryInfoData?.completedJobsCount?.toString() ?? '0' },
            { label: 'No. of Scheduled Jobs', value: deliveryInfoData?.scheduledJobsCount?.toString() ?? '0' },
          ]}
          showSeparator={true}
        />
        <QuickViewListItem
          isDisabled={!methods.getValues('carrierCode').value || !methods.getValues('dateFrom') || !methods.getValues('dateTo')}
          disabledTooltip="Please select a carrier to view the Quantity Breakdown."
          showDetails={currentShowDetails.quantityBreakdown}
          setShowDetails={handleFetchQuantityBreakdown}
          isLoading={isLoadingQuantityBreakdown}
          heading="Quantity Breakdown"
          infoList={
            quantityBreakdownData && quantityBreakdownData.length > 0
              ? quantityBreakdownData.map((item: QuantityBreakdownItem) => ({
                  label: item.catlogCode ?? '',
                  value: `${formatNumber(item.despQtySum)}`,
                }))
              : [{ label: 'No data found.....', value: '' }]
          }
          showSeparator={true}
        />
        <QuickViewListItem
          className="pb-10"
          isDisabled={!methods.watch('carrierCode').value || !methods.watch('dateFrom') || !methods.watch('dateTo') || !isSameDate(methods.watch('dateFrom'), methods.watch('dateTo'))}
          disabledTooltip="Please select a carrier and one single date to view the Slack Information."
          showDetails={currentShowDetails.slackInformation}
          setShowDetails={handleFetchSlackInformation}
          isLoading={isLoadingSlackSummary}
          heading="Slack Information"
          infoList={
            slackSummaryData && slackSummaryData.length > 0
              ? slackSummaryData.map((item: SlackSummaryItem) => ({
                  label: item.weekLable ?? '',
                  value: `${item.slackTime ?? '0'} mins`,
                }))
              : [{ label: 'No data found.....', value: '' }]
          }
          showSeparator={true}
        />
      </Flex>
    </FormProvider>
  );
});

export default InvoiceEnquiryQuickView;
