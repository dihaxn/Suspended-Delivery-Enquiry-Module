import { Box, Flex, Heading, FormDate, FormSelect, FormInput, FormButton, Link } from '@cookers/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fa from '@fortawesome/free-regular-svg-icons';
import { FormProvider, useForm } from 'react-hook-form';
import { initialCustomerFeedbackFilterState, setCustomerFeedbackFilter, STORE, useStoreSelector } from '@cookers/store';
import { AddAllItemOption, formatStringDatetostring, GetPeriodFromDate } from '@cookers/utils';
import { useDispatch } from 'react-redux';
import { useCommonFilterAppender } from '@cookers/modules/shared';

export const CustomerFeedbackFilters: React.FC = () => {
  const dispatch = useDispatch();
  const { filter, masterData } = useStoreSelector(STORE.CustomerFeedback);
  const { globalMasterData } = useStoreSelector(STORE.GlobalMaster);
  const commonFilters = useCommonFilterAppender((payload: any) => (dispatch) => dispatch(setCustomerFeedbackFilter(payload)), filter);
  const methods = useForm({
    defaultValues: filter,
  });
  const handleClearFilter = () => {
    const updatedFilter = {
      ...initialCustomerFeedbackFilterState,
      originator: commonFilters.originator,
      proxyUser: commonFilters.proxyUser,
    }
    dispatch(setCustomerFeedbackFilter(updatedFilter));
    methods.reset(updatedFilter);
  };

  const handleDurationSelectedItem = (selectedItem: string) => {
    const fromDate = GetPeriodFromDate(selectedItem);
    methods.setValue('dateFrom', fromDate);
  };

  const handleOnSubmit = (data: any) => {
    data.dateFrom = new Date(data.dateFrom).toISOString();
    data.dateTo = new Date(data.dateTo).toISOString();
    dispatch(setCustomerFeedbackFilter(data));
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
                <FormSelect label="Duration" name="duration" data={globalMasterData.durationList} onValueChange={(value) => handleDurationSelectedItem(value)} />
                <FormDate label="Created Date From" name="dateFrom" dateFormat="dd-MMM-yyyy" />
                <FormDate label="Created Date To" name="dateTo" defaultValue={new Date()} dateFormat="dd-MMM-yyyy" />
                <FormSelect label="Depot" name="depot" defaultValue={'All'} data={AddAllItemOption(masterData.depotList || [])} />
                <FormSelect label="Nature" name="nature" data={AddAllItemOption(masterData.natureList || [])} defaultValue={'All'} />
                <FormSelect label="Feedback Classification" name="feedbackClassification" data={AddAllItemOption(masterData.feedbackTypeList || [])} defaultValue={'All'} />
                <FormSelect label="Issue Classification" name="issueClassification" data={AddAllItemOption(masterData.issueList || [])} defaultValue={'All'} />
                <FormSelect label="Status" name="status" data={AddAllItemOption(masterData.statusList || [])} defaultValue={'All'} />
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border my-5">
                  <span className="relative z-10 bg-[#f2f6fa] px-2 text-muted-foreground">or</span>
                </div>
                <div>
                  <FormInput label="Search by Customer Name" name="CustomerSearch" />
                </div>
                <div>
                  <FormInput label="Search by Log No" name="search" />
                </div>
                <Flex gap="5" align="center" flexGrow="1">
                  <FormButton label="Search Feedback" name="searchincident" size="2" type="submit" />
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

export default CustomerFeedbackFilters;
