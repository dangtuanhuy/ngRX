import { GoodsReturnService } from 'src/app/shared/services/goods-return.service';
import { ReturnOrderService } from 'src/app/shared/services/return-order.service';
import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import * as goodsReturnActions from '../state/goods-return.action';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { InventoryTransactionGoodsReturnViewModel, ReturnOrderListModel, ReturnOrderModel } from '../goods-return.model';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
@Injectable()
export class GoodsReturnEffects {
    constructor(private store: Store<any>,
        private action$: Actions,
        private goodsReturnService: GoodsReturnService,
        private returnOrderService: ReturnOrderService) { }

    @Effect()
    getInventoryTransactionGoodsReturns$: Observable<Action> = this.action$
        .pipe(
            ofType(goodsReturnActions.GoodsReturnActionTypes.GetGoodsReturns),
            mergeMap((action: goodsReturnActions.GetGoodsReturns) =>
                this.goodsReturnService
                    .getInventoryTransactionGoodsReturns(action.payload.page,
                                                         action.payload.numberItemsPerPage,
                                                         action.goodsReturnRequestModel)
                    .pipe(map((inventoryTransactionGoodsReturns: PagedResult<InventoryTransactionGoodsReturnViewModel>) => {
                        this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(inventoryTransactionGoodsReturns));
                        return new goodsReturnActions.GetGoodsReturnsSuccess(inventoryTransactionGoodsReturns);
                    })
                    )
            )
        );

    @Effect()
    getReturnOrdersByVendor$: Observable<Action> = this.action$.pipe(
        ofType(goodsReturnActions.GoodsReturnActionTypes.GetReturnOrdersByVendor),
        mergeMap((action: goodsReturnActions.GetReturnOrdersByVendor) =>
            this.returnOrderService
                .getByVendor(action.payload)
                .pipe(
                    map((returnOrders: ReturnOrderListModel[]) =>
                        new goodsReturnActions.GetReturnOrdersByVendorSuccess(returnOrders)
                    ), catchError(error =>
                        of(new goodsReturnActions.GetReturnOrdersByVendorSuccess(error))
                    )
                )
        )
    );

    @Effect()
    getReturnOrdersByIds$: Observable<Action> = this.action$.pipe(
        ofType(goodsReturnActions.GoodsReturnActionTypes.GetReturnOrdersByIds),
        mergeMap((action: goodsReturnActions.GetReturnOrdersByIds) =>
            this.returnOrderService.getByIds(action.payload)
                .pipe(
                    map((returnOrders: ReturnOrderModel[]) =>
                        new goodsReturnActions.GetReturnOrdersByIdsSuccess(returnOrders)
                    ), catchError(error =>
                        of(new goodsReturnActions.GetReturnOrdersByIdsFail(error))
                    )
                ))
    );
}
