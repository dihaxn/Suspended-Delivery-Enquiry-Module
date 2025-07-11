export interface CustomerFeedbackAnalysis {
  fromDate: string;
  toDate: string;
  periodType: string;
  currentYear: string;
  indexText: string;
  depot: string;
  status: string;
  nature: string;
  feedback: string;
  issue: string;
  classification: string;
  isFpmu?: 'Y' | 'N';
  // originator: string;
  //proxyUser:string;
}