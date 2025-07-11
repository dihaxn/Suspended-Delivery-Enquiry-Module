import { z,ZodError,ZodIssueCode  } from 'zod';

const validateInjuryDetails = (data: any) => {
  const missingFields: ZodError = new ZodError([]);

  // Add individual errors for missing fields
  if (!data.firstAider) missingFields.addIssue({ path: ['firstAider'], message: 'First aider is required if there is an injury', code: ZodIssueCode.custom });
  if (!data.injuryNature) missingFields.addIssue({ path: ['injuryNature'], message: 'Injury nature is required if there is an injury', code: ZodIssueCode.custom });
  if (!data.injuryReportedOnDate) missingFields.addIssue({ path: ['injuryReportedOnDate'], message: 'Injury reported date is required', code: ZodIssueCode.custom });
  if (!data.treatment) missingFields.addIssue({ path: ['treatment'], message: 'Treatment is required if there is an injury', code: ZodIssueCode.custom });
  if (!data.aiderName) missingFields.addIssue({ path: ['aiderName'], message: 'Aider name is required if there is an injury', code: ZodIssueCode.custom });
  if (!data.firstAidOnDate) missingFields.addIssue({ path: ['firstAidOnDate'], message: 'First aid date is required', code: ZodIssueCode.custom });
  if (!data.doctor && !data.firstAidType) {
    missingFields.addIssue({
      path: ['doctor'],
      message: 'Doctor is required if first aid type is not provided',
      code: ZodIssueCode.custom,
    });
    missingFields.addIssue({
      path: ['firstAidType'],
      message: 'First aid type is required if doctor is not provided',
      code: ZodIssueCode.custom,
    });
  } else {
    // If doctor is provided, ensure hospital is also provided
    if (data.doctor && !data.hospital) {
      missingFields.addIssue({
        path: ['hospital'],
        message: 'Hospital is required if doctor is provided',
        code: ZodIssueCode.custom,
      });
    }
  }

  // If there are missing fields, throw ZodError
  if (missingFields.issues.length > 0) {
    throw missingFields;
  }

  return true; // All fields are valid
};


