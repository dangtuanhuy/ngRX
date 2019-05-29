import { Action } from '@ngrx/store';

export enum UserActionTypes {
  LoginSuccessul = '[User] Login Successful',
  GetCurrentUserId = '[User] Get Current User',
}

export class LoginSuccessul implements Action {
  readonly type = UserActionTypes.LoginSuccessul;

  constructor(public payload: any) { }
}

export class GetCurrentUserId implements Action {
  readonly type = UserActionTypes.GetCurrentUserId;
  constructor(public payload: string) { }
}

export type UserActions = LoginSuccessul | GetCurrentUserId;
