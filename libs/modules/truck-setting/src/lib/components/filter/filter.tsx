import { truckSettingsFilter, initialFilterState, STORE, useStoreSelector } from '@cookers/store';
import { Box, Flex, FormButton, FormDate, FormInput, FormSelect, Heading, LabelField, Link, SelectField } from '@cookers/ui';
import { AddAllItemOption, GetPeriodFromDate, getProxyUserFromLocalStorage, getUserFromLocalStorage, formatStringDatetostring } from '@cookers/utils';
import * as fa from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { DevTool } from '@hookform/devtools';

export const TruckSettingsFilter = () => {
  const { filter, masterData } = useStoreSelector(STORE.TruckSettings);
  console.log('masterData', masterData);
  const dispatch = useDispatch();
  const [originator, setOriginator] = useState<string | undefined>(getUserFromLocalStorage()?.originator || '');
  const [proxyUser, setProxyUser] = useState<string | undefined>(getProxyUserFromLocalStorage()?.userName || '');

  const methods = useForm({
    defaultValues: {
      depot: filter.depot,
      truckType: filter.truckType,
      searchByCarrier: filter.searchByCarrier,
    },
  });

  const { handleSubmit, watch, setValue } = methods;
  const searchCarrier = watch('searchByCarrier');

  const handleOnSubmit = async (data: any) => {
    dispatch(truckSettingsFilter(data));
  };

  const depotList = AddAllItemOption(masterData.depotList);
  const truckTypeList = AddAllItemOption(masterData.truckTypeList);

  const handleClearFilter = () => {
    dispatch(truckSettingsFilter(initialFilterState));
    methods.reset(initialFilterState);
  };
  const shouldDisableFields = (searchCarrier?.length ?? 0) > 0;

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
              <FormSelect label="Truck Type" name="truckType" data={truckTypeList} defaultValue={filter.truckType} />
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border my-5">
              <span className="relative z-10 bg-[#f2f6fa] px-2 text-muted-foreground">or</span>
            </div>
            <div>
              <FormInput label="Search By Carrier Code" name="searchByCarrier" />
            </div>
            <Flex gap="5" align="center" flexGrow="1">
              <FormButton label="Search Truck Settings" name="searchincident" size="2" type="submit" />
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
