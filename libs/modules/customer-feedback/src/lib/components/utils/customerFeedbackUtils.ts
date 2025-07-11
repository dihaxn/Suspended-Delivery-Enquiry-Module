import { CustomerFeedbackMasterData, LookupTable } from "@cookers/models";

export const colorSelectorByStatusName = (status: string): 'blue' | 'amber' | 'red' | 'green' | 'violet' | 'gray' => {
  switch (status) {
    case 'Completed':
      return 'green';
    case 'Received':
      return 'amber';
    case 'Investigated':
      return 'blue';
    default:
      return 'gray'; 
  }
};

export function findPersonByOriginator(masterData : CustomerFeedbackMasterData, originator: string | LookupTable) {
  const obj = masterData.personRaisedList.find(person => person.originator === originator);
  return { label : obj?.name??'', value: obj?.originator??''}
}

export function getValueFromObj<T extends object, K extends keyof T>(
  input: T | string,
  property: K
): T[K] | string {
  if (typeof input === 'object' && input !== null) {
    return input[property];
  }
  return input;
}