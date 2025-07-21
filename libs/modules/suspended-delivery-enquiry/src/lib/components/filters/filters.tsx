import { Box, Flex, Heading, FormButton, Link, FormInputAutoCompleteVirtualized } from '@cookers/ui';
import { Filter } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import {  STORE, useStoreSelector } from '@cookers/store';
import { useDispatch } from 'react-redux';
import { useCommonFilterAppender } from '@cookers/modules/shared';
import {initialSuspendedDeliveryFilterState } from '@cookers/models';
import { setSuspendedDeliveryFilter , suspendedDeliveryFilter} from '@cookers/store';
import { AddAllItemOption } from '@cookers/utils';
import { useMemo } from 'react';


export const SuspendedDeliveryFilters: React.FC = () => {

        const { filter, masterData } = useStoreSelector(STORE.SuspendedDelivery);
        const dispatch = useDispatch();
        const commonFilters = useCommonFilterAppender((payload: any) => (dispatch) => dispatch(suspendedDeliveryFilter(payload)), filter);
        
       
        const custGroupList = useMemo(() => AddAllItemOption(masterData.custGroup), [masterData.custGroup]);
        
        const methods = useForm({
          defaultValues: {
            custGroup: custGroupList.find((item) => item.value === filter.custGroup) || { label: '', value: '' },
            originator: commonFilters.originator,
            proxyUser: commonFilters.proxyUser
          },
        });
      
    
        const handleOnSubmit = async (data: any) => {
    
          if (data.custGroup?.value && data.custGroup.value.trim()) {
            data.custGroup = data.custGroup.value.trim();
          } else {
            data.custGroup = '';
          }
          console.log("filterdata", data)
          dispatch(setSuspendedDeliveryFilter(data));
        };
    
        const handleClearFilter = () => {
          const resetValues = {
            ...initialSuspendedDeliveryFilterState,
                custGroup: 'All', 
          };
          dispatch(setSuspendedDeliveryFilter({ ...resetValues}));
          methods.reset(resetValues);
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
        <Box>
          <form onSubmit={methods.handleSubmit(handleOnSubmit)}>
            <FormProvider {...methods}>
              <div>
                  <FormInputAutoCompleteVirtualized label="Cust Group" name="custGroup" options ={custGroupList.map((item) => ({label: item.label.trim(),value: item.value.trim(),}))}/>                
                <Flex gap="5" align="center" flexGrow="1">
                  <FormButton label="Search customer" name="searchincident" size="2" type="submit" />
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
          </form>
        </Box>
      </Flex>
    </Box>
  );
};

export default SuspendedDeliveryFilters;