export const incidentSchema = z.object({
  empReportId: z.number().optional(), 
  reportType:z.string().min(1, "Report Type is required"),
  worksite:z.string().min(1, "WorkSite is required"),
  status:z.string().min(1, "Status is required"),
  //Employee Details
  empId: z
  .string()
  .optional()
  .transform((val) => {
    if (val === undefined || val === null || val.trim() === "") {
      return null;
    }
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? null : parsed;
  })
  .nullable()
  .refine((val) => val === null || (Number.isInteger(val) && val >= 0), {
    message: "Expected a non-negative integer or null",
  }),

  empName: z.string().min(1, "Employee Name is required"),
  dob: z.date().optional(),
  gender: z.string().min(1, "Gender is required"),
  homePhone: z.string().min(1, "Home Phone No is required"),
  department:z.string().optional(),
  address:z.string().optional(),
  depotCode: z.string().min(1, "Depot is required"),
  occupation: z.string().min(1, "Occupation is required"),
  
//Event
  eventOn: z.string().optional(),
  eventOnDate: z.date().optional(),
  normalOvertime: z.string().min(1, "Required"),
  jobPerformed:  z.string().min(1, "Job Performed is required"),
  accidentPlace: z.string().min(1, "Place of Accident is required"),
  witnesses:z.string().optional(),
  eventSupervisor: z.string().optional(),
  anyInstruction: z.string().optional(),
  instruction:z.string().optional(),
  eventDesc: z.string().min(1, "Event Description is required"),
  eventEmpName: z.string().min(1, "Event Employee is required"),
  eventLogOnDate: z.date(),
  eventLogOn: z.string().optional(),   
  cookersTruck:z.string().optional(),
  driver:z.string().optional(),    
  driverLicence:z.string().optional(),
  driverCondi:z.string().optional(),
  vehicleCondi:z.string().optional(),
  actionTaken:z.string().optional(),
  othVehicleInvolve:z.string().min(1, "Required"),
  othDriver:z.string().optional(),
  othDriverLicence:z.string().optional(),
  othDriverContact:z.string().optional(),
  othVehicle:z.string().optional(),
  othDriverCondi:z.string().optional(),
  othVehicleCondi:z.string().optional(),
  othActionTaken:z.string().optional(),
  injuryInvolve:z.string().optional(),
  whoInvolve:z.string().optional(), 
  involverName:z.string().optional(),
  involverContact:z.string().optional(),
  involverAddress:z.string().optional(),
  involverEmail:z.string().optional(),
  oilSpill:z.string().optional(),
  areaContain:z.string().optional(),
  containTime:z.string().optional(),
  authInform:z.string().optional(),
  containNote:z.string().optional(),
  incidentDec:z.string().optional(), 
  anyInjury  : z.string().optional(),
  
  personalEmail: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Email must be a valid email address' }),
    confirmEmail: z.string().optional(),
   // injuryDetails: injurySchema.optional(),
   firstAider: z.string().optional(),
   injuryReportedOnDate: z.date().optional(),
  injuryReportedTo: z.string().optional(),
  injuryNature: z.string().optional(),
  partInjured: z.string().optional(),
  firstAidType: z.string().optional(),
  doctor: z.string().optional(),
  hospital: z.string().optional(),
  treatment: z.string().optional(),
  workInform: z.string().optional(),
  notifyHo: z.string().optional(),
  aiderName: z.string().optional(),
  firstAidOnDate: z.date().optional(),
}).refine(data => {
  // Ensure confirmEmail matches personalEmail if personalEmail is provided
  console.log("Refinement Logic Triggered");
  if (data.personalEmail && !data.confirmEmail) {
    console.log(1);
    return false; // If personalEmail is provided, confirmEmail must also be provided
  }
  if (data.personalEmail && data.confirmEmail) {
    return data.personalEmail === data.confirmEmail;
  }
  return true; 
}, {
  message: "Confirm Email must match Personal Email",
  path: ['confirmEmail'],
}).refine(data => {
  // Conditionally validate injuryDetails if anyInjury is "yes" or reportType is "INJU"
  if (data.anyInjury === "2" || data.reportType === "INJU") {
    const hasAnyInjuryDetails = data.firstAider || data.injuryReportedOnDate || data.injuryReportedTo || data.injuryNature || data.partInjured || data.firstAidType
                                || data.doctor || data.hospital || data.treatment || data.workInform || data.notifyHo || data.aiderName || data.firstAidOnDate;
    console.log(hasAnyInjuryDetails);
    if (hasAnyInjuryDetails) {
      //return data.firstAider && data.injuryNature && data.injuryReportedOnDate &&data.treatment && data.aiderName || data.firstAidOnDate &&(data.firstAidType||(data.doctor && data.hospital));
      return validateInjuryDetails(data);
    }
    return true; // Skip validation if no injury details are provided
  }
  return true; // No injury details required if anyInjury is not "yes"
}, {
  message: "Injury details must be filled if any injury occurred",
  path: ['firstAider', 'injuryNature'], // Adjust path if necessary
 
});


/* 

.refine(data => {
  console.log("Refinement Logic Triggered 1");
  console.log(data);
  // Conditionally validate injuryDetails if anyInjury is "yes"
  if (data.anyInjury === "2" || data.reportType==="INJU") {
    console.log("Refinement Logic Triggered 2");
    console.log(data.injuryDetails);
    const injuryDetailsValid = injurySchema.safeParse(data.injuryDetails).success;
    console.log(injuryDetailsValid);
    return injuryDetailsValid; // Check if injuryDetails are valid
  }
  return true; // If no injury, skip injuryDetails validation
}, {
  message: "Injury details must be filled if any injury occurred",
  path: ['injuryDetails'], // This will point to the injuryDetails field
});

 */