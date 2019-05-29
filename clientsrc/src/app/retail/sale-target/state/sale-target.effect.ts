import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, ofType, Effect } from '@ngrx/effects';
import * as storeActions from '../state/sale-target.action';
import { Observable } from 'rxjs';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { mergeMap, map } from 'rxjs/operators';
import { StoreSaleTargetModel, SaleTargetModel, ReportSaleTargetModel } from '../sale-target.model';
import { SaleTargetService } from 'src/app/shared/services/sale-target.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/shared/services/notification.service';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { store } from '@angular/core/src/render3';

@Injectable()
export class SaleTargetEffects {
    // tslint:disable-next-line:no-shadowed-variable
    constructor(private store: Store<any>,
        private action$: Actions,
        private saleTargetService: SaleTargetService,
        private modalService: NgbModal,
        private _notificationService: NotificationService) { }

    @Effect()
    getStores$: Observable<Action> = this.action$.pipe(
        ofType(storeActions.SaleTargetActionTypes.GetStores),
        mergeMap((action: storeActions.GetStores) =>
            this.saleTargetService
                .getAll(action.payload.page, action.payload.numberItemsPerPage)
                .pipe(
                    map(
                        (stores: PagedResult<StoreSaleTargetModel>) => {
                            this.store.dispatch(new storeActions.ListPage(stores));
                            return new storeActions.GetStoresSuccess(stores);
                        }
                    )
                )
        )
    );

    @Effect()
    addSaleTarget$: Observable<Action> = this.action$.pipe(
        ofType(storeActions.SaleTargetActionTypes.AddSaleTarget),
        mergeMap((action: storeActions.AddSaleTarget) =>
            this.saleTargetService
                .addSaleTarget(action.payload)
                .pipe(
                    map(
                        (saleTarget) => {
                            this._notificationService.success('Add target success');
                            this.modalService.dismissAll();
                            this.store.dispatch(new storeActions.AddSaleTargetSuccess(saleTarget));
                            return new storeActions.ChangeState(true);
                        }
                    )
                )
        )
    );

    @Effect()
    updateSaleTarget$: Observable<Action> = this.action$.pipe(
        ofType(storeActions.SaleTargetActionTypes.UpdateSaleTarget),
        mergeMap((action: storeActions.UpdateSaleTarget) =>
            this.saleTargetService
                .update(action.payload)
                .pipe(
                    map(
                        (saleTarget) => {
                            this._notificationService.success('Update target success');
                            this.store.dispatch(new storeActions.UpdateSaleTargetSuccess(action.payload));
                            return new storeActions.ChangeState(true);
                        }

                    )
                )
        )
    );

    @Effect()
    deleteSaleTarget$: Observable<Action> = this.action$.pipe(
        ofType(storeActions.SaleTargetActionTypes.DeleteSaleTarget),
        mergeMap((action: storeActions.DeleteSaleTarget) =>
            this.saleTargetService
                .deleteSaleTarget(action.payload)
                .pipe(
                    map(
                        () => {
                            this._notificationService.success('Delete target success');
                            this.store.dispatch(new storeActions.DeleteSaleTargetSuccess(action.payload));
                            return new storeActions.ChangeState(true);
                        }

                    )
                )
        )
    );

    @Effect()
    getReportSaleTarget$: Observable<Action> = this.action$.pipe(
        ofType(storeActions.SaleTargetActionTypes.GetReportSaleTarget),
        mergeMap((action: storeActions.GetReportSaleTarget) =>
            this.saleTargetService
                .getReport(action.payload.page, action.payload.numberItemsPerPage, action.channelId, action.date)
                .pipe(
                    map(
                        (result: PagedResult<ReportSaleTargetModel>) => {
                            this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(result));
                            return new storeActions.GetReportSaleTargetSuccess(result.data);
                        }

                    )
                )
        )
    );
}


