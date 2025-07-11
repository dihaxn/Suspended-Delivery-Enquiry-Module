import { z } from 'zod';

const dropdownField = (message: string) => z.union([z.object({ label: z.string(), value: z.string(), other: z.string().optional() }).refine((obj) => obj.label !== '' && obj.value !== '', { message }), z.string().min(1, { message })]);

const dateField = (message: string) =>
  z
    .string({
      required_error: message,
      invalid_type_error: message,
    })
    .nonempty(message);

// 1. Feedback Details Section
export const customerFeedbackDetailsSchema = z.object({
  feedbackDetails: z.object({
    raisedBy: dropdownField('Please select the Person Raised'),
    complaintOnDate: dateField('Please select the Received Date'),
    feedbackType: dropdownField('Please select the Feedback Classification'),
    nature: dropdownField('Please select the Nature'),
    issue: z.string().min(1, 'Please enter the Issue/Opportunity'),
  }),
  customerDetails: z.object({
    custCode: dropdownField('Please select the Customer'),
    contact: z.string().optional(),
    phone: z.string().min(1, 'Phone number is required'),
    size: z.string().optional(),
    address: z.string().min(1, 'Address is required'),
    depotCode: dropdownField('Please select the Depot'),
  }),
  productDetails: z.object({
    catlogCode: dropdownField('Please select the Product'),
    batchNo: z.string().optional(),
    packType: z.string().optional(),
    domDate: z.union([z.string(), z.null()]).optional(),
  }),
  communicationDetails: z
    .object({
      recordedBy: dropdownField('Please select the person who spoke to the customer'),
      whatDiscussed: z.string().min(1, 'Please enter the discussion details'),
      sampleTaken: z.string(),
      sampleCollectedBy: z.string().optional(),
      sampleQty: z.string().optional(),
      sampleCollectedOnDate: z.union([z.string(), z.null()]).optional(),
    })
    .superRefine((val, ctx) => {
      if (val.sampleTaken === 'Y') {
        if (!val.sampleCollectedBy || (typeof val.sampleCollectedBy === 'string' && val.sampleCollectedBy === '')) {
          ctx.addIssue({
            path: ['sampleCollectedBy'],
            code: z.ZodIssueCode.custom,
            message: 'Please select the person who collected the sample',
          });
        }
        if (!val.sampleQty || val.sampleQty === '') {
          ctx.addIssue({
            path: ['sampleQty'],
            code: z.ZodIssueCode.custom,
            message: 'Please enter the quantity of the collected sample',
          });
        }
        if (!val.sampleCollectedOnDate || val.sampleCollectedOnDate === '') {
          ctx.addIssue({
            path: ['sampleCollectedOnDate'],
            code: z.ZodIssueCode.custom,
            message: 'Please select the collected date',
          });
        }
      }
    }),
});

// 2. Actions Section
export const customerFeedbackActionsSchema = z.object({
  immediateActions: z
    .object({
      immediateAction: z.string().optional(),
      immActionBy: z.union([z.string(), z.null()]).optional(),
      immActionOnDate: z.union([z.string(), z.null()]).optional(),
      productIsolated: z.string().optional(),
      investigation: z.string().optional(),
      issueDueTo: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.immediateAction?.trim() || data.immActionBy?.trim() || data.productIsolated?.trim() || data.immActionOnDate || data.investigation?.trim() || data.issueDueTo?.trim()) {
        if (!data.immediateAction?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please enter the Immediate Action',
            path: ['immediateAction'],
          });
        }
        if (!data.immActionBy?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please enter who took the Immediate Action',
            path: ['immActionBy'],
          });
        }
        if (!data.immActionOnDate?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please select the Immediate Action Date',
            path: ['immActionOnDate'],
          });
        }
        if (!data.productIsolated?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please choose, Has Product been Isolated?',
            path: ['productIsolated'],
          });
        }
        if (!data.investigation?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please enter the Investigation and Findings',
            path: ['investigation'],
          });
        }
        if (!data.issueDueTo?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please choose, Is Issue Due to Cookers or Customer',
            path: ['issueDueTo'],
          });
        }
      }
    }),
  correctiveActions: z
    .object({
      corrActionDesc: z.string().optional(),
      corrActionBy: z.union([z.string(), z.null()]).optional(),
      corrActionOnDate: z.union([z.string(), z.null()]).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.corrActionDesc?.trim() || data.corrActionBy?.trim() || data.corrActionOnDate?.trim()) {
        if (!data.corrActionDesc?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please enter the Corrective Action',
            path: ['corrActionDesc'],
          });
        }
        if (!data.corrActionBy?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please enter who took the Corrective Action',
            path: ['corrActionBy'],
          });
        }
        if (!data.corrActionOnDate?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please select the Corrective Action Date',
            path: ['corrActionOnDate'],
          });
        }
      }
    }),
  preventativeActions: z
    .object({
      corrActionComplDesc: z.string().optional(),
      preventActionBy: z.union([z.string(), z.null()]).optional(),
      corrActionComplOnDate: z.union([z.string(), z.null()]).optional(),
      corrActionNeedToDo: z.string().optional(),
      corrActionFixIssue: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.corrActionComplDesc?.trim() || data.preventActionBy?.trim() || data.corrActionComplOnDate?.trim() || data.corrActionNeedToDo?.trim() || data.corrActionFixIssue?.trim() === 'N') {
        if (!data.corrActionComplDesc?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please enter the Preventative Action',
            path: ['corrActionComplDesc'],
          });
        }
        if (!data.preventActionBy?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please enter who took the Preventative Action',
            path: ['preventActionBy'],
          });
        }
        if (!data.corrActionComplOnDate?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please select the Preventative Action Date',
            path: ['corrActionComplOnDate'],
          });
        }
        if (!data.corrActionNeedToDo?.trim() && data.corrActionFixIssue === 'N') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please enter what needs to be done',
            path: ['corrActionNeedToDo'],
          });
        }
        if (!data.corrActionFixIssue?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please choose, Has CPA taken fixed the issue?',
            path: ['corrActionFixIssue'],
          });
        }
      }
    }),
});

