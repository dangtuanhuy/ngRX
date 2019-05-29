import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import * as recentSalesActions from './recent-sales.action';
import { mergeMap, map, switchMap } from 'rxjs/operators';
import { OrderService } from 'src/app/pos/shared/services/order.service';
import { RecentOrderPagingModel } from 'src/app/pos/shared/view-models/recent-order-paging.model';

@Injectable()
export class RecentSalesEffects {
    constructor(
        private action$: Actions,
        private orderService: OrderService
    ) { }

    @Effect()
    getSales$: Observable<Action> = this.action$.pipe(
        ofType(recentSalesActions.RecentSaleActionTypes.GetRecentSales),
        switchMap((action: recentSalesActions.GetRecentSales) =>
            this.orderService.getRecentOrdersPaging(action.payload.pageIndex, action.payload.pageSize).pipe(
                map((recentOrderPagingModel: RecentOrderPagingModel) =>
                    (new recentSalesActions.GetRecentSalesSuccess(recentOrderPagingModel)))
            ))
    );

    @Effect()
    searchSales$: Observable<Action> = this.action$.pipe(
        ofType(recentSalesActions.RecentSaleActionTypes.SearchRecentSales),
        switchMap((action: recentSalesActions.SearchRecentSales) =>
            this.orderService.searchRecentOrdersPaging(action.payload.textSearch, action.payload.pageIndex, action.payload.pageSize).pipe(
                map((recentOrderPagingModel: RecentOrderPagingModel) =>
                    (new recentSalesActions.GetRecentSalesSuccess(recentOrderPagingModel)))
            ))
    );

    @Effect()
    getSale$: Observable<Action> = this.action$.pipe(
        ofType(recentSalesActions.RecentSaleActionTypes.GetRecentSale),
        mergeMap((action: recentSalesActions.GetRecentSale) => this.orderService.getOrderIncludeOrderItems(action.payload).pipe(
            map(order => (new recentSalesActions.GetRecentSaleSuccess(order)))
        ))
    );
}
