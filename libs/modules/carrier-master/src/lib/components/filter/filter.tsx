import { useCommonFilterAppender } from '@cookers/modules/shared';
import { initialCarrierFilterState, setCarrierFilter, STORE,  useStoreSelector } from '@cookers/store';
import { Box, Flex, FormButton, FormDate, FormInput, FormSelect, Heading, Link } from '@cookers/ui';
import { AddAllItemOption, formatStringDatetostring, GetPeriodFromDate } from '@cookers/utils';
import * as fa from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DevTool } from '@hookform/devtools';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';


export const Filter = () => {
   const { filter, masterData } = useStoreSelector(STORE.CarrierMaster);
  const dispatch = useDispatch();
  const commonFilters = useCommonFilterAppender((payload: any) => (dispatch) => dispatch(setCarrierFilter(payload)), filter);
const methods = useForm({
    defaultValues: {
    
      depot: filter.depot,
      truckType: filter.truckType,
      searchByCarrierCode: filter.searchByCarrierCode,
      searchByDriver: filter.searchByDriver,
      originator: commonFilters.originator,
      proxyUser: commonFilters.proxyUser,
      searchByRegoNo: filter.searchByRegoNo
    },
  });

  const { handleSubmit, watch, setValue } = methods;
  const searchRegoNo = watch('searchByRegoNo');
  const searchDriver = watch('searchByDriver');
  const searchCarrierCode = watch('searchByCarrierCode');
  const handleOnSubmit = async (data: any) => {
    
    dispatch(setCarrierFilter(data));
  };
  
  const depotList = AddAllItemOption(masterData.depotList);
  const truckTypelist = AddAllItemOption(masterData.truckTypeList);
  

  
  const handleClearFilter = () => {
    dispatch(setCarrierFilter(initialCarrierFilterState));
    methods.reset(initialCarrierFilterState);
  };
  const shouldDisableFields = (searchRegoNo?.length ?? 0) > 0 || (searchDriver?.length ?? 0) > 0 || (searchCarrierCode?.length ?? 0) > 0;

  return (
   <Box>
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
            <div className={shouldDisableFields ? 'filter-disabled-container' : undefined}>
              
              <FormSelect label="Depot" name="depot" data={depotList} defaultValue={filter.depot} />

              <FormSelect label="Truck Type" name="truckType" data={truckTypelist} defaultValue={filter.truckType} />
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border my-5">
              <span className="relative z-10 bg-[#f2f6fa] px-2 text-muted-foreground">or</span>
            </div>
            <div>
              <FormInput label="Search By Carrier Code" name="searchByCarrierCode" />
            </div>
             <div>
              <FormInput label="Search By Driver Name" name="searchByDriver" />
            </div>
            <div>
              <FormInput label="Search By Rego No" name="searchByRegoNo" />
            </div>
            <Flex gap="5" align="center" flexGrow="1">
              <FormButton label="Search Carriers" name="searchcarriers" size="2" type="submit" />
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

