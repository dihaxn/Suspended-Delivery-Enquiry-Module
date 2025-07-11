import { useCommonFilterAppender } from '@cookers/modules/shared';
import { initialFilterState, STORE, salesOrderFilter, useStoreSelector, setOrderFilters, addColumnFilter1, removeAllColumnFilters1 } from '@cookers/store';
import { Box, Flex, FormButton, FormDate, FormInput, FormSelect, Heading, Link, FormCheckbox, FormInputAutoComplete, FormInputAutoCompleteVirtualized } from '@cookers/ui';
import { AddAllItemOption, formatStringDatetostring, GetPeriodFromDate } from '@cookers/utils';
import * as fa from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DevTool } from '@hookform/devtools';
import { useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { DefaultSalesOrderFilters } from '@cookers/models';

export const Filter = () => {
    const { filter, masterData } = useStoreSelector(STORE.SalesOrder);
    const { globalMasterData } = useStoreSelector(STORE.GlobalMaster);
    const dispatch = useDispatch();
    const commonFilters = useCommonFilterAppender((payload: any) => (dispatch) => dispatch(salesOrderFilter(payload)), filter);
    
    const durationList = globalMasterData.durationList;
    const carrierList = useMemo(() => AddAllItemOption(masterData.carrierList), [masterData.carrierList]);
    const productTypeList = useMemo(() => AddAllItemOption(masterData.productTypeList), [masterData.productTypeList]);
    const statusList = useMemo(() => AddAllItemOption(masterData.statusList), [masterData.statusList]);
    const parentCustomerList = useMemo(() => AddAllItemOption(masterData.parentCustomerList), [masterData.parentCustomerList]);
    const custGroupList = useMemo(() => AddAllItemOption(masterData.custGroupList), [masterData.custGroupList]);
    
    const methods = useForm({
      defaultValues: {
        duration: filter.duration,
        dateFrom: filter.dateFrom,
        dateTo: filter.dateTo,
        orderType: filter.orderType,
        productType: filter.productType,
        orderStatus: filter.orderStatus,
        parentCustomer: parentCustomerList.find((item) => item.value === filter.parentCustomer) || { label: '', value: '' },
        custGroup: custGroupList.find((item) => item.value === filter.custGroup) || { label: '', value: '' },
        carrierCode: carrierList.find((item) => item.value === filter.carrierCode) || { label: '', value: '' },
        checkedOutstandingOrders: filter.checkedOutstandingOrders,
        originator: commonFilters.originator,
        proxyUser: commonFilters.proxyUser
      },
    });
  
    const { handleSubmit, watch, setValue } = methods;
    const orderType = watch('orderType');

    const handleOnSubmit = async (data: any) => {
      data.dateFrom = new Date(data.dateFrom).toISOString();
      data.dateTo = new Date(data.dateTo).toISOString();

      if (data.parentCustomer?.value && data.parentCustomer.value.trim()) {
        data.parentCustomer = data.parentCustomer.value.trim();
      } else {
        data.parentCustomer = '';
      }

      if (data.carrierCode?.label && data.carrierCode.label.trim()) {
        data.carrierCode = data.carrierCode.label.trim();
      } else {
        data.carrierCode = '';
      }

      if (data.custGroup?.value && data.custGroup.value.trim()) {
        data.custGroup = data.custGroup.value.trim();
      } else {
        data.custGroup = '';
      }
      console.log("filterdata", data)
      dispatch(setOrderFilters(data));
      //dispatch(salesOrderFilter(data));
    };
  
    const handleDurationSelectedItem = (selectedItem: string) => {
      const fromDate = GetPeriodFromDate(selectedItem);
      console.log(fromDate);
      setValue('dateFrom', fromDate);
      setValue('dateTo',new Date().toString());
    };
    const handleClearFilter = () => {
      const resetValues = {
        ...DefaultSalesOrderFilters,
        parentCustomer: { label: 'All', value: 'all' },
        custGroup: { label: 'All', value: 'all' },
        carrierCode: { label: 'All', value: 'All' },
      };
      dispatch(setOrderFilters({ ...resetValues}));
      dispatch(removeAllColumnFilters1());
      methods.reset(resetValues);
    };
  
    return (
      <Box width='260px'>
        <Flex align="center" gap="3">
          <FontAwesomeIcon icon={fa.faFile} />
          <Heading size="2" style={{ color: '#162850' }}>
            Search by filter
          </Heading>
        </Flex>
        <br />
        <Box>
          <form onSubmit={handleSubmit(handleOnSubmit)}>
            <FormProvider {...methods}>
                <FormSelect label="Duration" name="duration" data={durationList} defaultValue={filter.duration} onValueChange={(value) => handleDurationSelectedItem(value)} />
                <FormDate label="Date From" name="dateFrom" dateFormat="dd-MMM-yyyy" />
                <FormDate label="Date To" name="dateTo" defaultValue={new Date(filter.dateTo)} dateFormat="dd-MMM-yyyy" />

                <FormSelect label="Order Type" name="orderType" data={masterData.orderTypeList} defaultValue={filter.orderType} />
                <FormSelect label="Product Type" name="productType" data={productTypeList} defaultValue={filter.productType} />
                {orderType == 'ONOF' && <FormSelect label="Order Status" name="orderStatus" data={statusList} defaultValue={filter.orderStatus} />}
                <FormInputAutoCompleteVirtualized
                  label="Parent Customer"
                  name="parentCustomer"
                  options = {parentCustomerList.map((item) => ({
                    label: item.label.trim(),
                    value: item.value.trim(),
                  }))}
                />
                <FormInputAutoCompleteVirtualized 
                  label="Carrier Code"
                  name="carrierCode"
                  options ={carrierList.map((item) => ({
                    label: item.label.trim(),
                    value: item.label.trim(),
                  }))}
                 />
                 <FormInputAutoCompleteVirtualized 
                  label="Customer Group"
                  name="custGroup"
                  options ={custGroupList.map((item) => ({
                    label: item.label.trim(),
                    value: item.value.trim(),
                  }))}
                 />
                 {orderType == 'ONOF' && <FormCheckbox label="Outstanding Orders" name="checkedOutstandingOrders" size="s" readOnly={false} />}
              <Flex gap="5" align="center" flexGrow="1">
                <FormButton label="Search Orders" name="searchincident" size="2" type="submit" />
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
            </FormProvider>
          </form>
          <DevTool control={methods.control} /> {/* set up the dev tool */}
        </Box>
      </Box>
    );
  };