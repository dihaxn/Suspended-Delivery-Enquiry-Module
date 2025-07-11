import { z } from 'zod';

export type CarrierFormSchemaType = z.infer<typeof carrierFormSchema>;

export type CarrierFormSchemaApiType = Omit<CarrierFormSchemaType, 'driver'> & {
   driverId: number;
autoSequenceFlag: number; 
};

export const carrierFormSchema = z.object({
    carrierCode: z.string().nonempty('Please enter the Carrier Code'),
    name: z.string(),
    depotCode: z.string().nonempty('Please select the Depot'),
    truckType: z.string().nonempty('Please select the Truck Type'),
    regoNo: z.string(),
    driver: z.object({ label: z.string(), value: z.number() }),
    employeeNo: z.number().optional(),
    contact: z.string(),
    autoSequenceFlagForm: z.boolean().optional(),
    remarks: z.string(),
    createdDateString:z.string(),
})



export const carrierDefaultValues: CarrierFormSchemaType = {
 carrierCode: '',
    name: '',
    depotCode: '',
    truckType: '',
    regoNo: '',
    driver: { label: '', value: 0},
    employeeNo: undefined,
    contact: '',
    autoSequenceFlagForm: false,
    remarks: '',
    createdDateString:''
};
