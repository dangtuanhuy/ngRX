import { User } from '../base-model/user.model';
import { Action } from '@ngrx/store';

export enum AppActionTypes {
    GetUsersSuccessAction = '[App] Get Users Success',
}

export class GetUsersSuccessAction implements Action {
    readonly type = AppActionTypes.GetUsersSuccessAction;
    constructor(public payload: User[]) { }
}

export type AppActions =
    GetUsersSuccessAction
 ;
