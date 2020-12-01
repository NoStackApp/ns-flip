export const types = {
  LIST: 'list',
  SET: 'set',
}
export const DONE = 'done'
export const ADD_NEW = 'addNew'
export const TO_EDIT = 'toEdit'
export const EDIT_OPTIONS = 'editOptions'
export const EDIT = 'edit'

export interface AnswersForStaticInstanceSpec {
  'toEdit': AnswerValue;
  'editOptions': any;
  'edit': any;
}

export interface AnswerValue {
  name: string;
  typeOfValue: string;
  required?: boolean;
  index?: number;
}
