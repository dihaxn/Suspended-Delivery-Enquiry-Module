import { z } from 'zod';

export type IncidentFormSchemaType = z.infer<typeof incidentFormSchema>;

const injuryHappendSchema = z.object({
  anyInjury: z.literal('2'),
  injuryNature: z.string().min(1, 'Injury Nature is required'),
  firstAider: z.string().min(1, 'First Aider is required'),
});

const accidentSpecificExtraSchema = z.object({ reportType: z.literal('ACCI'), accidentDec: z.string() });

const incidentSpecificExtraSchema = z.object({
  reportType: z.literal('INCI'),
  oilSpill: z.string().optional(),
  incidentDec: z.string().optional(),
});

/* Report Type Schema */
const reportTypeSpecificExtraSchema = z.union([accidentSpecificExtraSchema, incidentSpecificExtraSchema]);

export const CommonSchema = z.object({
  reportType: z.string().min(1, 'Report Type is required'),
  worksite: z.string().min(1, 'Worksite is required'),
  empId: z.string().min(1, 'Employee ID is required'),
  empName: z.string().min(1, 'Employee Name is required'),

  anyInjury: z.string().optional(),
});

const formTypeSchema = z.discriminatedUnion('varient', [z.object({ varient: z.literal('New') }), z.object({ varient: z.literal('Edit') })]);

export const incidentFormSchema = z.intersection(formTypeSchema, CommonSchema).and(reportTypeSpecificExtraSchema);

export const defaultValue: IncidentFormSchemaType = {
  varient: 'New',
  reportType: 'INCI',
  worksite: '',
  empId: '',
  empName: '',
  anyInjury: '2',
};
