import { Box, Flex, Heading, FormDate, FormSelect, FormInput, FormButton, Link } from '@cookers/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fa from '@fortawesome/free-regular-svg-icons';
import { FormProvider, useForm } from 'react-hook-form';
import { initialCustGroupFilterState, setCustGroupFilter, STORE, useStoreSelector } from '@cookers/store';
import { AddAllItemOption, formatStringDatetostring } from '@cookers/utils';
import { useDispatch } from 'react-redux';
import { useCommonFilterAppender } from '@cookers/modules/shared';

export const SuspendedDeliveryFilters: React.FC = () => {
  const dispatch = useDispatch();
  const { filter, masterData } = useStoreSelector(STORE.CustGroup);
  const { globalMasterData } = useStoreSelector(STORE.GlobalMaster);
  const commonFilters = useCommonFilterAppender((payload: any) => (dispatch) => dispatch(setCustGroupFilter(payload)), filter);
  const methods = useForm({
    defaultValues: filter,
  });
  const handleClearFilter = () => {
    const updatedFilter = {
      ...initialCustGroupFilterState,
      originator: commonFilters.originator,
      proxyUser: commonFilters.proxyUser,
    }
    dispatch(setCustGroupFilter(updatedFilter));
    methods.reset(updatedFilter);
  };

  const handleOnSubmit = (data: any) => {
    data.dateFrom = new Date(data.dateFrom).toISOString();
    data.dateTo = new Date(data.dateTo).toISOString();
    dispatch(setCustGroupFilter(data));
  };

  return (
    <Box>
      <Flex align="center" gap="3">
        <FontAwesomeIcon icon={fa.faFile} />
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
                <FormSelect label="Search by customer groups" name="searchcustgroup" defaultValue={'All'} data={AddAllItemOption(masterData.custgroupList || [])} />
                
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
