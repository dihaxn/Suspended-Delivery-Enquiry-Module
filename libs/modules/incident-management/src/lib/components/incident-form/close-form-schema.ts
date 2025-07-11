import { z } from 'zod';

export type CloseIncidentSchemaType = z.infer<typeof closeIncidentSchema>;

export const closeIncidentSchema = z
  .object({
   
    immCorrectAction: z.string().min(1, 'Immediate corrective action taken is required'),
    immActionBy: z.string().optional(),
    immActionOnDate: z.date(),

    feasibleActionType: z.string().optional(),
    feasibleActionOnDate: z.date(),
    feasibleAction: z.string().optional(),
    feasibleActionBy: z.string().optional(),
    feasibleReminderDate: z.date(),
  
    completeOnDate: z.date(),

    supervisor: z.string().min(1, { message: 'Supervisor Name is required' }),
    supervisorOnDate:  z.date(),

    managerComm: z.string().min(1, 'Manager Comment is required'),
    manager: z.string().min(1, 'Manager is required'),
    managerOnDate: z.date(),

    evidenceAttach: z.string().optional(),
    signedByAll: z.string().optional(),
    
  });

  export const CloseIncidentFormDefaultValues: CloseIncidentSchemaType = {
    immCorrectAction: '',
    immActionBy: '',
    immActionOnDate: new Date(),

    feasibleActionType: '',
    feasibleActionOnDate: new Date(),
    feasibleAction: '',
    feasibleActionBy: '',
    feasibleReminderDate: new Date(),
  
    completeOnDate: new Date(),

    supervisor: '',
    supervisorOnDate:  new Date(),

    managerComm: '',
    manager: '',
    managerOnDate: new Date(),

    evidenceAttach: '',
    signedByAll: '',
    
  };
  
  
 