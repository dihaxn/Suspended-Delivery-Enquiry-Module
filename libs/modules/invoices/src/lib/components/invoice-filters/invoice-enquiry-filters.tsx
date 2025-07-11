import React, { useEffect } from 'react';
import { Box, Flex, Heading, FormDate, FormSelect, FormInput, FormButton, Link, FormRadio, FormInputAutoCompleteVirtualized, Label } from '@cookers/ui';
import { FormProvider, useForm } from 'react-hook-form';
import { removeAllColumnFilters, removeColumnFilter, setInvoiceFilters, setSelectedInvoice, STORE, useStoreSelector } from '@cookers/store';
import { AddAllItemOption, GetPeriodFromDate, isDateBefore } from '@cookers/utils';
import { useDispatch } from 'react-redux';
import { ColumnFilterList, FilterDivider, useCommonFilterAppender } from '@cookers/modules/shared';
import { Filter, Info, XIcon } from 'lucide-react';
import { DefaultInvoiceFilters, FilterItem } from '@cookers/models';
import { Badge, IconButton } from '@radix-ui/themes';
import { DevTool } from '@hookform/devtools';
import { Tooltip, TooltipContent, TooltipTrigger } from 'libs/ui/src/lib/shadcn/tooltip';
import { formatArchivalDate } from '../../util';

const InvoiceEnquiryFilters: React.FC = () => {
  const dispatch = useDispatch();
  const { filter, masterData, columnFilters } = useStoreSelector(STORE.Invoice);
  const { globalMasterData } = useStoreSelector(STORE.GlobalMaster);
  const commonFilters = useCommonFilterAppender((payload: any) => (dispatch) => dispatch(setInvoiceFilters(payload)), filter);
  const methods = useForm({
    defaultValues: filter,
  });

  // Watch dateFrom and automatically set dateTo to archivalDate if dateFrom is before archival date
  useEffect(() => {
    const subscription = methods.watch((value, { name }) => {
      if (name === 'dateFrom' && value.dateFrom && masterData.archivalDate) {
        if (isDateBefore(value.dateFrom, masterData.archivalDate)) {
          methods.setValue('dateTo', masterData.archivalDate);
        } else {
          methods.setValue('dateTo', new Date().toISOString());
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [methods, masterData.archivalDate]);

  const handleClearFilter = () => {
    const updatedFilter = {
      ...DefaultInvoiceFilters,
      originator: commonFilters.originator,
      proxyUser: commonFilters.proxyUser,
      dateFrom: new Date().toISOString(),
      dateTo: new Date().toISOString(),
    };
    dispatch(setInvoiceFilters(updatedFilter));
    dispatch(removeAllColumnFilters());
    methods.reset(updatedFilter);
  };

  const handleDurationSelectedItem = (selectedItem: string) => {
    const fromDate = GetPeriodFromDate(selectedItem);
    methods.setValue('dateFrom', fromDate);
  };

  const handleOnSubmit = (data: any) => {
    // Merge with existing filter data
    const updatedData = {
      ...filter, // Preserve existing filter data
      ...data, // Apply new form data
      dynamicColumns: filter.dynamicColumns,
      dateFrom: new Date(data.dateFrom).toISOString(),
      dateTo: new Date(data.dateTo).toISOString(),
      custGroup: data.custGroup?.value,
      archivedData: !isDateBefore(masterData.archivalDate, data.dateTo),
    };
    dispatch(setSelectedInvoice(null));
    dispatch(setInvoiceFilters(updatedData));
  };

  const handleRemoveColumnFilter = (item: FilterItem) => {
    dispatch(removeColumnFilter(item));
  };

  return (
    <Box>
      <Flex align="center" gap="3">
        <Filter size={18} />
        <Heading size="2" style={{ color: '#162850' }}>
          Search by filter
        </Heading>
      </Flex>
      <br />
      <Flex gap="3" direction="column" align="start">
        <Box className="w-[250px]">
          <form onSubmit={methods.handleSubmit(handleOnSubmit)}>
            <FormProvider {...methods}>
              <div>
                <FormSelect label="Duration" name="duration" data={masterData.durationList} onValueChange={(value) => handleDurationSelectedItem(value)} />
                <FormDate label="Date From" name="dateFrom" dateFormat="dd-MMM-yyyy" maxDate={new Date()} />
                <FormDate
                  label="Date To"
                  name="dateTo"
                  defaultValue={new Date()}
                  dateFormat="dd-MMM-yyyy"
                  minDate={methods.watch('dateFrom') ? new Date(methods.watch('dateFrom')) : new Date(masterData.archivalDate)}
                  maxDate={methods.watch('dateFrom') && isDateBefore(methods.watch('dateFrom'), masterData.archivalDate) ? new Date(masterData.archivalDate) : new Date()}
                />
                <div className="flex flex-row items-center -mt-3 mb-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={18} className="mr-2 text-blue-500" />
                    </TooltipTrigger>
                    <TooltipContent align="start">Please enter a date range before or after the Last Archived date</TooltipContent>
                  </Tooltip>
                  <span className="text-xs">
                    Last Archived date is <span className="font-bold">{formatArchivalDate(masterData.archivalDate)}</span>
                  </span>
                </div>
                <FormSelect label="Product Type" name="productType" defaultValue={'All'} data={AddAllItemOption(masterData.productType || [])} />
                <FormInputAutoCompleteVirtualized label="Customer Group" name="custGroup" options={AddAllItemOption(masterData.customerGroup || [])} />
                <FormInput label="Search by Master Parent" name="masterParent" />
                <FormInput label="Search by GL Batch No" name="gLBatchNo" />
                {masterData.enquiryMode && <FormRadio label="Enquiry Mode" name="enquiryMode" itemList={masterData.enquiryMode} />}
                <ColumnFilterList items={columnFilters} label="Applied Filters" onRemove={handleRemoveColumnFilter} />
                <FilterDivider dividerLabel="or" />
                <FormInput label="Search by Ref #" name="search" />
                <Flex gap="5" align="center" flexGrow="1">
                  <FormButton label="Search Invoice" name="searchInvoice" size="2" type="submit" />
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleClearFilter();
                    }}
                    size="3"
                    weight={'medium'}
                  >
                    Clear
                  </Link>
                </Flex>
              </div>
            </FormProvider>
            <DevTool control={methods.control} />
          </form>
        </Box>
      </Flex>
    </Box>
  );
};

export default InvoiceEnquiryFilters;
