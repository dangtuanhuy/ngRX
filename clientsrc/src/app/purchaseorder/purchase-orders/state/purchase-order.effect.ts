import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import * as purchaseOrderActions from '../state/purchase-order.action';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { PurchaseOrderService } from 'src/app/shared/services/purchase-order.service';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { PurchaseOrderModel, CurrencyModel, UserManagerModel,
    SubmitPurchaseOrderModel, GetPurchaseOrderModel } from '../purchase-order.model';
import { VendorService } from 'src/app/shared/services/vendor.service';
import { VendorModel } from '../../vendors/vendor.model';
import * as _ from 'lodash';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';

@Injectable()
export class PurchaseOrderEffects {
    private userManager: Array<UserManagerModel> = [];
    constructor(
        private store: Store<any>,
        private action$: Actions,
        private purchaseOrderService: PurchaseOrderService,
        private vendorService: VendorService
    ) { }

    @Effect()
    getPurchaseOrders$: Observable<Action> = this.action$
        .pipe(
            ofType(purchaseOrderActions.PurchaseOrderActionTypes.GetPurchaseOrders),
            mergeMap((action: purchaseOrderActions.GetPurchaseOrders) =>
                this.purchaseOrderService
                    .getAll(action.payload.page, action.payload.numberItemsPerPage, action.purchaseOrder)
                    .pipe(map((purchaseOrders: PagedResult<PurchaseOrderModel>) => {
                        this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(purchaseOrders));
                        return new purchaseOrderActions.GetPurchaseOrdersSuccess(purchaseOrders);
                    })
                    )
            )
        );

    @Effect()
    getPurchaseOrder$: Observable<Action> = this.action$
        .pipe(
            ofType(purchaseOrderActions.PurchaseOrderActionTypes.GetPurchaseOrder),
            mergeMap((action: purchaseOrderActions.GetPurchaseOrder) =>
                this.purchaseOrderService
                    .getBy(action.payload)
                    .pipe(map((purchaseOrder: PurchaseOrderModel) => {
                        return new purchaseOrderActions.GetPurchaseOrderSuccess(purchaseOrder);
                    })
                    )
            )
        );

    @Effect()
    getAllVendors$: Observable<Action> = this.action$
        .pipe(
            ofType(purchaseOrderActions.PurchaseOrderActionTypes.GetAllVendors),
            mergeMap((action: purchaseOrderActions.GetAllVendors) =>
                this.vendorService
                    .getAllVendor()
                    .pipe(map((vendors: Array<VendorModel>) => {
                        return new purchaseOrderActions.GetAllVendorsSuccess(vendors);
                    })
                    )
            )
        );

    @Effect()
    addPurchaseOrder$: Observable<Action> = this.action$.pipe(
        ofType(purchaseOrderActions.PurchaseOrderActionTypes.AddPurchaseOrder),
        mergeMap((action: purchaseOrderActions.AddPurchaseOrder)  =>
            this.purchaseOrderService.add(action.payload).pipe(
                map(newPurchaseOrder => {
                    this.store.dispatch(new listViewManagementActions.AddSucessAction());
                    this.store.dispatch(new purchaseOrderActions.GetPurchaseOrders(new PagingFilterCriteria(1, 10),
                                    new GetPurchaseOrderModel('', '', '', action.purchaseOrderType)));
                    return new purchaseOrderActions.AddPurchaseOrderSuccess(new PurchaseOrderModel(newPurchaseOrder));
                }),
                catchError(error => of(new purchaseOrderActions.AddPurchaseOrderFail(error)))
            )
        )
    );

    @Effect()
    updatePurchaseOrder$: Observable<Action> = this.action$.pipe(
        ofType(purchaseOrderActions.PurchaseOrderActionTypes.UpdatePurchaseOrder),
        mergeMap((action: purchaseOrderActions.UpdatePurchaseOrder) =>
            this.purchaseOrderService.update(action.payload).pipe(
                map(() => {
                    this.store.dispatch(new listViewManagementActions.UpdateSucessAction());
                    this.store.dispatch(new purchaseOrderActions.ResetPurchaseOrder());
                    this.store.dispatch(new purchaseOrderActions.GetPurchaseOrders(new PagingFilterCriteria(1, 10),
                                    new GetPurchaseOrderModel('', '', '', action.purchaseOrderType)));
                    return new purchaseOrderActions.UpdatePurchaseOrderSuccess(new PurchaseOrderModel(action.payload));
                }),
                catchError(error =>
                    of(new purchaseOrderActions.UpdatePurchaseOrderFail(error))
                )
            )
        )
    );

    @Effect()
    updatePurchaseOrderDate$: Observable<Action> = this.action$.pipe(
        ofType(purchaseOrderActions.PurchaseOrderActionTypes.UpdatePurchaseOrderDate),
        mergeMap((action: purchaseOrderActions.UpdatePurchaseOrderDate) =>
            this.purchaseOrderService.updatePODate(action.payload).pipe(
                map(() => {
                    this.store.dispatch(new listViewManagementActions.UpdateSucessAction());
                    this.store.dispatch(new purchaseOrderActions.GetPurchaseOrders(new PagingFilterCriteria(1, 10),
                                    new GetPurchaseOrderModel('', '', '', action.purchaseOrderType)));
                    return new purchaseOrderActions.UpdatePurchaseOrderDateSuccess(action.payload);
                }),
                catchError(error =>
                    of(new purchaseOrderActions.UpdatePurchaseOrderDateFail(error))
                )
            )
        )
    );

    @Effect()
    deletePurchaseOrder$: Observable<Action> = this.action$.pipe(
        ofType(purchaseOrderActions.PurchaseOrderActionTypes.DeletePurchaseOrder),
        mergeMap((action: purchaseOrderActions.DeletePurchaseOrder) =>
            this.purchaseOrderService.remove(action.payload).pipe(
                map(() => {
                    this.store.dispatch(new listViewManagementActions.DeleteSucessAction());
                    this.store.dispatch(new purchaseOrderActions.GetPurchaseOrders(new PagingFilterCriteria(1, 10),
                                    new GetPurchaseOrderModel('', '', '', action.purchaseOrderType)));
                    return new purchaseOrderActions.DeletePurchaseOrderSuccess(action.payload);
                }),
                catchError(error =>
                    of(new purchaseOrderActions.DeletePurchaseOrderFail(error))
                )
            )
        )
    );

    @Effect()
    getCurrencies$: Observable<Action> = this.action$
        .pipe(
            ofType(purchaseOrderActions.PurchaseOrderActionTypes.GetCurrencies),
            mergeMap((action: purchaseOrderActions.GetCurrencies) =>
                this.purchaseOrderService
                    .getCurrencies()
                    .pipe(map((res: Array<CurrencyModel>) => {
                        return new purchaseOrderActions.GetCurrenciesSuccess(res);
                    })
                    )
            )
        );

    @Effect()
    getUserManager$: Observable<Action> = this.action$
        .pipe(
            ofType(purchaseOrderActions.PurchaseOrderActionTypes.GetUsersManager),
            map((action: purchaseOrderActions.GetUsersManager) => action.payload),
            mergeMap((role: any) =>
                this.purchaseOrderService
                    .getUsersManager(role)
                    .pipe(map((users: any[]) => {
                        users.forEach(user => {
                            this.userManager = this.userManager.concat(user);
                        });
                        this.userManager = _.uniqWith(this.userManager, _.isEqual);
                        return new purchaseOrderActions.GetUsersManagerSuccess(this.userManager);
                    })
                    )
            )
        );

    @Effect()
    convertPurchaseOrder$: Observable<Action> = this.action$.pipe(
        ofType(purchaseOrderActions.PurchaseOrderActionTypes.ConvertPurchaseOrder),
        mergeMap((action: purchaseOrderActions.ConvertPurchaseOrder) =>
            this.purchaseOrderService.convert(action.payload).pipe(
                map((res: PurchaseOrderModel) => {
                    this.store.dispatch(new listViewManagementActions.UpdateSucessAction());
                    this.store.dispatch(new purchaseOrderActions.GetPurchaseOrders(new PagingFilterCriteria(1, 10),
                                    new GetPurchaseOrderModel('', '', '', action.purchaseOrderType)));
                    return new purchaseOrderActions.ConvertPurchaseOrderSuccess(res);
                }),
                catchError(error =>
                    of(new purchaseOrderActions.ConvertPurchaseOrderFail(error))
                )
            )
        )
    );

    @Effect()
    bypassPurchaseOrder$: Observable<Action> = this.action$.pipe(
        ofType(purchaseOrderActions.PurchaseOrderActionTypes.ByPassPurchaseOrder),
        mergeMap((action: purchaseOrderActions.ByPassPurchaseOrder) =>
            this.purchaseOrderService.bypass(action.payload).pipe(
                map((res: PurchaseOrderModel) => {
                    this.store.dispatch(new listViewManagementActions.UpdateSucessAction());
                    this.store.dispatch(new purchaseOrderActions.GetPurchaseOrders(new PagingFilterCriteria(1, 10),
                                    new GetPurchaseOrderModel('', '', '', action.purchaseOrderType)));
                    return new purchaseOrderActions.ByPassPurchaseOrderSuccess(res);
                }),
                catchError(error =>
                    of(new purchaseOrderActions.ByPassPurchaseOrderFail(error))
                )
            )
        )
    );

    @Effect()
    submitPurchaseOrder$: Observable<Action> = this.action$.pipe(
        ofType(purchaseOrderActions.PurchaseOrderActionTypes.SubmitPurchaseOrder),
        mergeMap((action: purchaseOrderActions.SubmitPurchaseOrder) =>
            this.purchaseOrderService.submit(action.payload.purchaseOrderId, action.payload.managerId).pipe(
                map(() => {
                    this.store.dispatch(new listViewManagementActions.UpdateSucessAction());
                    this.store.dispatch(new purchaseOrderActions.GetPurchaseOrders(new PagingFilterCriteria(1, 10),
                                    new GetPurchaseOrderModel('', '', '', action.purchaseOrderType)));
                    return new purchaseOrderActions.SubmitPurchaseOrderSuccess(action.payload.purchaseOrderId);
                }),
                catchError(error =>
                    of(new purchaseOrderActions.SubmitPurchaseOrderFail(error))
                )
            )
        )
    );

}
