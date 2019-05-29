import { Action } from '@ngrx/store';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import {
    StockRequestListModel,
    StockRequestModel,
    StockRequestModelAddRequest,
    StockTypeViewModel,
    StockRequestModelUpdateRequest
} from '../stock-request.model';
import { ProductListModel, ProductModel } from '../../products/product';
import { LocationType, LocationModel } from '../../locations/location.model';
import { FilterRequestModel } from '../../goods-inwards/goods-inward.model';

export enum StockRequestActionTypes {
    GetStockRequests = '[StockRequest] Get Stock Requests',
    GetStockRequest = '[StockRequest] Get Stock Request',
    AddStockRequest = '[StockRequest] Add Stock Request',

    GetStockRequestsSuccess = '[StockRequest] Get Stock Requests Success',
    GetStockRequestSuccess = '[StockRequest] Get Stock Request Success',
    AddStockRequestSuccess = '[StockRequest] Add Stock Request Success',

    AddStockRequestFail = '[StockRequest] Add Stock Request Fail',

    GetProductsWithoutPaging = '[StockRequest] Get Products Without Paging',
    GetProductsWithoutPagingSuccess = '[StockRequest] Get Products Without Paging Success',

    GetStockTypes = '[StockRequest] Get Stock Types',
    GetStockTypesSuccess = '[StockRequest] Get Stock Types Success',

    GetProductById = '[StockRequest] Get Product',
    GetProductByIdSuccess = '[StockRequest] Get Product Success',

    GetLocationsByType = '[StockRequest] Get Locations By Type',
    GetLocationsByTypeSuccess = '[StockRequest] Get Locations By Type Success',

    EditStockRequest = '[StockRequest] Edit Stock Request',
    EditStockRequestSuccess = '[StockRequest] Edit Stock Request Success',
    EditStockRequestFail = '[StockRequest] Edit Stock Request Fail',

    CancelUpdateSuccess = '[StockRequest] Cancel Update Success',
}

// Action
export class GetStockRequests implements Action {
    readonly type = StockRequestActionTypes.GetStockRequests;
    constructor(public payload: PagingFilterCriteria, public stockRequestModel: FilterRequestModel) { }
}

export class GetStockRequest implements Action {
    readonly type = StockRequestActionTypes.GetStockRequest;
    constructor(public payload: string) { }
}

export class AddStockRequest implements Action {
    readonly type = StockRequestActionTypes.AddStockRequest;
    constructor(public payload: StockRequestModelAddRequest) { }
}

export class GetProductsWithoutPaging implements Action {
    readonly type = StockRequestActionTypes.GetProductsWithoutPaging;
    constructor(public payload: any) { }
}

export class GetStockTypes implements Action {
    readonly type = StockRequestActionTypes.GetStockTypes;
    constructor(public payload: any) { }
}

export class GetProductById implements Action {
    readonly type = StockRequestActionTypes.GetProductById;
    constructor(public payload: string) { }
}

export class GetLocationsByType implements Action {
    readonly type = StockRequestActionTypes.GetLocationsByType;
    constructor(public payload: LocationType) { }
}

export class EditStockRequest implements Action {
    readonly type = StockRequestActionTypes.EditStockRequest;
    constructor(public payload: StockRequestModelUpdateRequest) { }
}
// Success
export class GetStockRequestsSuccess implements Action {
    readonly type = StockRequestActionTypes.GetStockRequestsSuccess;
    constructor(public payload: PagedResult<StockRequestListModel>) { }
}

export class GetStockRequestSuccess implements Action {
    readonly type = StockRequestActionTypes.GetStockRequestSuccess;
    constructor(public payload: StockRequestModel) { }
}

export class AddStockRequestSuccess implements Action {
    readonly type = StockRequestActionTypes.AddStockRequestSuccess;
    constructor(public payload: StockRequestListModel) { }
}

export class GetProductsWithoutPagingSuccess implements Action {
    readonly type = StockRequestActionTypes.GetProductsWithoutPagingSuccess;
    constructor(public payload: ProductListModel[]) { }
}

export class GetProductByIdSuccess implements Action {
    readonly type = StockRequestActionTypes.GetProductByIdSuccess;
    constructor(public payload: ProductModel) { }
}

export class GetStockTypesSuccess implements Action {
    readonly type = StockRequestActionTypes.GetStockTypesSuccess;
    constructor(public payload: StockTypeViewModel[]) { }
}

export class GetLocationsByTypeSuccess implements Action {
    readonly type = StockRequestActionTypes.GetLocationsByTypeSuccess;
    constructor(public payload: LocationModel[]) { }
}

export class EditStockRequestSuccess implements Action {
    readonly type = StockRequestActionTypes.EditStockRequestSuccess;
    constructor(public payload: any) { }
}

export class CancelUpdateSuccess implements Action {
    readonly type = StockRequestActionTypes.CancelUpdateSuccess;
    constructor() { }
}
// Fail
export class AddStockRequestFail implements Action {
    readonly type = StockRequestActionTypes.AddStockRequestFail;
    constructor(public payload: any) { }
}

export class EditStockRequestFail implements Action {
    readonly type = StockRequestActionTypes.EditStockRequestFail;
    constructor(public payload: any) { }
}

export type StockRequestActions =
    | GetStockRequests
    | GetStockRequest
    | GetProductsWithoutPaging
    | GetProductById
    | GetStockTypes
    | GetLocationsByType
    | AddStockRequest
    | EditStockRequest
    | GetStockRequestsSuccess
    | GetStockRequestSuccess
    | GetProductsWithoutPagingSuccess
    | GetProductByIdSuccess
    | GetStockTypesSuccess
    | GetLocationsByTypeSuccess
    | AddStockRequestSuccess
    | EditStockRequestSuccess
    | AddStockRequestFail
    | EditStockRequestFail
    | CancelUpdateSuccess;
