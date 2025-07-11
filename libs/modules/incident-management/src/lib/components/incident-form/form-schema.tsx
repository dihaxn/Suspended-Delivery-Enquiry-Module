import { DocDetailModel } from '@cookers/models';
import { isBefore, startOfDay } from 'date-fns';
import { z, ZodError, ZodIssueCode } from 'zod';
export type IncidentFormSchemaType = z.infer<typeof incidentFormSchema>;

/*=======================================================================================
Injury Type Schema
=========================================================================================*/
const aussiePhoneRegex = /^(0\d{9}|\+61\d{9})$/;
const stripTime = (date: Date) => startOfDay(date);

const validateInjuryDetails = (data: any) => {
  const missingFields: ZodError = new ZodError([]);
  
  // Add individual errors for missing fields
  if (!data.firstAider)
    missingFields.addIssue({ path: ['firstAider'], message: 'First aider is required if there is an injury', code: ZodIssueCode.custom });
  if (!data.injuryNature)
    missingFields.addIssue({ path: ['injuryNature'], message: 'Nature of the injury is required if there is an injury', code: ZodIssueCode.custom });
  if (!data.injuryReportedOnDate)
    missingFields.addIssue({ path: ['injuryReportedOnDate'], message: 'Injury reported date is required', code: ZodIssueCode.custom });
  if (!data.treatment)
    missingFields.addIssue({ path: ['treatment'], message: 'Treatment is required if there is an injury', code: ZodIssueCode.custom });
 /*  if (!data.aiderName)
    missingFields.addIssue({ path: ['aiderName'], message: 'Aider name is required if there is an injury', code: ZodIssueCode.custom }); */
  //if (!data.firstAidOnDate) missingFields.addIssue({ path: ['firstAidOnDate'], message: 'First aid date is required', code: ZodIssueCode.custom });
  /* if (data.workInform === 'Y' && !data.informDateOn)
    missingFields.addIssue({ path: ['informDateOn'], message: 'Informed date is required', code: ZodIssueCode.custom }); */
 
  if (data.treatmentgiven==="A" && (!data.firstAidType || data.firstAidType == 'Select')) {
    missingFields.addIssue({
      path: ['firstAidType'],
      message: 'First aid type is required',
      code: ZodIssueCode.custom,
    });
  }
  if (data.treatmentgiven==="B" && !data.doctor ) {
    missingFields.addIssue({
      path: ['doctor'],
      message: 'Doctor is required',
      code: ZodIssueCode.custom,
    });
  }
  if (data.doctor && !data.hospital) {
    missingFields.addIssue({
      path: ['hospital'],
      message: 'Hospital is required if doctor is provided',
      code: ZodIssueCode.custom,
    });
  }
 
 
  // If there are missing fields, throw ZodError
  if (missingFields.issues.length > 0) {
    throw missingFields;
  }

  return true; // All fields are valid
};

/* ========================================================================================
   Report Type Schema
   ======================================================================================== */

const reportTypeSchema = z.discriminatedUnion('reportType', [
  z.object({
    reportType: z.literal('ACCI'),

    //Cookers Truck
    /* cookersTruck: z.string().optional(),
    driver: z.string().optional(),
    driverLicence: z.string().optional(),

    //Impact Details
    driverCondi: z.string().optional(),
    vehicleCondi: z.string().optional(),

    //Action details */
    actionTaken: z.string().optional(),
    othVehicleInvolve: z.string().optional(),

    //Other truck details
    othDriver: z.string().optional(),
    othDriverLicence: z.string().optional(),
    othDriverContact: z.string().optional(),
    othVehicle: z.string().optional(),

    //Impact Details
    othDriverCondi: z.string().optional(),

    //Action details
    othVehicleCondi: z.string().optional(),
    othActionTaken: z.string().optional(),
  }),
  z.object({
    reportType: z.literal('INCI'),

    // Oil spill details
    /* oilSpill: z.string().optional(),
    incidentDec: z.string().optional(),
    areaContain: z.string().optional(), */

    // Containment Details

   /*  containTimeDate: z.date().nullable(),
    containNote: z.string().optional(),
    authInform: z.string().optional(), */

    // Injury Details
    injuryInvolve: z.string().optional(),
    whoInvolve: z.string().optional(),

    // Injured person details
    involverName: z.string().optional(),
    involverContact: z.string().optional(),
    involverAddress: z.string().optional(),
    involverEmail: z.string().optional(),
  }),
]);

