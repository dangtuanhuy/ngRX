import { Action } from '@ngrx/store';

export enum OpenDayActionTypes {
    LoadDenominations = '[Open Day] Load Denominations',
    ChangeDenomination = '[Open Day] Change Denomination'
}

export class LoadDenominations implements Action {
    readonly type = OpenDayActionTypes.LoadDenominations;
    constructor() { }
}

export class ChangeDenomination implements Action {
    readonly type = OpenDayActionTypes.ChangeDenomination;
    constructor(public payload: any) { }
}

export type OpenDayActions = LoadDenominations
    | ChangeDenomination;
