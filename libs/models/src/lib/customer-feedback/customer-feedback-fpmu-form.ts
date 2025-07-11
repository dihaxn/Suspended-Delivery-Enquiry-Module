export interface CustomerFeedbackFPMUFormData {
  dateFrom: Date;
  dateTo: Date;
  depot: string;
  status: string;
  isFpmu: 'Y' | 'N';
  exportType?: 'PDF' | 'EXCEL' | 'VIEW';
  periodType?: string;
}
