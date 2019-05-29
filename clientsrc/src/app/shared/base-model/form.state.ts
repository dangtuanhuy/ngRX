import { Action } from '../constant/form-action.constant';

export class FormState {
  action: Action;
  error: string;
  constructor(action: Action, error: string) {
    this.action = action;
    this.error = error;
  }
}
