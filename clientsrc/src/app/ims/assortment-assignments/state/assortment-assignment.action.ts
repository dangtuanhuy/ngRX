import { Action } from '@ngrx/store';
import { AssortmentModel } from '../../assortments/assortment.model';

export enum AssortmentActionTypes {
  GetAssortmentAssignment = '[AssortmentAssignment] Get Assortments Assignment',
  GetAssortmentAssignmentSuccess = '[AssortmentAssignment] Get Assortments Assignment Success',
  GetAssortmentAssignmentByName = '[AssortmentAssignment] Get Assortments Assignment by name',
  GetAllAssortmentAssignment = '[AssortmentAssignment] Get All Assortments Assignment',
  GetAssortmentAssignmentSelected = '[AssortmentAssignment] Get Assortments Assignment Selected',
  ResetAssortmentAssignment = '[AssortmentAssignment] Reset Assortments Assignment'
}


export class GetAssortmentAssignmentSuccess implements Action {
  readonly type = AssortmentActionTypes.GetAssortmentAssignmentSuccess;
  constructor(public payload: AssortmentModel) { }
}

export class GetAssortmentAssignmentByName implements Action {
    readonly type = AssortmentActionTypes.GetAssortmentAssignmentByName;
    constructor(public payload: string) { }
}

export class GetAllAssortmentAssignment implements Action {
  readonly type = AssortmentActionTypes.GetAllAssortmentAssignment;
  constructor() { }
}

export class GetAssortmentAssignmentSelected implements Action {
  readonly type = AssortmentActionTypes.GetAssortmentAssignmentSelected;
  constructor(public payload: string) { }
}

export class ResetAssortmentAssignment implements Action {
  readonly type = AssortmentActionTypes.ResetAssortmentAssignment;
  constructor() { }
}

export type AssortmentAssignmentActions =
| GetAssortmentAssignmentSuccess
| GetAssortmentAssignmentByName
| ResetAssortmentAssignment
| GetAssortmentAssignmentSelected
| GetAllAssortmentAssignment;
