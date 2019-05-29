import { Action } from '@ngrx/store';

export enum CloseDayActionTypes {
    LoadDenominations = '[Close Day] Load Denominations',
    ChangeDenomination = '[Close Day] Change Denomination'
}

export class LoadDenominations implements Action {
    readonly type = CloseDayActionTypes.LoadDenominations;
    constructor() { }
}

export class ChangeDenomination implements Action {
    readonly type = CloseDayActionTypes.ChangeDenomination;
    constructor(public payload: any) { }
}

export type CloseDayActions = LoadDenominations
    | ChangeDenomination;
