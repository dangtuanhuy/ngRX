import { Action } from '@ngrx/store';
import { OrderModel } from 'src/app/pos/shared/models/order';
import { RecentOrderPagingModel } from 'src/app/pos/shared/view-models/recent-order-paging.model';

export enum RecentSaleActionTypes {
    GetRecentSales = '[RecentSale] Get Recent Sales.',
    SearchRecentSales = '[RecentSale] Search Recent Sales.',
    GetRecentSalesSuccess = '[RecentSale] Get Recent Sales Success.',

    GetRecentSale = '[RecentSale] Get Recent Sale.',
    GetRecentSaleSuccess = '[RecentSale] Get Recent Sale Success.'
}

export class GetRecentSales implements Action {
    readonly type = RecentSaleActionTypes.GetRecentSales;
    constructor(public payload: any) { }
}

export class SearchRecentSales implements Action {
    readonly type = RecentSaleActionTypes.SearchRecentSales;
    constructor(public payload: any) { }
}

export class GetRecentSalesSuccess implements Action {
    readonly type = RecentSaleActionTypes.GetRecentSalesSuccess;
    constructor(public payload: RecentOrderPagingModel) { }
}

export class GetRecentSale implements Action {
    readonly type = RecentSaleActionTypes.GetRecentSale;
    constructor(public payload: string) { }
}

export class GetRecentSaleSuccess implements Action {
    readonly type = RecentSaleActionTypes.GetRecentSaleSuccess;
    constructor(public payload: OrderModel) { }
}

export type RecentSaleActions = GetRecentSales
    | GetRecentSalesSuccess
    | GetRecentSale
    | SearchRecentSales
    | GetRecentSaleSuccess;
