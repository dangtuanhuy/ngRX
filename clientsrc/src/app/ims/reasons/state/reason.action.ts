import { Action } from '@ngrx/store';
import { ReasonModel } from '../reason.model';
import { FormState } from 'src/app/shared/base-model/form.state';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';

export enum ReasonActionTypes {
    GetReasons = '[Reason] Get Reasons',
    GetReason = '[Reason] Get Reason',
    GetReasonsSuccess = '[Reason] Get Reasons Success',
    GetReasonSuccess = '[Reason] Get Reason Success',
    GetReasonsFail = '[Reason] Get Reasons Fail',
    AddReason = '[Reason] Add Reason',
    AddReasonSuccess = '[Reason] Add Reason Success',
    AddReasonFail = '[Reason] Add Reason Fail',
    UpdateReason = '[Reason] Update Reason',
    UpdateReasonSuccess = '[Reason] Update Reason Success',
    UpdateReasonFail = '[Reason] Update Reason Fail',
    DeleteReason = '[Reason] Delete Reason',
    DeleteReasonSuccess = '[Reason] Delete Reason Success',
    DeleteReasonFail = '[Reason] Delete Reason Fail',
}

export class GetReasons implements Action {
    readonly type = ReasonActionTypes.GetReasons;
    constructor(public payload: PagingFilterCriteria, public queryText: string) { }
}

export class GetReason implements Action {
    readonly type = ReasonActionTypes.GetReason;
    constructor(public payload: string) { }
}

export class GetReasonsSuccess implements Action {
    readonly type = ReasonActionTypes.GetReasonsSuccess;
    constructor(public payload: PagedResult<ReasonModel>) { }
}

export class GetReasonSuccess implements Action {
    readonly type = ReasonActionTypes.GetReasonSuccess;
    constructor(public payload: ReasonModel) { }
}

export class GetReasonsFail implements Action {
    readonly type = ReasonActionTypes.GetReasonsFail;
    constructor(public payload: null) { }
}

export class AddReason implements Action {
    readonly type = ReasonActionTypes.AddReason;
    constructor(public payload: ReasonModel) { }
}

export class AddReasonSuccess implements Action {
    readonly type = ReasonActionTypes.AddReasonSuccess;
    constructor(public payload: ReasonModel) { }
}

export class AddReasonFail implements Action {
    readonly type = ReasonActionTypes.AddReasonFail;
    constructor(public payload: string) { }
}

export class UpdateReason implements Action {
    readonly type = ReasonActionTypes.UpdateReason;
    constructor(public payload: ReasonModel) { }
}

export class UpdateReasonSuccess implements Action {
    readonly type = ReasonActionTypes.UpdateReasonSuccess;
    constructor(public payload: ReasonModel) { }
}

export class UpdateReasonFail implements Action {
    readonly type = ReasonActionTypes.UpdateReasonFail;
    constructor(public payload: string) { }
}

export class DeleteReason implements Action {
    readonly type = ReasonActionTypes.DeleteReason;
    constructor(public payload: string) { }
}

export class DeleteReasonSuccess implements Action {
    readonly type = ReasonActionTypes.DeleteReasonSuccess;
    constructor(public payload: string) { }
}

export class DeleteReasonFail implements Action {
    readonly type = ReasonActionTypes.DeleteReasonFail;
    constructor(public payload: string) { }
}

export type ReasonActions =
    GetReasons
    | GetReasonsSuccess
    | GetReasonSuccess
    | GetReasonsFail
    | AddReason
    | AddReasonSuccess
    | AddReasonFail
    | UpdateReason
    | UpdateReasonSuccess
    | UpdateReasonFail
    | DeleteReason
    | DeleteReasonSuccess
    | DeleteReasonFail;
