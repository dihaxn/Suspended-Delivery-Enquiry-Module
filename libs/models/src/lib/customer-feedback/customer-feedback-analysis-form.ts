export interface CustomerFeedbackAnalysisFormData {
  reportItem: string;
  targetPeriod: string;
  targetYear: string;
  targetFinYear: string;
  dateFrom: Date;
  dateTo: Date;
  depot: string;
  //status: string;
  nature: string;
  feedbackClassification: string;
  issueClassification: string;
  isFpmu?: 'Y' | 'N';
}