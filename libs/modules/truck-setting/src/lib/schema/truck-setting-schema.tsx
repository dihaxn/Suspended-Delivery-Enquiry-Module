import { string, z } from 'zod';
import { getUserFromLocalStorage } from '@cookers/utils';
import { Label } from '@radix-ui/react-label';
import { RootState, setProxyReadOnlyFlag, useStoreSelector, STORE } from '@cookers/store';
export type TruckSettingFormSchemaType = z.infer<typeof truckSettingFormSchema>;

export type TruckSettingFormSchemaApiType = Omit<TruckSettingFormSchemaType, 'carrierCode'> & {
  carrierCode: string;
};

export const truckSettingFormSchema = z.object({
  settingId: z.number(),
  carrierCode: z
    .object({ label: z.string(), value: z.string() })
    .refine((obj) => obj.label !== '' && obj.value !== '', { message: 'Please select the Carrier Code' }),
  truckType: z.string(),
  version: z.string(),
  pushSync: z.string(),
  restChecklist: z.string(),
  faultReportOn: z.string(),
  testUpdate: z.number(),
  totaliserType: z.string(),
  capacity: z.preprocess(
    (val) => typeof val === 'string' ? parseInt(val.trim(), 10) : val,
    z.number()
      .int({ message: 'Capacity must be an integer' })
      .max(25000, { message: 'UCO Truck Capacity should not exceed 25000L' })
  ).optional(),
  totaliser1: z.string().optional(),
  totaliser2: z.string().optional(),
  tankFarmNo1: z.string().optional(),
  tankFarmNo2: z.string().optional(),
  packagedOilCode: z.string().optional(),
  oliveoilPrice: z.number().optional(),
  spareOilCode: z.string().optional(),
  schdPackedOidCode1: z.string().optional(),
  schdPackedOidCode2: z.string().optional(),
  schdPackedOidCode3: z.string().optional(),
  schdPackedOidCode4: z.string().optional(),
  schdPackedOidCode5: z.string().optional(),
  createdDate: z.string(),
  createdBy: z.string(),
});

export const truckSettingDefaultValues: TruckSettingFormSchemaType = {
  settingId: 0,
  carrierCode: { label: '', value: '' },
  truckType: '',
  version: '',
  pushSync: 'N',
  restChecklist: 'N',
  faultReportOn: 'N',
  testUpdate: 0,
  totaliserType: '',
  capacity: 0,
  totaliser1: '',
  totaliser2: '',
  tankFarmNo1: '',
  tankFarmNo2: '',
  packagedOilCode: 'OLIVEOILP',
  oliveoilPrice: 175,
  spareOilCode: '',
  schdPackedOidCode1: '',
  schdPackedOidCode2: '',
  schdPackedOidCode3: '',
  schdPackedOidCode4: '',
  schdPackedOidCode5: '',
  createdDate: '',
  createdBy: '',
};
