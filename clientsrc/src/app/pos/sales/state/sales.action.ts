import { Action } from '@ngrx/store';
import { CustomerModel } from 'src/app/shared/base-model/customer.model';
import { Variant } from '../../shared/models/variant';
import { OrderModel } from '../../shared/models/order';
import { PendingSaleModel } from '../../shared/models/pending-sale';
import { Promotion } from '../../shared/models/promotion';
import { SaleItemPromotion } from '../../shared/models/order-item-promotion';

export enum SaleActionTypes {
    AddSaleItem = '[Sales] [Product] Add Sale Item.',
    UpdateProductQuantity = '[Sales] [Product] Update Product Quantity.',

    SelectCustomer = '[Sales] [Customer] Select Customer.',
    ReleasePendingSale = '[Sales] [Customer] Release Pending Sale.',
    ReleasePendingSaleSuccess = '[Sales] [Customer] Release Pending Sale Success.',
    ReleasePendingSaleFailure = '[Sales] [Customer] Release Pending Sale Pending.',

    ClearData = '[Sales] Clear Data.',

    AddSale = '[Sales] Add Sale.',
    AddSaleSucess = '[Sales] Add Sale Success.',
    AddSaleFailure = '[Sales] Add Sale Failure.',

    AddPendingSale = '[Sales] Add Pending Sale.',
    AddPendingSaleSucess = '[Sales] Add Pending Sale Success.',
    AddPendingSaleFailure = '[Sales] Add Pending Sale Failure.',

    SetStatus = '[Sales] Set Status.',

    SetGST = '[Sales] Set GST',
    SetGSTInclusive = '[Sales] Set GST Inclusive',

    AddPromotion = '[Sales] Add Promotion.',

    DeleteSaleItem = '[Sales] Delete Sale Item.',

    AddSaleItemPromotion = '[Sales] Add Sale Item Promotion.'
}

export class AddSaleItem implements Action {
    readonly type = SaleActionTypes.AddSaleItem;
    constructor(public payload: Variant) { }
}

export class UpdateProductQuantity implements Action {
    readonly type = SaleActionTypes.UpdateProductQuantity;
    constructor(public payload: any) { }
}

export class SelectCustomer implements Action {
    readonly type = SaleActionTypes.SelectCustomer;
    constructor(public payload: CustomerModel) { }
}

export class ReleasePendingSale implements Action {
    readonly type = SaleActionTypes.ReleasePendingSale;
    constructor(public payload: PendingSaleModel) { }
}

export class ReleasePendingSaleSuccess implements Action {
    readonly type = SaleActionTypes.ReleasePendingSaleSuccess;
    constructor(public payload: any) { }
}

export class ReleasePendingSaleFailure implements Action {
    readonly type = SaleActionTypes.ReleasePendingSaleFailure;
    constructor(public payload: any) { }
}

export class ClearData implements Action {
    readonly type = SaleActionTypes.ClearData;
    constructor() { }
}

export class AddSale implements Action {
    readonly type = SaleActionTypes.AddSale;
    constructor(public payload: OrderModel) { }
}

export class AddSaleSucess implements Action {
    readonly type = SaleActionTypes.AddSaleSucess;
    constructor(public payload: OrderModel) { }
}

export class AddSaleFailure implements Action {
    readonly type = SaleActionTypes.AddSaleFailure;
    constructor(public payload: string) { }
}

export class AddPendingSale implements Action {
    readonly type = SaleActionTypes.AddPendingSale;
    constructor(public payload: any) { }
}

export class AddPendingSaleSucess implements Action {
    readonly type = SaleActionTypes.AddPendingSaleSucess;
    constructor(public payload: OrderModel) { }
}

export class AddPendingSaleFailure implements Action {
    readonly type = SaleActionTypes.AddPendingSaleFailure;
    constructor(public payload: string) { }
}

export class SetStatus implements Action {
    readonly type = SaleActionTypes.SetStatus;
    constructor(public payload: any) { }
}

export class SetGST implements Action {
    readonly type = SaleActionTypes.SetGST;
    constructor(public payload: number) { }
}

export class SetGSTInclusive implements Action {
    readonly type = SaleActionTypes.SetGSTInclusive;
    constructor(public payload: boolean) { }
}

export class AddPromotion implements Action {
    readonly type = SaleActionTypes.AddPromotion;
    constructor(public payload: Promotion) { }
}

export class DeleteSaleItem implements Action {
    readonly type = SaleActionTypes.DeleteSaleItem;
    constructor(public payload: string) { }
}

export class AddSaleItemPromotion implements Action {
    readonly type = SaleActionTypes.AddSaleItemPromotion;
    constructor(public payload: SaleItemPromotion) { }
}

export type SaleActions = AddSaleItem
    | UpdateProductQuantity
    | SelectCustomer
    | ReleasePendingSale
    | ReleasePendingSaleSuccess
    | ReleasePendingSaleFailure
    | ClearData
    | AddSale
    | AddSaleSucess
    | AddSaleFailure
    | SetStatus
    | SetGST
    | SetGSTInclusive
    | AddPendingSale
    | AddPendingSaleSucess
    | AddPendingSaleFailure
    | AddPromotion
    | DeleteSaleItem
    | AddSaleItemPromotion;
