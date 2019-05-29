import { Action } from '@ngrx/store';
import { PendingSaleModel } from 'src/app/pos/shared/models/pending-sale';
import { PendingSalePagingModel } from 'src/app/pos/shared/view-models/pending-sale-paging.model';

export enum PendingSaleActionTypes {
    GetPendingSales = '[PendingSale] Get Pending Sales.',
    SearchPendingSales = '[PendingSale] Search Pending Sales.',
    GetPendingSalesSuccess = '[PendingSale] Get Pending Sales Success.',

    GetPendingSale = '[PendingSale] Get Pending Sale.',
    GetPendingSaleSuccess = '[PendingSale] Get Pending Sale Success.',
    GetPendingSaleFailure = '[PendingSale] Get Pending Sale Failure.',

    DeletePendingSale = '[PendingSale] Delete Pending Sale.',
    DeletePendingSaleSuccess = '[PendingSale] Delete Pending Sale Success.',
    DeletePendingSaleFailure = '[PendingSale] Delete Pending Sale Failure.'
}

export class GetPendingSales implements Action {
    readonly type = PendingSaleActionTypes.GetPendingSales;
    constructor(public payload: any) { }
}

export class SearchPendingSales implements Action {
    readonly type = PendingSaleActionTypes.SearchPendingSales;
    constructor(public payload: any) { }
}

export class GetPendingSalesSuccess implements Action {
    readonly type = PendingSaleActionTypes.GetPendingSalesSuccess;
    constructor(public payload: PendingSalePagingModel) { }
}

export class GetPendingSale implements Action {
    readonly type = PendingSaleActionTypes.GetPendingSale;
    constructor(public payload: string) { }
}

export class GetPendingSaleSuccess implements Action {
    readonly type = PendingSaleActionTypes.GetPendingSaleSuccess;
    constructor(public payload: PendingSaleModel) { }
}

export class GetPendingSaleFailure implements Action {
    readonly type = PendingSaleActionTypes.GetPendingSaleFailure;
    constructor(public payload: string) { }
}

export class DeletePendingSale implements Action {
    readonly type = PendingSaleActionTypes.DeletePendingSale;
    constructor(public payload: string) { }
}

export class DeletePendingSaleSuccess implements Action {
    readonly type = PendingSaleActionTypes.DeletePendingSaleSuccess;
    constructor(public payload: string) { }
}

export class DeletePendingSaleFailure implements Action {
    readonly type = PendingSaleActionTypes.DeletePendingSaleFailure;
    constructor(public payload: string) { }
}

export type PendingSaleActions = GetPendingSales
    | SearchPendingSales
    | GetPendingSalesSuccess
    | GetPendingSale
    | GetPendingSaleSuccess
    | GetPendingSaleFailure
    | DeletePendingSale
    | DeletePendingSaleSuccess
    | DeletePendingSaleFailure;
