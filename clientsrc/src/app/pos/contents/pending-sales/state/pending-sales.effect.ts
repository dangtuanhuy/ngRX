import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import * as pendingSalesActions from './pending-sales.action';
import { mergeMap, map, switchMap } from 'rxjs/operators';
import { PendingSaleService } from 'src/app/pos/shared/services/pending-sale.service';
import { PendingSalePagingModel } from 'src/app/pos/shared/view-models/pending-sale-paging.model';

@Injectable()
export class PendingSalesEffects {
    constructor(
        private action$: Actions,
        private pendingSaleService: PendingSaleService
    ) { }

    @Effect()
    getPendingSales$: Observable<Action> = this.action$.pipe(
        ofType(pendingSalesActions.PendingSaleActionTypes.GetPendingSales),
        switchMap((action: pendingSalesActions.GetPendingSales) =>
            this.pendingSaleService.getPendingSalesPaging(action.payload.pageIndex, action.payload.pageSize).pipe(
                map(pendingSalePagingModel => (new pendingSalesActions.GetPendingSalesSuccess(pendingSalePagingModel)))
            ))
    );

    @Effect()
    searchPendingSales$: Observable<Action> = this.action$.pipe(
        ofType(pendingSalesActions.PendingSaleActionTypes.SearchPendingSales),
        switchMap((action: pendingSalesActions.SearchPendingSales) =>
            this.pendingSaleService.searchPendingSalesPaging(
                action.payload.textSearch, action.payload.pageIndex, action.payload.pageSize)
                .pipe(
                    map((pendingSalePagingModel: PendingSalePagingModel) =>
                        (new pendingSalesActions.GetPendingSalesSuccess(pendingSalePagingModel)))
                ))
    );

    @Effect()
    getPendingSale$: Observable<Action> = this.action$.pipe(
        ofType(pendingSalesActions.PendingSaleActionTypes.GetPendingSale),
        mergeMap((action: pendingSalesActions.GetPendingSale) =>
            this.pendingSaleService.getPendingSale(action.payload).pipe(
                map(sale => {
                    if (sale) {
                        return (new pendingSalesActions.GetPendingSaleSuccess(sale));
                    }

                    return (new pendingSalesActions.GetPendingSaleFailure(''));
                })
            ))
    );

    @Effect()
    deletePendingSale$: Observable<Action> = this.action$.pipe(
        ofType(pendingSalesActions.PendingSaleActionTypes.DeletePendingSale),
        mergeMap((action: pendingSalesActions.DeletePendingSale) =>
            this.pendingSaleService.deleteIncludePendingSaleItems(action.payload).pipe(
                map((result: boolean) =>
                    result
                        ? (new pendingSalesActions.DeletePendingSaleSuccess(action.payload))
                        : (new pendingSalesActions.DeletePendingSaleFailure('')))
            ))
    );
}