// 3. Closeout Section
export const customerFeedbackCloseoutSchema = z
  .object({
    custResSentBy: z.union([z.string(), z.null()]).optional(),
    custResOnDate: z.union([z.string(), z.null()]).optional(),
    custResComments: z.string().optional(),
    completedBy: z.string().optional(),
    title: z.string().optional(),
    completedOnDate: z.union([z.string(), z.null()]).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.custResSentBy?.trim() || data.custResOnDate?.trim() || data.custResComments?.trim() || data.completedBy?.trim() || data.title?.trim() || data.completedOnDate?.trim()) {
      if (!data.custResSentBy?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter who sent the response to the customer',
          path: ['custResSentBy'],
        });
      }
      if (!data.custResOnDate?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter the date when the response was sent to the customer',
          path: ['custResOnDate'],
        });
      }
      if (!data.custResComments?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter the response to customer',
          path: ['custResComments'],
        });
      }
    }
  });

// Main schema (composed)
export const customerFeedbackEntrySchema = z
  .object({
    complaintRequest: customerFeedbackDetailsSchema,
    complaintActions: customerFeedbackActionsSchema.optional(),
    complaintCloseout: customerFeedbackCloseoutSchema.optional(),
    actionType: z.enum(['R', 'I', 'C']).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.actionType === 'C') {
      const actions = data.complaintActions;
      const closeout = data.complaintCloseout;
      if (!actions) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Actions section is required for Close Out Customer feedback',
          path: ['complaintActions'],
        });
        return;
      }
      if (!closeout) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Close Out section is required for Close Out Customer feedback',
          path: ['complaintActions'],
        });
        return;
      }
      // Helper to check all fields in an object are non-empty
      const checkActionsFields = (obj: Record<string, unknown>, path: (string | number)[]) => {
        for (const key in obj) {
          // Special case for corrActionNeedToDo: only require if corrActionFixIssue !== 'N'
          if (key === 'corrActionNeedToDo' && obj['corrActionFixIssue'] === 'Y') {
            continue;
          }
          const value = obj[key];
          if (typeof value === 'string' && !value.trim()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Please fill all the mandatory fields`,
              path: ['complaintActions', ...path, key],
            });
          } else if (value === undefined || value === null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Please fill all the mandatory fields`,
              path: ['complaintActions', ...path, key],
            });
          }
        }
      };

      const checkCloseOutFields = (obj: Record<string, unknown>, path: (string | number)[]) => {
        for (const key in obj) {
          if (key === 'completedBy' || key === 'title' || key === 'completedOnDate') {
            continue;
          }
          const value = obj[key];
          if (typeof value === 'string' && !value.trim()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Please fill all the mandatory fields`,
              path: [...path, key],
            });
          } else if (value === undefined || value === null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Please fill all the mandatory fields`,
              path: [...path, key],
            });
          }
        }
      };

      checkActionsFields(actions.immediateActions || {}, ['immediateActions']);
      checkActionsFields(actions.correctiveActions || {}, ['correctiveActions']);
      checkActionsFields(actions.preventativeActions || {}, ['preventativeActions']);
      checkCloseOutFields(closeout || {}, ['complaintCloseout']);
    }
  });
