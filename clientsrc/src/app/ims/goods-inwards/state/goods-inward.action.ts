import { Action } from '@ngrx/store';
import {
    PimPurchaseOrderListModel,
    PimPurchaseOrderModel
} from 'src/app/purchaseorder/purchase-orders/purchase-order.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { InventoryTransactionGoodsInwardViewModel, UpdateGIWStatusModel, FilterRequestModel } from '../goods-inward.model';

export enum GoodsInwardActionTypes {
    GetPurchaseOrdersByVendor = '[GoodsInward] Get Purchase Orders By Vendor',
    GetPurchaseOrdersByVendorSuccess = '[GoodsInward] Get Purchase Orders By Vendor Success',
    GetPurchaseOrdersByVendorFail = '[GoodsInward] Get Purchase Orders By Vendor Fail',

    GetPurchaseOrdersByIds = '[GoodsInward] Get Purchase Orders By Ids',
    GetPurchaseOrdersByIdsSuccess = '[GoodsInward] Get Purchase Orders By Ids Success',
    GetPurchaseOrdersByIdsFail = '[GoodsInward] Get Purchase Orders By Ids Fail',

    ResetAllocationState = '[GoodsInward] Reset state',

    GetGoodsInwards = '[GoodsInward] Get GoodsInwards',
    GetGoodsInwardsSuccess = '[GoodsInward] Get GoodsInwards Success',
    GetGoodsInwardsFail = '[GoodsInward] Get GoodsInwards Fail',

    GetGoodsInward = '[GoodsInward] Get GoodsInward',

    UpdateGoodsInward = '[GoodsInward] Update GoodsInward',
    UpdateGoodsInwardSuccess = '[GoodsInward] Update GoodsInward Success',

    GetGIWByInventoryTransactionId = '[GoodsInward] Get GIW Details By Inventory Transaction Id',
    GetGIWByInventoryTransactionIdSuccess = '[GoodsInward] Get GIW Details By Inventory Transaction Id Success',
    GetGIWByInventoryTransactionIdFail = '[GoodsInward] Get GIW Details By Inventory Transaction Id Fail',
}

export class GetPurchaseOrdersByVendor implements Action {
    readonly type = GoodsInwardActionTypes.GetPurchaseOrdersByVendor;
    constructor(public payload: string) { }
}

export class GetPurchaseOrdersByVendorSuccess implements Action {
    readonly type = GoodsInwardActionTypes.GetPurchaseOrdersByVendorSuccess;
    constructor(public payload: PimPurchaseOrderListModel[]) { }
}

export class GetPurchaseOrdersByVendorFail implements Action {
    readonly type = GoodsInwardActionTypes.GetPurchaseOrdersByVendorFail;
    constructor(public payload: null) { }
}

export class GetPurchaseOrdersByIds implements Action {
    readonly type = GoodsInwardActionTypes.GetPurchaseOrdersByIds;
    constructor(public payload: string[]) { }
}

export class GetPurchaseOrdersByIdsSuccess implements Action {
    readonly type = GoodsInwardActionTypes.GetPurchaseOrdersByIdsSuccess;
    constructor(public payload: PimPurchaseOrderModel[]) { }
}

export class GetPurchaseOrdersByIdsFail implements Action {
    readonly type = GoodsInwardActionTypes.GetPurchaseOrdersByIdsFail;
    constructor(public payload: null) { }
}

export class ResetAllocationState implements Action {
    readonly type = GoodsInwardActionTypes.ResetAllocationState;
    constructor() { }
}

export class GetGoodsInwards implements Action {
    readonly type = GoodsInwardActionTypes.GetGoodsInwards;
    constructor(public payload: PagingFilterCriteria, public goodsInwardRequestModel: FilterRequestModel) { }
}

export class GetGoodsInwardsSuccess implements Action {
    readonly type = GoodsInwardActionTypes.GetGoodsInwardsSuccess;
    constructor(public payload: PagedResult<InventoryTransactionGoodsInwardViewModel>) { }
}

export class GetGoodsInwardsFail implements Action {
    readonly type = GoodsInwardActionTypes.GetGoodsInwardsFail;
    constructor(public payload: null) { }
}

export class GetGoodsInward implements Action {
    readonly type = GoodsInwardActionTypes.GetGoodsInward;
    constructor(public payload: string) { }
}

export class UpdateGoodsInward implements Action {
    readonly type = GoodsInwardActionTypes.UpdateGoodsInward;
    constructor(public payload: UpdateGIWStatusModel) { }
}

export class UpdateGoodsInwardSuccess implements Action {
    readonly type = GoodsInwardActionTypes.UpdateGoodsInwardSuccess;
    constructor(public payload: UpdateGIWStatusModel) { }
}

export class GetGIWByInventoryTransactionId implements Action {
    readonly type = GoodsInwardActionTypes.GetGIWByInventoryTransactionId;
    constructor(public payload: string) { }
}

export class GetGIWByInventoryTransactionIdSuccess implements Action {
    readonly type = GoodsInwardActionTypes.GetGIWByInventoryTransactionIdSuccess;
    constructor(public payload: InventoryTransactionGoodsInwardViewModel) { }
}

export class GetGIWByInventoryTransactionIdFail implements Action {
    readonly type = GoodsInwardActionTypes.GetGIWByInventoryTransactionIdFail;
    constructor(public payload: null) { }
}

export type GoodsInwardActions = GetPurchaseOrdersByVendor
    | GetPurchaseOrdersByVendorSuccess
    | GetPurchaseOrdersByVendorFail
    | GetPurchaseOrdersByIds
    | GetPurchaseOrdersByIdsSuccess
    | GetPurchaseOrdersByIdsFail
    | ResetAllocationState
    | GetGoodsInwards
    | GetGoodsInwardsSuccess
    | GetGoodsInwardsFail
    | GetGoodsInward
    | UpdateGoodsInwardSuccess
    | GetGIWByInventoryTransactionId
    | GetGIWByInventoryTransactionIdSuccess
    | GetGIWByInventoryTransactionIdFail;
