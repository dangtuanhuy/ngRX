import { Store, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { PurchaseOrderService } from 'src/app/shared/services/purchase-order.service';
import { Observable, of } from 'rxjs';
import * as goodsInwardActions from '../state/goods-inward.action';
import { mergeMap, map, catchError } from 'rxjs/operators';
import {
    PimPurchaseOrderListModel,
    PimPurchaseOrderModel
} from 'src/app/purchaseorder/purchase-orders/purchase-order.model';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { InventoryTransactionGoodsInwardViewModel } from '../goods-inward.model';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { GoodsInwardService } from 'src/app/shared/services/goods-inward.service';

@Injectable()
export class GoodsInwardEffects {
    constructor(private store: Store<any>,
        private action$: Actions,
        private goodsInwardService: GoodsInwardService,
        private purchaseOrderService: PurchaseOrderService) { }

    @Effect()
    getPurchaseOrdersByVendor$: Observable<Action> = this.action$.pipe(
        ofType(goodsInwardActions.GoodsInwardActionTypes.GetPurchaseOrdersByVendor),
        mergeMap((action: goodsInwardActions.GetPurchaseOrdersByVendor) =>
            this.purchaseOrderService
                .getByVendorFromPIM(action.payload)
                .pipe(
                    map((stockRequest: PimPurchaseOrderListModel[]) =>
                        new goodsInwardActions.GetPurchaseOrdersByVendorSuccess(stockRequest)
                    ), catchError(error =>
                        of(new goodsInwardActions.GetPurchaseOrdersByVendorFail(error))
                    )
                )
        )
    );

    @Effect()
    getPurchaseOrdersByIds$: Observable<Action> = this.action$.pipe(
        ofType(goodsInwardActions.GoodsInwardActionTypes.GetPurchaseOrdersByIds),
        mergeMap((action: goodsInwardActions.GetPurchaseOrdersByIds) =>
            this.purchaseOrderService.getByIdsFromPIM(action.payload)
                .pipe(
                    map((purchaseOrders: PimPurchaseOrderModel[]) =>
                        new goodsInwardActions.GetPurchaseOrdersByIdsSuccess(purchaseOrders)
                    ), catchError(error =>
                        of(new goodsInwardActions.GetPurchaseOrdersByIdsFail(error))
                    )
                ))
    );

    @Effect()
    getInventoryTransactionGoodsInwards$: Observable<Action> = this.action$
        .pipe(
            ofType(goodsInwardActions.GoodsInwardActionTypes.GetGoodsInwards),
            mergeMap((action: goodsInwardActions.GetGoodsInwards) =>
                this.goodsInwardService
                    .getInventoryTransactionGoodsInwards(action.payload.page,
                        action.payload.numberItemsPerPage, action.goodsInwardRequestModel)
                    .pipe(map((inventoryTransactionGoodsInwards: PagedResult<InventoryTransactionGoodsInwardViewModel>) => {
                        this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(inventoryTransactionGoodsInwards));
                        return new goodsInwardActions.GetGoodsInwardsSuccess(inventoryTransactionGoodsInwards);
                    })
                    )
            )
        );

    @Effect()
    getGIWByInventoryTransactionId$: Observable<Action> = this.action$.pipe(
        ofType(goodsInwardActions.GoodsInwardActionTypes.GetGIWByInventoryTransactionId),
        mergeMap((action: goodsInwardActions.GetGIWByInventoryTransactionId) =>
            this.goodsInwardService.getGIWByInventoryTransactionId(action.payload)
                .pipe(
                    map((inventoryTransactionGoodsInward: InventoryTransactionGoodsInwardViewModel) =>
                        new goodsInwardActions.GetGIWByInventoryTransactionIdSuccess(inventoryTransactionGoodsInward)
                    ), catchError(error =>
                        of(new goodsInwardActions.GetGIWByInventoryTransactionIdFail(error))
                    )
                )
        )
    );
}
