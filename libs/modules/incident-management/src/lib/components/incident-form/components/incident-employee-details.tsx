import { EmployeeDetails } from '@cookers/models';
import { RootState, setProxyReadOnlyFlag } from '@cookers/store';
import { FormAutoCompleterReturnType, FormDate, FormInput, FormInputAutoComplete, FormRadio, FormSelect, FormTextArea } from '@cookers/ui';
import { getProxyUserFromLocalStorage, parseCustomDateNullableString2 } from '@cookers/utils';
import { Box, Flex, Heading } from '@radix-ui/themes';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmpDetails } from '../../../logic/get-emp-default-data';
import { useIncidentReadOnly } from '../../../provider/read-only-incident-provider';
export const IncidentEmployeeDetails = () => {
  const dispatch = useDispatch();
  const { masterData, isproxyReadOnly } = useSelector((state: RootState) => state.incidentManagement);
  const { setValue, control } = useFormContext();
  const { employeeReadOnly, ownRecordReadOnly, isDisableEmpName } = useIncidentReadOnly();
  const [empData, setEmpData] = useState<EmployeeDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const proxyUserName = getProxyUserFromLocalStorage()?.name || '';

  const empList = useMemo(() => {
    if (!masterData?.employeeDropdownDtoList) return [];
    return masterData.employeeDropdownDtoList.map((item) => item.name).filter((name) => typeof name === 'string' && name.trim() !== '');
  }, [masterData?.employeeDropdownDtoList]);

  const handleItemSelect = async (value: FormAutoCompleterReturnType) => {
    const employeeName = value;

    console.log('1: value', employeeName);

    setIsLoading(true);
    setError(null); // Reset error state
    setValue('eventEmpName', employeeName || '');
    try {
      const empData = await fetchEmpDetails(employeeName as string);
      if (employeeName === proxyUserName) {
        console.log(employeeName === proxyUserName, employeeName, proxyUserName);
        dispatch(setProxyReadOnlyFlag(true));
      } else {
        dispatch(setProxyReadOnlyFlag(false));
      }
      setEmpData(empData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (empData) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setValue('depotCode', empData.depotCode || '');
      setValue('eventSupervisor', empData.reportToName || '');
      setValue('empId', empData.empId || 0);
      setValue('homePhone', empData.personalPhone || '');
      setValue('personalEmail', empData.personalEmail || '');
      setValue('occupation', empData.occupation || '');
      setValue('address', empData.homeAddress || '');
      setValue('gender', empData.gender || '');
      setValue('department', empData.department || '');
      const dobon = empData.dobOn ?? '';
      setValue('dob', parseCustomDateNullableString2(dobon) || undefined);
      setValue('supervisor', isproxyReadOnly ? '' : empData.reportToName || '');
      setValue('supervisorOnDate', isproxyReadOnly ? undefined : today);
      setValue('managerOnDate', isproxyReadOnly ? undefined : today);
    }
  }, [empData, setValue, isproxyReadOnly]);
  return (
    <div className="incident-section-block">
      <Box className="incident-section-header">
        <Flex justify="between" align="center" gap="6">
          <Heading>Employee Details</Heading>
          <Flex align="end" gap="2"></Flex>
        </Flex>
        <Flex align="end" gap="2">
          <small>To be completed by Supervisor/Manager and Employee</small>
        </Flex>
      </Box>

      <Flex gap="1" wrap="wrap" className="incident-section-grid">
        <Box className="incident-section-grid-block">
          <Heading size="3">Personal Details</Heading>
          <FormInputAutoComplete
            label="Employee Name"
            placeHolder="Enter name"
            name="empName"
            list={empList}
            readOnly={ownRecordReadOnly || isDisableEmpName}
            onItemSelect={handleItemSelect}
          />
          <FormInput label="Employee No" name="empId" readOnly={true} maxLength={12} />
          <FormDate label="Birth Date" name="dob" dateFormat="dd-MMM-yyyy" readOnly={true} />
          <FormRadio label="Gender" name="gender" itemList={masterData.genderList} readOnly={true} />
        </Box>
        <Box className="incident-section-grid-block">
          <Heading size="3">Contact Details</Heading>
          <FormTextArea label="Address" name="address" readOnly={true} maxLength={95} />
          <FormInput label="Personal Phone No" name="homePhone" readOnly={true} maxLength={14} />
          <FormInput label="Personal Email" name="personalEmail" readOnly={true} maxLength={120} />
          {/* <FormInput
            label="Confirm Personal Email"
            name="confirmEmail"
            readOnly={isReadOnly}
            maxLength={120}
            onPaste={(e) => e.preventDefault()} // Disable paste
            onCopy={(e) => e.preventDefault()} // Disable copy
            autoComplete="off"
          /> */}
        </Box>
        <Box className="incident-section-grid-block">
          <Heading size="3">Work Details</Heading>
          <FormSelect label="Depot" name="depotCode" data={masterData.depotList} readOnly={employeeReadOnly} />
          <FormInput label="Department" name="department" readOnly={true} maxLength={40} />
          <FormInput label="Occupation" name="occupation" readOnly={true} maxLength={40} />
        </Box>
      </Flex>
    </div>
  );
};