/* ========================================================================================
   Incident Form Schema
   ======================================================================================== */
export const incidentFormSchema = z
  .object({
    // event type
    reportType: z.string().min(1, 'Report Type is required'),
    worksite: z.string().min(1, 'Worksite is required'),
    incidentId: z.number().optional(),
    status: z.string(),
    internalStatus:z.string(),
    confirmByEmp:z.boolean(),
    confirmByMgr:z.boolean(),
    empId: z.union([
      z.number(),
      z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
          message: 'Must be a valid number and at least 1',
        })
        .transform((val) => Number(val)),
    ]),
    empName: z.string().min(1, 'Employee Name is required'),
    dob: z.date().optional(),
    gender: z.string().min(1, 'Gender is required. Please inform HR to update the details.'), 
   //gender: z.string().optional(),
    refCode: z.string().optional(),
    // B: Contact
    address: z.string().optional(),
    homePhone: z.string().min(1, 'Personal Phone No is required. Please inform HR to update the details.'),
   // homePhone: z.string().optional(),
  personalEmail: z.string().min(1, { message: 'Personal Email is required. Please inform HR to update the details.' }),
   // personalEmail: z.string().optional(),
    //confirmEmail: z.string().optional(),

    // C: Work
    depotCode: z.string().min(1, 'Depot is required. Please inform HR to update the details.'),
    department: z.string().optional(),
   occupation: z.string().min(1, 'Occupation is required. Please inform HR to update the details.'),
   // occupation: z.string().optional(),
    // 2. Event details ========================================
    // A: Time & Place of the event
    eventOnDate: z.date(),
   // empname: z.string().min(1, 'Employee Name is required'),
    accidentPlace: z.string().min(1, 'Place of Incident is required'),
    normalOvertime: z.string().min(1, 'Required'),

    // B: Job Details
    jobPerformed: z.string().min(1, 'Job Performed is required'),
    anyInstruction: z.string(),
    instruction: z.string().optional(),

    // C: Event Log Details
    eventDesc: z.string().min(1, 'Incident Description is required'),
    eventEmpName: z.string().min(1, 'Incident Employee is required'),
    eventLogOnDate: z.date(),

    // D: Witness
    witnesses: z.string().optional(),
    eventSupervisor: z.string().optional(),
    anyInjury: z.string().optional(),

    // Report Type - Incident Specific
    //// A : Oil spill details
    oilSpill: z.string().optional(),
    incidentDec: z.string().optional(),
    areaContain: z.boolean().optional(),
    outsideService:z.string().optional(),
    outsideServiceName:z.string().optional(),
    //// B: Containment Details

    containTimeDate: z.date().optional(),
    containNote: z.string().optional(),
    authInform: z.string().optional(),

    //// C: Injury Details
    injuryInvolve: z.string().optional(),
    whoInvolve: z.string().optional(),

    //// D: Injured person details
    involverName: z.string().optional(),
    involverContact: z
    .string()
    .optional() // Allow `undefined` if not provided.
    .refine(
      (value) =>
        value === undefined || value === null || value === '' || aussiePhoneRegex.test(value),
      {
        message: 'Invalid phone number format. Must be 10 digits or +61 followed by 9 digits.',
      }
    ),
    involverAddress: z.string().optional(),
    involverEmail: z.string().email().optional().nullable(),

    // Report Type - Accident Specific
    ////Cookers Truck
    cookersTruck: z.string().optional(),
    driver: z.string().optional(),
    driverLicence: z.string().optional(),
    regoNo:z.string().optional(),
    ////Impact Details
    driverCondi: z.string().optional(),
    vehicleCondi: z.string().optional(),

    ////Action details
    actionTaken: z.string().optional(),
    othVehicleInvolve: z.string().optional(),

    ////Other truck details
    othDriver: z.string().optional(),
    othDriverLicence: z.string().optional(),
    othDriverContact: z.string().optional(),
    othVehicle: z.string().optional(),

    ////Impact Details
    othDriverCondi: z.string().optional(),

    ////Action details
    othVehicleCondi: z.string().optional(),
    othActionTaken: z.string().optional(),

    // TODO: ugly values
    treatmentgiven:z.string().optional(),
    firstAider: z.string().optional(),
    driverId: z.number(),
    injuryReportedOnDate: z.date().optional(),
    injuryReportedTo: z.string().optional(),
    injuryNature: z.string().optional(),
    partInjured: z.string().optional(),
    firstAidType: z.string().optional(),
    doctor: z.string().optional(),
    hospital: z.string().optional(),
    treatment: z.string().optional(),
    workInform: z.string().optional(),
    informDateOn: z.date().optional(),
    notifyHo: z.string().optional(),
   // aiderName: z.string().nullable().optional(),
    //firstAidOnDate: z.date().optional(),
    claimLodgementOnDate: z.date().optional(),
    claimApprovalOnDate: z.date().optional(),
    claimStatus: z.string().optional(),
    insurer: z.string().optional(),

    workClaimNo: z.string().optional(),
    immCorrectAction: z.string().optional(),
    immActionBy: z.string().optional(),
    immActionOnDate: z.date().optional(),

    feasibleActionType: z.string().optional(),
    feasibleActionOnDate: z.date().optional(),
    feasibleAction: z.string().optional(),
    feasibleActionBy: z.string().optional(),
    feasibleReminderDate: z.date().optional(),

    completeOnDate: z.date().optional(),

    supervisor: z.string().optional(),
    supervisorOnDate: z.date().optional(),

    managerComm: z.string().optional(),
    manager: z.string().optional(),
    managerOnDate: z.date().optional(),

    evidenceAttach: z.string().optional(),
    signedByAll: z.string().optional(),
    furtherCorrectAction:z.string().optional(),
    //
    createdBy: z.string(),
    createdOn: z.date().optional(),
    closedBy: z.string(),
    closedOn: z.date().optional(),
    incidentResource: z.any(),
    acceptOnBehalfEmp:z.boolean(),
    empAcceptBy: z.string(),
    empAcceptOn: z.string(),
    mgrAcceptBy:  z.string(),
    mgrAcceptOn:  z.string(),
    isManager:z.boolean().optional(),
    createdByName: z.string(),
    empAcceptByName: z.string(),
    mgrAcceptByName: z.string(),
    //
  }).refine(
    (data) => {
      return !isBefore(stripTime(data.eventLogOnDate), stripTime(data.eventOnDate));
    },
    {
      message: 'Incident Log on Date cannot be earlier than Incident Date',
      path: ['eventLogOnDate'],
    }
   )
  /* .refine((data) => data.personalEmail === data.confirmEmail, {
    message: 'Confirm Personal Email again',
    path: ['confirmEmail'],
  }) */
  .refine(
    (data) => {
      if (data.oilSpill === 'Y' && data.internalStatus === 'E' && data.areaContain!==true) {
        return false;
      }
      return true;
    },
    {
      message: 'Area containment  is mandatory' ,
      path: ['areaContain'],
    }
  )
  .refine(
    (data) => {
      if (data.internalStatus === 'E' && !data.immCorrectAction) {
        return false;
      }
      return true;
    },
    {
      message: 'Immediate corrective action is mandatory',
      path: ['immCorrectAction'],
    }
  )
  .refine(
    (data) => {
      if (data.internalStatus === 'E' && !data.supervisor) {
        return false;
      }
      return true;
    },
    {
      message: 'Supervisor is mandatory',
      path: ['supervisor'],
    }
  )
  .refine(
    (data) => {
      if (data.internalStatus === 'E' && !data.managerComm) {
        return false;
      }
      return true;
    },
    {
      message: 'Manager comment is mandatory',
      path: ['managerComm'],
    }
  )
  .refine(
    (data) => {
      if (data.internalStatus === 'E' && !data.manager) {
        return false;
      }
      return true;
    },
    {
      message: 'Manager is mandatory',
      path: ['manager'],
    }
  )
  .refine(
    (data) => {
      if (data.internalStatus === 'E' && !data.managerOnDate) {
        return false;
      }
      return true;
    },
    {
      message: 'Manager submission date is mandatory',
      path: ['managerOnDate'],
    }
  )
  .refine(
    (data) => {
      if (data.internalStatus === 'E' && !data.supervisorOnDate) {
        return false;
      }
      return true;
    },
    {
      message: 'Supervisor submission date is mandatory',
      path: ['supervisorOnDate'],
    }
  )
  .refine(
    (data) => {
      if (data.internalStatus === 'E' && !data.completeOnDate) {
        return false;
      }
      return true;
    },
    {
      message: 'Completed Date is mandatory',
      path: ['completeOnDate'],
    }
  )
  .refine(
    (data) => {
      if (data.internalStatus === 'E' && (data.evidenceAttach === 'N' || data.evidenceAttach === '' || !data.evidenceAttach)) {
        return false;
      }
      return true;
    },
    {
      message: 'Evidence been attached should be Yes',
      path: ['evidenceAttach'],
    }
  )
 /*  .refine(
    (data) => {
      if (data.internalStatus === 'E' && (data.signedByAll === 'N' || data.signedByAll === '')) {
        return false;
      }
      return true;
    },
    {
      message: 'Completed form signed by all should be Yes for closing incident',
      path: ['signedByAll'],
    }
  ) */
 .refine(
    (data) => {
      console.log(data.incidentResource);
      if (data.internalStatus === 'E' && data.evidenceAttach === 'Y' &&  (
        data.incidentResource.length==0 || 
        !data.incidentResource.some((resource:any) => resource.docType === 'EVID')
      )) {
        return false;
      }
      return true;
    },
    {
      message: 'Evidence is not attached',
      path: ['evidenceAttach'],
    }
  ) 
  .refine(
    (data) => {
      if (data.internalStatus === 'E' && data.feasibleReminderDate && !data.feasibleActionBy) {
        return false;
      }
      return true;
    },
    {
      message: 'By Whom is required if Reminder Date is set',
      path: ['feasibleActionBy'],
    }
  )
  .refine(
    (data) => {
      if (data.furtherCorrectAction=='Y' && data.feasibleActionType!=='Select' && !data.feasibleActionOnDate) {
        return false;
      }
      return true;
    },
    {
      message: 'Proposed Completion Date is Mandatory',
      path: ['feasibleActionOnDate'],
    }
  )
  .refine(
    (data) => {
      if (data.furtherCorrectAction=='Y' && data.feasibleActionType!=='Select' && !data.feasibleReminderDate) {
        return false;
      }
      return true;
    },
    {
      message: 'Reminder Date is Mandatory',
      path: ['feasibleReminderDate'],
    }
  )
  .refine(
    (data) => {
      if (data.furtherCorrectAction=='Y' && data.feasibleActionType!=='Select' && !data.feasibleActionBy) {
        return false;
      }
      return true;
    },
    {
      message: 'Feasible Action By whom is Mandatory',
      path: ['feasibleActionBy'],
    }
  )
  .refine(
    (data) => {
      if (
        data.feasibleActionType === 'TRAN' &&
        data.completeOnDate &&
        (
          data.incidentResource.length==0 || 
          !data.incidentResource.some((resource:any) => resource.docType === 'TRIN')
        )
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Training Document is mandatory',
      path: ['feasibleActionType'],
    }
  )
  .refine(
    (data) => {
      console.log(data.anyInjury)
      if (data.anyInjury === 'Y' || data.reportType === 'INJU') {
        const hasAnyInjuryDetails =
          data.firstAider ||
          data.injuryReportedOnDate ||
          data.injuryReportedTo ||
          data.injuryNature ||
          data.partInjured ||
          (data.firstAidType && data.firstAidType != 'Select') ||
          data.doctor ||
          data.hospital ||
          data.treatment ||
          data.workInform ||
          data.notifyHo 
         // data.aiderName
         // data.firstAidOnDate;
        if (hasAnyInjuryDetails) {
          return validateInjuryDetails(data);
        }
        return true;
      }
      return true;
    },
    {
      message: 'Injury details must be filled if any injury occurred',
      path: ['firstAider', 'injuryNature'],
    }
  )
  .refine(
    (data) => {
      const { injuryReportedOnDate, eventLogOnDate, eventOnDate } = data;

      // Check if injuryReportedOnDate >= eventLogOnDate
      const isInjuryReportedValid = injuryReportedOnDate && eventLogOnDate ? !isBefore(injuryReportedOnDate, eventLogOnDate) : true;

      // Check if eventLogOnDate >= eventOnDate
      const isInjuryNotBeforeEventOn = injuryReportedOnDate && eventOnDate ? !isBefore(injuryReportedOnDate, eventOnDate) : true;

      return isInjuryReportedValid && isInjuryNotBeforeEventOn;
      /* return true; */
    },
    {
      message: 'Injury Reported on Date cannot be earlier than Incident Date or Incident Log on Date',
      path: ['injuryReportedOnDate'],
    }
  )
  /* .refine(
    (data) => {
      if (data.firstAidOnDate && data.injuryReportedOnDate) {
        return !isBefore(stripTime(data.firstAidOnDate), stripTime(data.injuryReportedOnDate));
      }
      return true;
    },
    {
      message: 'First Aid Date cannot be earlier than Injury Reported Date',
      path: ['firstAidOnDate'],
    }
  ) */
  .refine(
    (data) => {
      if (data.immActionOnDate) {
        /* if (data.reportType == 'INJU' || data.anyInjury == 'Y') {
          if (data.injuryReportedOnDate) {
            return !isBefore(stripTime(data.immActionOnDate), stripTime(data.firstAidOnDate));
          }
        } else { */
          return !isBefore(stripTime(data.immActionOnDate), stripTime(data.eventLogOnDate));
       // }
      }
      return true;
    },
    {
      message: 'Date Completed (Immediate Corrective Action) cannot be earlier than  Incident Log Date',
      path: ['immActionOnDate'],
    }
  )
  .refine(
    (data) => {
      if (data.feasibleActionOnDate && data.immActionOnDate) {
        return !isBefore(stripTime(data.feasibleActionOnDate), stripTime(data.immActionOnDate));
      }
      return true;
    },
    {
      message: 'Proposed Completion Date cannot be earlier than Date Completed (Immediate Corrective Action)',
      path: ['feasibleActionOnDate'],
    }
  )
  .refine(
    (data) => {
      if (data.supervisorOnDate && data.immActionOnDate) {
        return !isBefore(stripTime(data.supervisorOnDate), stripTime(data.immActionOnDate));
      }
      return true;
    },
    {
      message: 'Supervisor Date cannot be earlier than Date Completed (Immediate Corrective Action)',
      path: ['supervisorOnDate'],
    }
  )
  .refine(
    (data) => {
      if (data.managerOnDate && data.immActionOnDate) {
        return !isBefore(stripTime(data.managerOnDate), stripTime(data.immActionOnDate));
      }
      return true;
    },
    {
      message: 'Manager Date cannot be earlier than Date Completed (Immediate Corrective Action)',
      path: ['managerOnDate'],
    }
  )
  .refine(
    (data) => {
      if (data.feasibleActionOnDate && data.eventOnDate) {
        return !isBefore(stripTime(data.feasibleActionOnDate), stripTime(data.eventOnDate));
      }
      return true;
    },
    {
      message: 'Date and Time of the incident cannot be after Proposed Completion Date',
      path: ['feasibleActionOnDate'],
    }
  )
  .refine(
    (data) => {
      if (data.feasibleActionOnDate && data.eventLogOnDate) {
        return !isBefore(stripTime(data.feasibleActionOnDate), stripTime(data.eventLogOnDate));
      }
      return true;
    },
    {
      message: 'Incident Log on Date cannot be after Proposed Completion Date',
      path: ['feasibleActionOnDate'],
    }
  )
  .refine(
    (data) => {
      if (data.completeOnDate && data.eventOnDate) {
        return !isBefore(stripTime(data.completeOnDate), stripTime(data.eventOnDate));
      }
      return true;
    },
    {
      message: 'Incident Date cannot be after Action Completed On Date',
      path: ['completeOnDate'],
    }
  )
  .refine(
    (data) => {
      if (data.completeOnDate && data.eventLogOnDate) {
        return !isBefore(stripTime(data.completeOnDate), stripTime(data.eventLogOnDate));
      }
      return true;
    },
    {
      message: 'Incident Log on Date cannot be after Action Completed On Date',
      path: ['completeOnDate'],
    }
  ).refine(
    (data) => {
      if (data.completeOnDate && data.immActionOnDate) {
        return !isBefore(stripTime(data.completeOnDate), stripTime(data.immActionOnDate));
      }
      return true;
    },
    {
      message: 'Date Completed (Immediate Corrective Action) cannot be after Action Completed On Date',
      path: ['immActionOnDate'],
    }
  )
  .refine(
    (data) => {
      if (data.immActionOnDate && data.eventOnDate) {
        return !isBefore(stripTime(data.immActionOnDate), stripTime(data.eventOnDate));
      }
      return true;
    },
    {
      message: 'Date and Time of the incident cannot be after Date Completed (Immediate Corrective Action)',
      path: ['immActionOnDate'],
    }
  )
  .refine(
    (data) => {
      if (data.supervisorOnDate && data.managerOnDate) {
        return !isBefore(stripTime(data.managerOnDate), stripTime(data.supervisorOnDate));
      }
      return true;
    },
    {
      message: 'Supervisor Date cannot be after Manager Date',
      path: ['supervisorOnDate'],
    }
  )
  .refine(
    (data) => {
      if (data.feasibleActionOnDate && data.feasibleReminderDate) {
        return !isBefore(stripTime(data.feasibleActionOnDate), stripTime(data.feasibleReminderDate));
      }
      return true;
    },
    {
      message: 'Proposed Completion Date cannot be earlier than Reminder Date',
      path: ['feasibleActionOnDate'],
    }
  )
/* ========================================================================================
   ========================================================================================
   ========================================================================================
   ========================================================================================
   Default Values
   ======================================================================================== */

export const IncidentFormDefaultValues: IncidentFormSchemaType = {
  //event Type
  reportType: 'INCI',
  worksite: '',
  incidentId: 0,
  status: 'O',
  internalStatus: 'O',
  confirmByEmp:false,
  confirmByMgr:false,
  // 1. employee details ========================================
  // A: Personal

  empId: 0,
  empName: '',
  gender: '',
  dob :undefined,
  // B: Contact
  address: '',
  homePhone: '',
  personalEmail: '',
  //confirmEmail: '',

  //  C: Work
  depotCode: '', //getUpperLevelMasterData()?.defaultDepotCode || '',
  department: '',
  occupation: '',

  // 2. Event details ========================================
  // A: Time & Place of the event
  eventOnDate: new Date(),
  //empname: '',
  accidentPlace: '',
  normalOvertime: 'N', //No

  // B: Job Details
  jobPerformed: '',
  anyInstruction: 'N', //No
  instruction: '',

  // C: Event Log Details
  eventDesc: '',
  eventEmpName: '',
  eventLogOnDate: new Date(new Date().setHours(0, 0, 0, 0)),

  // D: Witness
  witnesses: '',
  eventSupervisor: '', //getUpperLevelMasterData()?.reportToName || '',
  anyInjury: 'N',

  // Report Type - Incident Specific
  // A: Oil Spill Details
  oilSpill: undefined,
  incidentDec: '',
  areaContain: undefined,
  outsideService:undefined,
  outsideServiceName:'',
  injuryInvolve: undefined,
  whoInvolve: undefined,
  involverAddress: '',
  involverEmail: null,
  involverContact: '',
  involverName: '',

  // B: Containment Details
  //containTime: null,
  containNote: '',
  containTimeDate:undefined,
  authInform: undefined,

  // Report Type - Accident Specific
  ////Cookers Truck
  cookersTruck: '',
  driver: '',
  driverLicence: '',
  regoNo:'',
  ////Impact Details
  driverCondi: '',
  vehicleCondi: '',

  ////Action details
  actionTaken: '',
  othVehicleInvolve: undefined,

  ////Other truck details

  othDriver: '',
  othDriverLicence: '',
  othDriverContact: '',
  othVehicle: '',
  othDriverCondi: '',
  othVehicleCondi: '',
  othActionTaken: '',

  //Injury
  treatmentgiven:'A',
  firstAider: '',
  injuryReportedOnDate: undefined,
  injuryReportedTo: '',
  injuryNature: '',
  partInjured: '',
  firstAidType: 'Select',
  doctor: '',
  hospital: '',
  treatment: '',
  workClaimNo: '',
  workInform: undefined,
  notifyHo: undefined,
  informDateOn: undefined,
  claimApprovalOnDate:undefined,
  claimLodgementOnDate:undefined,
  insurer:'',
  claimStatus:'',

  ////Close details
  immCorrectAction: '',
  immActionBy: '',
  feasibleActionType: 'Select',
  feasibleAction: '',
  feasibleActionBy: '',
  supervisor: '',
  managerComm: '',
  manager: '',
  createdOn: new Date(),
  createdBy: '',
  closedBy: '',
  closedOn: undefined,
  evidenceAttach: undefined,
  signedByAll: 'N',
  immActionOnDate: undefined,
  feasibleActionOnDate: undefined,
  feasibleReminderDate: undefined,
  completeOnDate: undefined,
  supervisorOnDate: undefined,
  managerOnDate: undefined,
  incidentResource: [] as DocDetailModel[],
  driverId: 0,
  furtherCorrectAction: undefined,
  acceptOnBehalfEmp:false,
  empAcceptBy:"",
  empAcceptOn: "",
  mgrAcceptBy:  "",
  mgrAcceptOn:  "",
  isManager:false,
  createdByName: "",
  empAcceptByName: "",
  mgrAcceptByName: "",
  //

  //
};
