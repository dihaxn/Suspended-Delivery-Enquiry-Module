import {  STORE, MasterFileLogFilter as MasterFilesLogFilter, useStoreSelector,  removeAllColumnFilters1 } from '@cookers/store';

import { Box, Flex, FormButton, FormDate, FormSelect, Heading, Link } from '@cookers/ui';
import {  GetPeriodFromDate } from '@cookers/utils';
import * as fa from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DevTool } from '@hookform/devtools';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { DefaultMasterFileLogFilters } from '@cookers/models';
import { FormInput } from '@cookers/ui';
import { useLayoutEffect } from 'react';

export const MasterFileLogFilter = () => {
  const { filter, masterData, code, masterFile, displayName } = useStoreSelector(STORE.MasterFileLog);
  console.log('masterData', masterData);
  const { globalMasterData } = useStoreSelector(STORE.GlobalMaster);
  const dispatch = useDispatch();

  const durationList = globalMasterData.durationList;

 const methods = useForm({
    defaultValues: filter,
  });

  const { watch, setValue } = methods;

 
  
  useLayoutEffect(() => {
    setValue('code', code);
    //setValue('masterFile', masterFile);
    setValue('displayName', displayName);
    //handleLogFilter();

  }, []);
  

  const handleDurationSelectedItem = (selectedItem: string) => {
    const fromDate = GetPeriodFromDate(selectedItem);
    console.log(fromDate);
    setValue('dateFrom', fromDate);
    setValue('dateTo', new Date().toString());
  };
  const handleClearFilter = () => {
    const resetValues = {
      ...DefaultMasterFileLogFilters,
      code: code,
      masterFile: masterFile,
    };
    dispatch(MasterFilesLogFilter({ ...resetValues }));
    methods.reset(resetValues);
  };

  
  
  const handleLogFilter = () => {
    const data = methods.getValues();
    data.code = code;
    data.masterFile = masterFile;
    data.dateFrom = new Date(data.dateFrom).toISOString();
    data.dateTo = new Date(data.dateTo).toISOString();
    dispatch(MasterFilesLogFilter(data));
  };

  return (
    <Box width="260px">
      <Flex align="center" gap="3">
        <FontAwesomeIcon icon={fa.faFile} />
        <Heading size="2" style={{ color: '#162850' }}>
          Search by filter
        </Heading>
      </Flex>
      <br />
      <Box>
        <form>
          <FormProvider {...methods}>
            <FormSelect label="Duration" name="duration" data={durationList} defaultValue={filter.duration} onValueChange={(value) => handleDurationSelectedItem(value)} />
            <FormDate label="Date From" name="dateFrom" dateFormat="dd-MMM-yyyy" />
            <FormDate label="Date To" name="dateTo" defaultValue={new Date(filter.dateTo)} dateFormat="dd-MMM-yyyy" />
            <FormInput label="Code" name="code" readOnly />
            <FormInput label="Customer Name" name="displayName" readOnly />

            <Flex gap="5" align="center" flexGrow="1">
              <FormButton
                label="Search Logs"
                name="Submit"
                size="2"
                type="button"
                onClick={() => {
                  handleLogFilter();
                }}
              />
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