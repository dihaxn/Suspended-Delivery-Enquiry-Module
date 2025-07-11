import { useCommonFilterAppender } from '@cookers/modules/shared';
import { incidentFilter, initialFilterState, STORE, useStoreSelector } from '@cookers/store';
import { Box, Flex, FormButton, FormDate, FormInput, FormSelect, Heading, Link } from '@cookers/ui';
import { AddAllItemOption, formatStringDatetostring, GetPeriodFromDate } from '@cookers/utils';
import * as fa from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

export const Filter = () => {
  const { filter, masterData } = useStoreSelector(STORE.IncidentManagement);
  const { globalMasterData } = useStoreSelector(STORE.GlobalMaster);
  const dispatch = useDispatch();
  // const [originator, setOriginator] = useState<string | undefined>(getUserFromLocalStorage()?.originator || '');
  // const [proxyUser, setProxyUser] = useState<string | undefined>(getProxyUserFromLocalStorage()?.userName || '');
  // useEffect(() => {
  //   if (originator !== filter.originator) {
  //     dispatch(incidentFilter({ ...filter, originator }));
  //   }
  // }, [dispatch, originator, filter]);
  // useEffect(() => {
  //   if (proxyUser !== filter.proxyUser) {
  //     dispatch(incidentFilter({ ...filter, proxyUser }));
  //   }
  // }, [dispatch, proxyUser, filter]);

  const commonFilters = useCommonFilterAppender((payload: any) => (dispatch) => dispatch(incidentFilter(payload)), filter);

  const methods = useForm({
    defaultValues: {
      duration: filter.duration,
      dateFrom: filter.dateFrom,
      dateTo: filter.dateTo,
      depot: filter.depot,
      type: filter.type,
      status: filter.status,
      search: filter.search,
      originator: commonFilters.originator,
      employeeSearch: filter.employeeSearch,
      dateFromStr: filter.dateFromStr,
      dateToStr: filter.dateToStr,
    },
  });

  const { handleSubmit, watch, setValue } = methods;
  const searchValue = watch('search');
  const searchEmpValue = watch('employeeSearch');
  const handleOnSubmit = async (data: any) => {
    data.dateFrom = new Date(data.dateFrom).toISOString();
    data.dateTo = new Date(data.dateTo).toISOString();
  /*   data.dateFromStr = formatStringDatetostring(data.dateFrom);
    data.dateToStr = formatStringDatetostring(data.dateTo); */
    dispatch(incidentFilter(data));
  };
  const durationList = globalMasterData.durationList;
  const depotList = AddAllItemOption(masterData.depotList);
  const reportTypeList = AddAllItemOption(masterData.reportTypeList);
  const statusList = AddAllItemOption(masterData.statusList);

  const handleDurationSelectedItem = (selectedItem: string) => {
    const fromDate = GetPeriodFromDate(selectedItem);
    console.log(fromDate);
    setValue('dateFrom', fromDate);
  };
  const handleClearFilter = () => {
    dispatch(incidentFilter(initialFilterState));
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
              {/*       <LabelField label="Duration">
                <SelectField data={masterData.durationList} defaultValue={filter.duration}  onValueChange={(selectedItem) => {
    setValue('duration', selectedItem);
    handleDurationSelectedItem(selectedItem);
  }} />
              </LabelField> */}
              <FormSelect
                label="Duration"
                name="duration"
                data={durationList}
                defaultValue={filter.duration}
                onValueChange={(value) => handleDurationSelectedItem(value)}
              />
              <FormDate label="Date From" name="dateFrom" dateFormat="dd-MMM-yyyy" />
              <FormDate label="Date To" name="dateTo" defaultValue={new Date(filter.dateTo)} dateFormat="dd-MMM-yyyy" />
              <FormSelect label="Depot" name="depot" data={depotList} defaultValue={filter.depot} />
              <FormSelect label="Report Type" name="type" data={reportTypeList} defaultValue={filter.type} />
              <FormSelect label="Status" name="status" data={statusList} defaultValue={filter.status} />
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border my-5">
              <span className="relative z-10 bg-[#f2f6fa] px-2 text-muted-foreground">or</span>
            </div>
            <div>
              <FormInput label="Search By Report No" name="search" />
            </div>
            <div>
              <FormInput label="Search By Employee Name" name="employeeSearch" />
            </div>
            <Flex gap="5" align="center" flexGrow="1">
              <FormButton label="Search Incidents" name="searchincident" size="2" type="submit" />
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
      </Box>
    </Box>
  );
};
