import { STORE, useStoreSelector } from '@cookers/store';
import { FormAutoCompleterReturnType, FormCheckbox, FormInput, FormInputAutoComplete, FormInputAutoCompleteEdit, FormSelect, FormTextArea, PopupMessageBox } from '@cookers/ui';
import { Box, Flex, Heading } from '@radix-ui/themes';
import { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
interface CarrierEntryDetailProps {
  status: string | undefined;
 
}

export const CarrierEntryDetail:React.FC<CarrierEntryDetailProps> = ({
    status
  
}) => {
    const { masterData } = useStoreSelector(STORE.CarrierMaster);
    const [isWarningDialogOpen, setWarningDialogOpen] = useState(false);
    const { setValue } = useFormContext();
    const isReadOnly= status!==undefined
    const empList = useMemo(() => {
        if (!masterData?.contactList) return [];
        return masterData.contactList.map((item) => item.name).filter((name) => typeof name === 'string' && name.trim() !== '');
    }, [masterData?.contactList]);
    const handleItemSelect = async (value: FormAutoCompleterReturnType) => {
        const driverId = value;
        const driverObj = masterData.driverList.find((driv) => driv.driverId === driverId);
        setValue('employeeNo', driverObj?.empId ?? undefined);
        if(driverObj?.isExists ){
            setWarningDialogOpen(true);
        }
    };
    const handleConfirmation = async () => {
    setWarningDialogOpen(false);
  
  };
    return (
        <div className="form-section-block">
            <Box className="form-section-header">
                <Flex justify="between" align="center" gap="6">
                    <Heading>Carrier Details</Heading>
                </Flex>
            </Box>

            <Flex gap="1" wrap="wrap" className="form-section-grid">
                <Box className="form-section-grid-block">
                    <Heading size="3">Carrier Details</Heading>
                    <FormInput label="Carrier Code" name="carrierCode" maxLength={8} readOnly={isReadOnly}/>
                    <FormTextArea label="Name" name="name" maxLength={40} />
                    <FormSelect label="Depot" name="depotCode" data={masterData.depotList} />
                    <FormSelect label="Truck Type" name="truckType" data={masterData.truckTypeList} />
                    <FormInput label="Rego No" name="regoNo" maxLength={8} />
                </Box>
                <Box className="form-section-grid-block">
                    <Heading size="3">Driver Details</Heading>
                    <FormInputAutoComplete
                        label="Driver"
                        placeHolder="Enter driver"
                        name="driver"
                        list={masterData.driverList.map((item) => ({
                            label: item.driverName,
                            value: item.driverId,
                        }))}
                        onItemSelect={handleItemSelect}

                    />
                    <FormInput label="Employee No" name="employeeNo" readOnly={true} />
                </Box>
                <Box className="form-section-grid-block">
                    <Heading size="3">Other Details</Heading>
                    <FormInputAutoCompleteEdit
                        label="Contact"
                        name="contact"
                        list={empList}
                        placeHolder="Enter name"

                        maxLength={20}
                    />
                    <FormCheckbox label="Auto Runheet Sequence" name="autoSequenceFlagForm" size="s" />
                    <FormTextArea label="Remarks" name="remarks" maxLength={400} />

                </Box>
                {isWarningDialogOpen && (
                    <PopupMessageBox isOpen={isWarningDialogOpen} onOpenChange={setWarningDialogOpen}
                        dialogTitle="" dialogDescription="Truck already exists for the selected Driver" onConfirm={() => handleConfirmation()} />
                )}
            </Flex>


        </div>
    );
}

export default CarrierEntryDetail;