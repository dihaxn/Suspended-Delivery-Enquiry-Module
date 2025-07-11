import { Flex, FormButton } from '@cookers/ui';
import { STORE, useStoreSelector } from '@cookers/store';
import { getUserFromLocalStorage } from '@cookers/utils';
import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { configStore } from '@cookers/store';
import { useSpinner } from '@cookers/providers';
import { useQueryClient } from '@tanstack/react-query';

export const TruckSettingFormFooter = () => {

  return (
    <Flex gap="6" wrap="wrap" align="center" style={{ backgroundColor: '#fff', padding: '1rem', height: '90px' }}>
      <FormButton label="Save Truck Setting" name="Submit" size="2" type="submit" />
    </Flex>
  );
};
