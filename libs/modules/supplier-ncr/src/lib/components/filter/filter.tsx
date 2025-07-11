import { useCommonFilterAppender } from '@cookers/modules/shared';
import { initialFilterState, STORE, supplierNcrFilter, useStoreSelector } from '@cookers/store';
import { Box, Flex, FormButton, FormDate, FormInput, FormSelect, Heading, Link } from '@cookers/ui';
import { AddAllItemOption, formatStringDatetostring, GetPeriodFromDate } from '@cookers/utils';
import * as fa from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DevTool } from '@hookform/devtools';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

export const Filter = () => {
  const { filter, masterData } = useStoreSelector(STORE.SupplierNcr);
  const { globalMasterData } = useStoreSelector(STORE.GlobalMaster);
  const dispatch = useDispatch();
  const commonFilters = useCommonFilterAppender((payload: any) => (dispatch) => dispatch(supplierNcrFilter(payload)), filter);

 

  const methods = useForm({
    defaultValues: {
      duration: filter.duration,
      dateFrom: filter.dateFrom,
      dateTo: filter.dateTo,
      depot: filter.depot,
      // type: filter.type,
      status: filter.status,
      searchByReportNo: filter.searchByReportNo,
      originator: commonFilters.originator,
      proxyUser: commonFilters.proxyUser,
      classification: filter.classification,
      searchBySupplierName: filter.searchBySupplierName,
      // dateFromStr: filter.dateFromStr,
      // dateToStr: filter.dateToStr,
    },
  });

  const { handleSubmit, watch, setValue } = methods;
  const searchValue = watch('searchByReportNo');
  const searchEmpValue = watch('searchBySupplierName');
  const handleOnSubmit = async (data: any) => {
    data.dateFrom = new Date(data.dateFrom).toISOString();
    data.dateTo = new Date(data.dateTo).toISOString();
    
    dispatch(supplierNcrFilter(data));
  };
  const durationList = globalMasterData.durationList;
  const depotList = AddAllItemOption(masterData.depotList);
  const statusList = AddAllItemOption(masterData.statusList);
  const classificationList = AddAllItemOption(masterData.classificationList);

  const handleDurationSelectedItem = (selectedItem: string) => {
    const fromDate = GetPeriodFromDate(selectedItem);
    console.log(fromDate);
    setValue('dateFrom', fromDate);
  };
  const handleClearFilter = () => {
    dispatch(supplierNcrFilter(initialFilterState));
    methods.reset(initialFilterState);
  };
  const shouldDisableFields = (searchValue?.length ?? 0) > 0 || (searchEmpValue?.length ?? 0) > 0;

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
              <FormSelect
                label="Duration"
                name="duration"
                data={durationList}
                defaultValue={filter.duration}
                onValueChange={(value) => handleDurationSelectedItem(value)}
              />
              <FormDate label="Received Date From" name="dateFrom" dateFormat="dd-MMM-yyyy" />
              <FormDate label="Received Date To" name="dateTo" defaultValue={new Date(filter.dateTo)} dateFormat="dd-MMM-yyyy" />

              <FormSelect label="Classification" name="classification" data={classificationList} defaultValue={filter.classification} />

              <FormSelect label="Depot" name="depot" data={depotList} defaultValue={filter.depot} />

              <FormSelect label="Status" name="status" data={statusList} defaultValue={filter.status} />
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border my-5">
              <span className="relative z-10 bg-[#f2f6fa] px-2 text-muted-foreground">or</span>
            </div>
            <div>
              <FormInput label="Search By Log No" name="searchByReportNo" />
            </div>
            <div>
              <FormInput label="Search By Supplier Name" name="searchBySupplierName" />
            </div>
            <Flex gap="5" align="center" flexGrow="1">
              <FormButton label="Search Supplier NCRs" name="searchincident" size="2" type="submit" />
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

// export const useCommonFilterAppender = (
//   filterAction: (payload: any) => (dispatch: Dispatch) => void,
//   filter: any
// ) => {
//   const dispatch = useDispatch();
//   const [originator] = useState<string | undefined>(getUserFromLocalStorage()?.originator || '');
//   const [proxyUser] = useState<string | undefined>(getProxyUserFromLocalStorage()?.userName || '');

//   useEffect(() => {
//     if (originator !== filter.originator) {
//       dispatch(filterAction({ ...filter, originator }));
//     }
//   }, [dispatch, originator, filter, filterAction]);

//   useEffect(() => {
//     if (proxyUser !== filter.proxyUser) {
//       dispatch(filterAction({ ...filter, proxyUser }));
//     }
//   }, [dispatch, proxyUser, filter, filterAction]);
// };
