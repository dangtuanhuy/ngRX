import { Action } from '@ngrx/store';
import { AssignmentModel } from 'src/app/shared/base-model/assignment.model';

export enum AssignmentActionTypes {
    SearchAssignment = '[Assignments] Search Assignment',
    SelectAssignment = '[Assignments] Select Assignment',
    GetSelectAssignmentSuccess = '[Assignments] Select Assignment Success',
    RemoveAssignment = '[Assignments] Remove Assignment',
    ResetAssignment = '[Assignments] Reset Assignment'
}

export class SearchAssignmentAction implements Action {
    readonly type = AssignmentActionTypes.SearchAssignment;
    constructor(public payload: Array<AssignmentModel>) { }
}

export class SelectAssignmentAction implements Action {
    readonly type = AssignmentActionTypes.SelectAssignment;
    constructor(public payload: AssignmentModel) { }
}

export class GetSelectAssignmentSucessAction implements Action {
    readonly type = AssignmentActionTypes.GetSelectAssignmentSuccess;
    constructor(public payload: Array<AssignmentModel>) { }
}

export class RemoveAssignmentAction implements Action {
    readonly type = AssignmentActionTypes.RemoveAssignment;
    constructor(public payload: AssignmentModel) { }
}

export class ResetAssignmentAction implements Action {
    readonly type = AssignmentActionTypes.ResetAssignment;
    constructor() { }
}


export type AssignmentActions =
SearchAssignmentAction
| SelectAssignmentAction
| GetSelectAssignmentSucessAction
| RemoveAssignmentAction
| ResetAssignmentAction;
