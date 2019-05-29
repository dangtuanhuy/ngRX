import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import * as salesActions from './sales.action';
import { OrderService } from '../../shared/services/order.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PendingSaleService } from '../../shared/services/pending-sale.service';
import { Action } from '@ngrx/store';
import {
    VariantByStockTypeAndVariantIdAndPriceRequest,
    StockTypeAndVariantIdAndPriceRequest
} from '../../shared/requests/realms/variant.request';
import { VariantService } from '../../shared/services/variant.service';
import { AppContextManager } from '../../shared/app-context-manager';
import { SalesAchievedService } from '../../shared/services/sales-achieved.service';

@Injectable()
export class SalesEffects {
    constructor(
        private action$: Actions,
        private orderService: OrderService,
        private pendingSaleService: PendingSaleService,
        private variantService: VariantService,
        private notificationService: NotificationService,
        private appContextManager: AppContextManager,
        private salesAchievedService: SalesAchievedService
    ) { }

    @Effect()
    addSale$: Observable<Action> = this.action$.pipe(
        ofType(salesActions.SaleActionTypes.AddSale),
        mergeMap((action: salesActions.AddSale) => this.orderService.addOrder(action.payload).pipe(
            map(response => {
                if (response.orderModel) {
                    this.notificationService.success('Success');
                    this.salesAchievedService.getCurrentSaleTargetAndSalesAchievedOrCreate().subscribe((result) => {
                        if (result) {
                            const saleTarget = result.saleTarget;
                            const salesAchieved = result.salesAchieved;
                            salesAchieved.value += response.orderModel.amount;

                            this.salesAchievedService.update(salesAchieved).subscribe((updatedSalesAchieved) => {
                                this.appContextManager.triggerSaleTargetAndSalesAchievedSubject.next({
                                    saleTarget: saleTarget,
                                    salesAchieved: updatedSalesAchieved
                                });
                            });
                        }
                    });

                    return (new salesActions.AddSaleSucess(response.orderModel));
                } else {
                    this.notificationService.error(response.errorMessage);
                    return (new salesActions.AddSaleFailure(response.errorMessage));
                }
            })
        ))
    );

    @Effect()
    addPendingSale$: Observable<Action> = this.action$.pipe(
        ofType(salesActions.SaleActionTypes.AddPendingSale),
        mergeMap((action: salesActions.AddPendingSale) => {
            return this.pendingSaleService.addPendingSale(action.payload).pipe(
                map(response => {
                    if (response.pendingSaleModel) {
                        this.notificationService.success('Success');
                        return (new salesActions.AddPendingSaleSucess(response.pendingSaleModel));
                    } else {
                        this.notificationService.error(response.errorMessage);
                        return (new salesActions.AddPendingSaleFailure(response.errorMessage));
                    }
                })
            );
        })
    );

    @Effect()
    getPendingSale$: Observable<Action> = this.action$.pipe(
        ofType(salesActions.SaleActionTypes.ReleasePendingSale),
        mergeMap((action: salesActions.ReleasePendingSale) => {
            const pendingSaleItems = action.payload.pendingSaleItems;
            const variantByStockTypeAndVariantIdAndPriceRequest = new VariantByStockTypeAndVariantIdAndPriceRequest();
            variantByStockTypeAndVariantIdAndPriceRequest.stockTypeAndVariantIdAndPriceRequest
                = pendingSaleItems.map(x => {
                    const request = new StockTypeAndVariantIdAndPriceRequest();
                    request.priceId = x.priceId;
                    request.stockTypeId = x.stockTypeId;
                    request.variantId = x.variantId;

                    return request;
                });

            return this.variantService.getVariantsByStockTypeAndVariantAndPrice(variantByStockTypeAndVariantIdAndPriceRequest)
                .pipe(
                    map(response => {
                        const errors = response.errors;
                        if (errors.length > 0) {
                            errors.forEach(error => {
                                this.notificationService.error(error);
                            });

                            return (new salesActions.ReleasePendingSaleFailure(errors));
                        }

                        const customer = action.payload.customer;
                        const variants = response.variants;
                        const data = {
                            customer: customer,
                            variants: variants,
                            pendingSaleItems: pendingSaleItems
                        };
                        return (new salesActions.ReleasePendingSaleSuccess(data));
                    })
                );
        })
    );
}
