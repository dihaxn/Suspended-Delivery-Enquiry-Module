import { ConfirmAlertDialog, Flex, FormButton } from '@cookers/ui';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { deleteCarrierEntry } from '../../queries/delete-carrier-entry';
import { useNavigate } from 'react-router-dom';
import { configStore } from '@cookers/store';
import { useSpinner } from '@cookers/providers';
import { useQueryClient } from '@tanstack/react-query';
interface CarrierEntryFooterProps {
  status: string | undefined;
 
}
export const CarrierEntryFooter:React.FC<CarrierEntryFooterProps> = ({
  status
  
}) => {
  const { getValues } = useFormContext();
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { setIsSpinnerLoading } = useSpinner();
    const navigate = useNavigate();
     const queryClient = useQueryClient(); 
    
const handleDelete = async () => {
    try {
      setConfirmDialogOpen(true);
    
      
    } catch (error) {
      console.error('Error deleting carrier:', error);
    }
  };
 const handleConfirmation = async () => {
    setConfirmDialogOpen(false);
    setIsSpinnerLoading(true);
    try {
      const carrierCode=getValues('carrierCode')
      const result = await deleteCarrierEntry(carrierCode);

      if (result.success) {
       
         console.log('Carrier deleted successfully');
       queryClient.invalidateQueries({ queryKey: ['data-CarrierMaster'] });
        navigate(`/${configStore.appName}/carrier-master`);
      } else {
        console.error('Error deleting:', result);
      }
    } catch (error) {
      console.error('Error deleting carrier details:', error);
    } finally {
      setIsSpinnerLoading(false);
    }
  };

  

  
  return (
    <Flex gap="6" wrap="wrap" align="center" style={{ backgroundColor: '#fff', padding: '1rem', height: '90px' }}>
      <FormButton label="Save Carrier" name="Submit" size="2" type="submit" />
  {status &&<FormButton label="Delete Carrier" name="Delete" size="2" type="button"   onClick={handleDelete} /> }
      {isConfirmDialogOpen && (
          <ConfirmAlertDialog
            isOpen={isConfirmDialogOpen}
            onOpenChange={setConfirmDialogOpen}
            dialogTitle="Confirm"
            dialogDescription={ 'Are you sure you want to delete this carrier?' }
            confirmButtonText="Yes"
            onConfirm={() => handleConfirmation()}
          />
        )}
    </Flex>
   
 )
}

export default CarrierEntryFooter;