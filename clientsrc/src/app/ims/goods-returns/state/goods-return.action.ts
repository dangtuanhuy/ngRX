import { Action } from '@ngrx/store';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { InventoryTransactionGoodsReturnViewModel, ReturnOrderListModel, ReturnOrderModel } from '../goods-return.model';
import { FilterRequestModel } from '../../goods-inwards/goods-inward.model';

export enum GoodsReturnActionTypes {
    GetGoodsReturns = '[GoodsReturn] Get Goods Returns',
    GetGoodsReturnsSuccess = '[GoodsReturn] Get Goods Returns Success',
    GetGoodsReturnsFail = '[GoodsReturn] Get Goods Returns Fail',

    GetReturnOrdersByVendor = '[GoodsReturn] Get Return Orders by Vendor',
    GetReturnOrdersByVendorSuccess = '[GoodsReturn] Get Return Orders by Vendor Success',
    GetReturnOrdersByVendorFail = '[GoodsReturn] Get Return Orders by Vendor Fail',

    GetReturnOrdersByIds = '[GoodsInward] Get Return Orders By Ids',
    GetReturnOrdersByIdsSuccess = '[GoodsInward] Get Return Orders By Ids Success',
    GetReturnOrdersByIdsFail = '[GoodsInward] Get Return Orders By Ids Fail',


    ResetState = '[GoodsInward] Reset state',
}

export class GetGoodsReturns implements Action {
    readonly type = GoodsReturnActionTypes.GetGoodsReturns;
    constructor(public payload: PagingFilterCriteria, public goodsReturnRequestModel: FilterRequestModel) { }
}

export class GetGoodsReturnsSuccess implements Action {
    readonly type = GoodsReturnActionTypes.GetGoodsReturnsSuccess;
    constructor(public payload: PagedResult<InventoryTransactionGoodsReturnViewModel>) { }
}

export class GetGoodsReturnsFailFail implements Action {
    readonly type = GoodsReturnActionTypes.GetGoodsReturnsFail;
    constructor(public payload: null) { }
}

export class GetReturnOrdersByVendor implements Action {
    readonly type = GoodsReturnActionTypes.GetReturnOrdersByVendor;
    constructor(public payload: string) { }
}

export class GetReturnOrdersByVendorSuccess implements Action {
    readonly type = GoodsReturnActionTypes.GetReturnOrdersByVendorSuccess;
    constructor(public payload: ReturnOrderListModel[]) { }
}

export class GetReturnOrdersByVendorFail implements Action {
    readonly type = GoodsReturnActionTypes.GetReturnOrdersByVendorFail;
    constructor(public payload: null) { }
}

export class GetReturnOrdersByIds implements Action {
    readonly type = GoodsReturnActionTypes.GetReturnOrdersByIds;
    constructor(public payload: string[]) { }
}

export class GetReturnOrdersByIdsSuccess implements Action {
    readonly type = GoodsReturnActionTypes.GetReturnOrdersByIdsSuccess;
    constructor(public payload: ReturnOrderModel[]) { }
}

export class GetReturnOrdersByIdsFail implements Action {
    readonly type = GoodsReturnActionTypes.GetReturnOrdersByIdsFail;
    constructor(public payload: null) { }
}

export class ResetState implements Action {
    readonly type = GoodsReturnActionTypes.ResetState;
    constructor() { }
}

export type GoodsReturnActions = GetGoodsReturns
    | GetGoodsReturnsSuccess
    | GetGoodsReturnsFailFail
    | GetReturnOrdersByVendor
    | GetReturnOrdersByVendorSuccess
    | GetReturnOrdersByVendorFail
    | GetReturnOrdersByIds
    | GetReturnOrdersByIdsSuccess
    | GetReturnOrdersByIdsFail
    | ResetState;
