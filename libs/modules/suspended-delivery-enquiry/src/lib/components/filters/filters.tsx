import { Box, Flex, Heading, FormSelect, FormButton, Link } from '@cookers/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fa from '@fortawesome/free-regular-svg-icons';
import { FormProvider, useForm } from 'react-hook-form';
import {  STORE, useStoreSelector } from '@cookers/store';
import { AddAllItemOption, formatStringDatetostring } from '@cookers/utils';
import { useDispatch } from 'react-redux';
import { useCommonFilterAppender } from '@cookers/modules/shared';

export const SuspendedDeliveryFilters: React.FC = () => {
  const dispatch = useDispatch();
  //const { filter, masterData } = useStoreSelector(STORE.CustGroup);
  const { globalMasterData } = useStoreSelector(STORE.GlobalMaster);
  //const commonFilters = useCommonFilterAppender((payload: any) => (dispatch) => dispatch(setCustGroupFilter(payload)), filter);
  const methods = useForm({
   // defaultValues: filter,
  });
  const handleClearFilter = () => {
   
  };

  const handleOnSubmit = () => {
    
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
                <FormSelect label="Search by customer groups" name="custGroup" defaultValue={'All'} data={[]} />
                
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
