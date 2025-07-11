import { useStoreSelector, STORE} from '@cookers/store';
import { FormAutoCompleterReturnType, FormDate, FormInput, FormInputAutoComplete, FormRadio, FormSelect, FormTextArea, PopupMessageBox } from '@cookers/ui';
import { Box, Flex, Heading } from '@radix-ui/themes';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext, useForm } from 'react-hook-form';
import { TruckSettingsColumns } from '../list';
import { useNavigate } from 'react-router-dom';
import { checkCarrierCodeExists } from '../../hooks/carrier-code-exists-query';

const onOffYNStatusList = [
  { label: 'On', value: 'Y' },
  { label: 'Off', value: 'N' },
];
export const TruckSettingDetails = () => {
  const { masterData, selectedTruckSettingId } = useStoreSelector(STORE.TruckSettings);
  const [blockReadOnly, setBlockReadOnly] = useState(selectedTruckSettingId > 0);
  const { control, setValue, getValues, watch } = useFormContext();
  const [isWarningDialogOpen, setWarningDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  

  const makeUpperCase = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(name, e.target.value.toUpperCase());
  };

  const allowOnlyNumbers = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    setValue(name, numericValue);
  };

  const handleConfirmation = async () => {
    setWarningDialogOpen(false);
  };

  const selectedTruckType = watch('truckType');
  const filteredCarrierList = useMemo(() => {
    if (!masterData?.carrierList || !selectedTruckType) return [];
    return masterData.carrierList
      .filter(
        (item) => typeof item.carrierCode === 'string' && item.carrierCode.trim() !== '' && item.truckType === selectedTruckType // match truck type
      )
      .map((item) => ({
        label: item.carrierCode.trim(),
        value: item.carrierCode.trim(),
      }));
  }, [masterData?.carrierList, selectedTruckType]);

  const carrierCode = watch('carrierCode'); 
  const truckType = watch('truckType');

  const filteredTotaliserTypesList = useMemo(() => {
    const carrierInfo = masterData.carrierList.find(
      (truck) => truck.carrierCode.trim() === (typeof carrierCode === 'object' && 'value' in carrierCode ? carrierCode.value.trim() : carrierCode)
    );
    if (!carrierInfo?.truckType) return [];
  
    if (carrierInfo.truckType === 'WST') {
      return masterData.totaliserTypeList
        .filter((item) => item.label === 'UCO')
        .map((item) => ({ ...item, value: item.label }));
    }
  
    if (carrierInfo.truckType === 'CKG') {
      return masterData.totaliserTypeList
        .filter((item) => item.label !== 'UCO')
        .map((item) => ({ ...item, value: item.label }));
    }
  
    return masterData.totaliserTypeList.map((item) => ({
      ...item,
      value: item.label,
    }));
  }, [carrierCode, masterData.carrierList, masterData.totaliserTypeList]);
  
  useEffect(() => {
    const carrierInfo = masterData.carrierList.find(
      (truck) =>
        truck.carrierCode.trim() ===
        (typeof carrierCode === 'object' && 'value' in carrierCode ? carrierCode.value : carrierCode)
    );
    const savedValue = getValues('totaliserType');
    const isSavedValueValid = filteredTotaliserTypesList.some((item) => item.label.trim() === savedValue.trim());
  
    if (isSavedValueValid) {
      return;
    }
    if (carrierInfo?.truckType === 'WST') {
      setValue('totaliserType', 'UCO');
    } else if (carrierInfo?.truckType === 'CKG') {
      const liquipExists = filteredTotaliserTypesList.find((item) => item.label === 'Liquip');
      setValue('totaliserType', liquipExists ? liquipExists.label : '');
    } else {
      setValue('totaliserType', filteredTotaliserTypesList[0]?.label || '');
    }
  }, [carrierCode, masterData.carrierList, filteredTotaliserTypesList, getValues, setValue]);

  useEffect(() => {
    if (masterData && masterData.oliveoilPrice !== undefined && masterData.oliveoilPrice !== 0) {
      setValue('oliveoilPrice', masterData.oliveoilPrice);
    }
  }, [masterData, setValue]);

  const handleCarrierChange = async (data: FormAutoCompleterReturnType) => {
    const carrierInfo = masterData.carrierList.find((truck) => truck.carrierCode.trim() === data);
    const result = await checkCarrierCodeExists((carrierInfo?.carrierCode ?? '').trim(), selectedTruckSettingId);
    if(result){
      setWarningDialogOpen(true);
    }
    if (carrierInfo?.truckType) {
      setValue('truckType', carrierInfo.truckType);
    }
  };

  const totaliserType = watch('totaliserType');

  return (
    <div className="form-section-block">
      <Box className="form-section-header">
        <Flex justify="between" align="center" gap="6">
          <Heading>Truck Settings Entry</Heading>
        </Flex>
        <Flex align="end" gap="2">
          <small></small>
        </Flex>
      </Box>

      <Flex gap="1" wrap="wrap" className="form-section-grid">
        <Box className="form-section-grid-block">
          <Heading size="3">General Settings</Heading>
          <FormInputAutoComplete
            label="Carrier Code"
            name="carrierCode"
            list={
              selectedTruckSettingId > 0
                ? filteredCarrierList.map((item) => ({
                    label: item.label.trim(),
                    value: item.value.trim(),
                  }))
                : masterData.carrierList.map((item) => ({
                    label: item.carrierCode.trim(),
                    value: item.carrierCode.trim(),
                  }))
            }
            onItemSelect={handleCarrierChange}
            readOnly={blockReadOnly}
          />
          <FormSelect label="Truck Type" name="truckType" data={masterData.truckTypeList} readOnly={true} />
          <FormInput label="Version" name="version" readOnly={true} />
          <FormRadio label="Auto Sync" name="pushSync" itemList={onOffYNStatusList} />
          <FormRadio label="Reset Checklist" name="restChecklist" itemList={onOffYNStatusList} />
          <FormRadio label="Enable Fault Report" name="faultReportOn" itemList={onOffYNStatusList} />
          <FormRadio
            label="Test Update"
            name="testUpdate"
            itemList={masterData.onOffStatusList.map((item) => ({
              ...item,
              value: Number(item.value),
            }))}
          />
        </Box>
        <Box className="form-section-grid-block">
          <Heading size="3">Totaliser Settings</Heading>
          <FormSelect label="Totaliser Type" name="totaliserType" data={filteredTotaliserTypesList} readOnly={blockReadOnly} />
          {truckType == 'WST' && <FormInput label="UCO Truck Capacity" name="capacity" onChange={allowOnlyNumbers('capacity')} maxLength={5} readOnly={blockReadOnly} />}
          {truckType == 'CKG' && totaliserType !== 'Packaged' && (
            <>
              <FormInput label="Totaliser 1 Oil Code" name="totaliser1" onChange={makeUpperCase('totaliser1')} maxLength={12} readOnly={blockReadOnly} />
              <FormInput label="Tank 1 Farm No." name="tankFarmNo1" onChange={makeUpperCase('tankFarmNo1')} maxLength={20} readOnly={blockReadOnly} />
              <FormInput label="Totaliser 2 Oil Code" name="totaliser2" onChange={makeUpperCase('totaliser2')} maxLength={12} readOnly={blockReadOnly} />
              <FormInput label="Tank 2 Farm No." name="tankFarmNo2" onChange={makeUpperCase('tankFarmNo2')} maxLength={20} readOnly={blockReadOnly} />
            </>
          )}
        </Box>
        {truckType == 'CKG' && (
          <Box className="form-section-grid-block">
            <Heading size="3">Packaged Oil Settings</Heading>
            <FormInput label="Packaged Oil Code" name="packagedOilCode" readOnly={true} />
            <FormInput label="Packaged Oil Price" name="oliveoilPrice" readOnly={true} />
            <FormInput label="Spare Oil Code(Tot2)" name="spareOilCode" onChange={makeUpperCase('spareOilCode')} maxLength={12} readOnly={blockReadOnly} />
            <FormInput label="Schd. Packaged Oil Code 1" name="schdPackedOidCode1" onChange={makeUpperCase('schdPackedOidCode1')} maxLength={12} readOnly={blockReadOnly} />
            <FormInput label="Schd. Packaged Oil Code 2" name="schdPackedOidCode2" onChange={makeUpperCase('schdPackedOidCode2')} maxLength={12} readOnly={blockReadOnly} />
            <FormInput label="Schd. Packaged Oil Code 3" name="schdPackedOidCode3" onChange={makeUpperCase('schdPackedOidCode3')} maxLength={12} readOnly={blockReadOnly} />
            <FormInput label="Schd. Packaged Oil Code 4" name="schdPackedOidCode4" onChange={makeUpperCase('schdPackedOidCode4')} maxLength={12} readOnly={blockReadOnly} />
            <FormInput label="Schd. Packaged Oil Code 5" name="schdPackedOidCode5" onChange={makeUpperCase('schdPackedOidCode5')} maxLength={12} readOnly={blockReadOnly} />
          </Box>
        )}
        {isWarningDialogOpen && (
                    <PopupMessageBox isOpen={isWarningDialogOpen} onOpenChange={setWarningDialogOpen}
                        dialogTitle="" dialogDescription="The selected carrier code is already assigned for another setting" onConfirm={() => handleConfirmation()} />
                )}       
      </Flex>
    </div>
  );
};
