import { Box, Flex, Heading, FormSelect, FormButton, Link } from '@cookers/ui';
import * as fa from '@fortawesome/free-regular-svg-icons';
import { Filter, Info, XIcon } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import {  STORE, useStoreSelector } from '@cookers/store';
import { custGroupSampleData } from '../util';
import { useDispatch } from 'react-redux';
import { useCommonFilterAppender } from '@cookers/modules/shared';
import { initialSuspendedDeliveryFilterState, setSuspendedDeliveryFilter } from '@cookers/store';

export const SuspendedDeliveryFilters: React.FC = () => {
const dispatch = useDispatch();
    const { filter, masterData } = useStoreSelector(STORE.SuspendedDelivery);
    const { globalMasterData } = useStoreSelector(STORE.GlobalMaster);
    const commonFilters = useCommonFilterAppender((payload: any) => (dispatch) => dispatch(setSuspendedDeliveryFilter(payload)), filter);
    const methods = useForm({
      defaultValues: filter,
    });
    const handleClearFilter = () => {
      const updatedFilter = {
        ...initialSuspendedDeliveryFilterState,
        originator: commonFilters.originator,
        proxyUser: commonFilters.proxyUser,
      }
      dispatch(setSuspendedDeliveryFilter(updatedFilter));
      methods.reset(updatedFilter);
    };

    const handleOnSubmit = (data: any) => {
      data.dateFrom = new Date(data.dateFrom).toISOString();
      data.dateTo = new Date(data.dateTo).toISOString();
      dispatch(setSuspendedDeliveryFilter(data));
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
                <FormSelect label="Cust Group" name="custGroup" defaultValue={'All'} data={custGroupSampleData} />
                
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
