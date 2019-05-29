import { Action } from '@ngrx/store';
import { FieldValue } from '../field-value';

export enum FieldActionTypes {
    Load = '[Field] Load',
    Save = '[Field] Save'
}

export class Load implements Action {
    readonly type = FieldActionTypes.Load;
    constructor(public payload: FieldValue<any>[]) { }
}

export type FieldActions = Load;
