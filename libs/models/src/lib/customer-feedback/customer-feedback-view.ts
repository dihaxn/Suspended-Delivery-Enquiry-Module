export interface CustomerFeedbackView {

// Show more
raisedByName:string,
createdOnDate: string;
natureDesc: string;
issue: string;

// Immediate Action
immActionBy: string;
immActionOnDate: string;
immediateAction: string;
investigation: string;
corrActionDesc: string;
corrActionComplDesc: string;
corrActionNeedToDo: string;
anyFurtherAction: string; // Additional field for any further action

 // Close-out Response
custResComments: string;
custResSentBy: string;
custResOnDate: string;
} 