import { z } from 'zod';
import { getUserFromLocalStorage } from '@cookers/utils';
export type SupplierNcrFormSchemaType = z.infer<typeof supplierNcrFormSchema>;

export type SupplierNcrFormSchemaApiType = Omit<SupplierNcrFormSchemaType, 'supplierNcrRequest' | 'supplierNcrResource'> & {
  supplierNcrRequest: Omit<SupplierNcrFormSchemaType['supplierNcrRequest'], 'supplierCode' | 'catalogCode' | 'raisedBy'> & {
    supplierCode: string;
    catalogCode: string;
    raisedBy:string
  };
  supplierNcrResource: Array<{
    documentId: number;
    documentName: string;
    path: string;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    stepId: number;
    documentFile: any;
    extension: string;
    detailedExtension: string;
  }>;
};

export const supplierNcrFormSchema = z.object({
  supplierNcrRequest: z.object({
    supplierNcrId: z.number(),
    raisedBy: z.object({ label: z.string(), value: z.string() }).refine((obj) => obj.label !== '' && obj.value !== '', { message: 'Please select the Person Raised' }),
    depotCode: z.string().nonempty('Please select the Depot (Cookers Site)'),
    supplierCode: z.object({ label: z.string(), value: z.string() }).refine((obj) => obj.label !== '' && obj.value !== '', { message: 'Please select the Supplier' }),
    catalogCode: z.object({ label: z.string(), value: z.string(), other: z.string().optional() }).refine((obj) => obj.label !== '' && obj.value !== '', { message: 'Please select the Product' }),
    //catalogCode: z.string().nonempty('Please select the Product'),
    batchNo: z.string(),
    classification: z.string().nonempty('Please select the Classification'),
    //dateOfMan: z.string(),
    dateOfMan: z.union([z.string(), z.null()]).optional(),
    reason: z.string().nonempty('Please enter the Reason for Non-Conformance'),
    immActionDesc: z.string().nonempty('Please enter the Immediate Action Required'),
    createdBy: z.string(),
    createdDate: z.string(),
    lastModifiedBy: z.string(),
    lastModifiedDate: z.string(),
    refCode: z.string(),
    receivedDate: z.string({
      required_error: 'Please select the Date (Reported Date)',
      invalid_type_error: 'Please select the Date (Reported Date)',
    }).nonempty('Please select the Date (Reported Date)'),
    invoiceNo: z.string(),
    status: z.string(),
  }),
  supplierNcrCloseOut: z
    .object({
      // supplierNcrId: z.number(),
      suppRespBy: z.string().optional(),
      suppRespTitle: z.string().optional(),
      suppRespOn: z.union([z.string(), z.null()]).optional(),
      anyFurtherAction: z.string(),
      closeOutCommOn: z.union([z.string(), z.null()]).optional(),
      closeOutComm: z.string().optional(),
      closeOutBy: z.string().optional(),
      closeOutTitle: z.string().optional(),
      closeOutOn: z.string().optional(),
      // closeOutStatus: z.string(),
      rootCause: z.string().optional(),
      corrActionDesc: z.string().optional(),
      preventiveAction: z.string().optional(),
      readyForCompletionBy: z.string().optional(),
      readyForCompletionOn: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.rootCause?.trim() || data.corrActionDesc?.trim() || data.preventiveAction?.trim()) {
        if (!data.suppRespTitle?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Title of the Contact is required',
            path: ['suppRespTitle'],
          });
        }
        if (!data.suppRespBy?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Supplier Contact is required',
            path: ['suppRespBy'],
          });
        }
        if (!data.suppRespOn?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Responded Date is required',
            path: ['suppRespOn'],
          });
        }
      }
      if (data.anyFurtherAction === 'Y' && !data.closeOutComm?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Further Action is required when 'Any Further Action?' is Yes",
          path: ['closeOutComm'], // points to the exact field
        });
      }
      if (data.anyFurtherAction === 'Y' && !data.closeOutCommOn?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select the Date (By When)",
          path: ['closeOutCommOn'], // points to the exact field
        });
      }
    }),

  supplierNcrMessage: z.array(
    z.object({
      responseId: z.number(),
      responseOriginator: z.string(),
      // supplierNcrId: z.number(),
      responseDate: z.string({
        required_error: 'Please select the Responded Date',
        invalid_type_error: 'Please select the Responded Date',
      }),
      responseDesc: z
        .string({
          required_error: 'Please enter the Response Details',
          invalid_type_error: 'Please enter the Response Details',
        })
        .nonempty('Response Details cannot be empty'),
      stepId: z.number(),
      responseBy: z.string({
        required_error: 'Please enter the name of the Responder',
        invalid_type_error: 'Please enter the name of the Responder',
      }),
      responseTitle: z
        .string({
          required_error: 'Please enter the title of the Responder',
          invalid_type_error: 'Please enter the title of the Responder',
        })
        .nonempty('Please enter the title of the Responder'),
      createdBy: z.string(),
      createdDate: z.string(),
      lastModifiedBy: z.string(),
      lastModifiedDate: z.string(),
    })
  ),
  actionType: z.enum(['save', 'responseReceived', 'readyForCompletion', 'completed']).optional(),
  raisedByName: z.string().optional(),
});

export const supplierNcrDefaultValues: SupplierNcrFormSchemaType = {

  supplierNcrRequest: {
    supplierNcrId: 0,
    raisedBy: { label: getUserFromLocalStorage()?.name, value: getUserFromLocalStorage()?.originator },//getUserFromLocalStorage()?.name || '',
    depotCode: '',
    supplierCode: { label: '', value: '' },
    catalogCode: { label: '', value: '', other: '' },
    batchNo: '',
    classification: '',
    dateOfMan: '',
    reason: '',
    immActionDesc: '',
    createdBy: '',
    createdDate: '',
    lastModifiedBy: '',
    lastModifiedDate: '',
    refCode: '',
    receivedDate: '',
    invoiceNo: '',
    status: ''
  },
  supplierNcrCloseOut: {
    suppRespBy: '',
    suppRespTitle: '',
    suppRespOn: '',
    anyFurtherAction: '',
    closeOutCommOn: '',
    closeOutComm: '',
    closeOutBy: '',
    closeOutTitle: '',
    closeOutOn: '',
    //closeOutStatus: '',
    rootCause: '',
    corrActionDesc: '',
    preventiveAction: '',
    readyForCompletionBy: '',
    readyForCompletionOn: '',
  },
  // supplierNcrResource: [
  //   // {
  //   //   documentId: 0,
  //   //   supplierNcrId: 0,
  //   //   documentName: '',
  //   //   path: '',
  //   //   createdBy: '',
  //   //   createdDate: '',
  //   //   lastModifiedBy: '',
  //   //   lastModifiedDate: '',
  //   //   stepId: 0,
  //   //   documentFile: null,
  //   //   extension: '',
  //   //   detailedExtension: '',
  //   // },
  // ],
  supplierNcrMessage: [
    // {
    //   responseId: 0,
    //   responseOriginator: '',
    //   supplierNcrId: 0,
    //   responseDate: '',
    //   responseDesc: '',
    //   stepId: 0,
    //   responseBy: '',
    //   responseTitle: '',
    //   createdBy: '',
    //   createdDate: '',
    //   lastModifiedBy: '',
    //   lastModifiedDate: '',
    // },
  ],
   actionType:'save',
   raisedByName:''
};
