import { Action } from '@ngrx/store';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { StoreSaleTargetModel, SaleTargetModel, UpdateSaleTargetModel, ReportSaleTargetModel } from '../sale-target.model';

export enum SaleTargetActionTypes {
    ListPage = '[Sale Target] Update list page',
    GetStores = '[Sale Target] Get Stores',
    GetStoresSuccess = '[Sale Target] Get Stores Success',
    GetStoresFail = '[Sale Target] Get Stores Fail',
    AddSaleTarget = '[Sale Target] Add Sale Target',
    AddSaleTargetSuccess = '[Sale Target] Add Sale Target Success',
    AddSaleTargetFail = '[Sale Target] Add Sale Target Fail',
    UpdateSaleTarget = '[Sale Target] Update Sale Target',
    UpdateSaleTargetSuccess = '[Sale Target] Update Sale Target Success',
    UpdateSaleTargetFail = '[Sale Target] Update Sale Target Fail',
    DeleteSaleTarget = '[Sale Target] Delete Sale Target',
    DeleteSaleTargetSuccess = '[Sale Target] Delete Sale Target Success',
    DeleteSaleTargetFail = '[Sale Target] Delete Sale Target Fail',
    GetReportSaleTarget = '[Sale Target] Get Report Sale Target',
    GetReportSaleTargetSuccess = '[Sale Target] Get Report Sale Target Success',
    ChangeState = '[Sale Target] Change state'
}

export class ListPage implements Action {
    readonly type = SaleTargetActionTypes.ListPage;
    constructor(public payload: PagedResult<StoreSaleTargetModel>) { }
}

export class GetStores implements Action {
    readonly type = SaleTargetActionTypes.GetStores;
    constructor(public payload: PagingFilterCriteria) { }
}

export class GetStoresSuccess implements Action {
    readonly type = SaleTargetActionTypes.GetStoresSuccess;
    constructor(public payload: PagedResult<StoreSaleTargetModel>) { }
}

export class GetStoresFail implements Action {
    readonly type = SaleTargetActionTypes.GetStoresFail;
    constructor() { }
}

export class AddSaleTarget implements Action {
    readonly type = SaleTargetActionTypes.AddSaleTarget;
    constructor(public payload: SaleTargetModel) { }
}

export class AddSaleTargetSuccess implements Action {
    readonly type = SaleTargetActionTypes.AddSaleTargetSuccess;
    constructor(public payload: any) { }
}

export class AddSaleTargetFail implements Action {
    readonly type = SaleTargetActionTypes.AddSaleTargetFail;
    constructor() { }
}


export class UpdateSaleTarget implements Action {
    readonly type = SaleTargetActionTypes.UpdateSaleTarget;
    constructor(public payload: UpdateSaleTargetModel) { }
}

export class UpdateSaleTargetSuccess implements Action {
    readonly type = SaleTargetActionTypes.UpdateSaleTargetSuccess;
    constructor(public payload: UpdateSaleTargetModel) { }
}

export class UpdateSaleTargetFail implements Action {
    readonly type = SaleTargetActionTypes.UpdateSaleTargetFail;
    constructor() { }
}

export class DeleteSaleTarget implements Action {
    readonly type = SaleTargetActionTypes.DeleteSaleTarget;
    constructor(public payload: string) { }
}

export class DeleteSaleTargetSuccess implements Action {
    readonly type = SaleTargetActionTypes.DeleteSaleTargetSuccess;
    constructor(public payload: string) { }
}

export class DeleteSaleTargetFail implements Action {
    readonly type = SaleTargetActionTypes.DeleteSaleTargetFail;
    constructor() { }
}

export class GetReportSaleTarget implements Action {
    readonly type = SaleTargetActionTypes.GetReportSaleTarget;
    constructor(public payload: PagingFilterCriteria, public channelId: string, public date: string) { }
}

export class GetReportSaleTargetSuccess implements Action {
    readonly type = SaleTargetActionTypes.GetReportSaleTargetSuccess;
    constructor(public payload: Array<ReportSaleTargetModel>) { }
}

export class ChangeState implements Action {
    readonly type = SaleTargetActionTypes.ChangeState;
    constructor(public payload: boolean) { }
}

export type SaleTargetActions = ListPage
| GetStores
| GetStoresSuccess
| GetStoresFail
| AddSaleTarget
| AddSaleTargetSuccess
| AddSaleTargetFail
| UpdateSaleTarget
| UpdateSaleTargetSuccess
| UpdateSaleTargetFail
| DeleteSaleTarget
| DeleteSaleTargetSuccess
| DeleteSaleTargetFail
| GetReportSaleTarget
| GetReportSaleTargetSuccess
| ChangeState;

