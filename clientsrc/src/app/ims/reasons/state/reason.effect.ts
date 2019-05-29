import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { ReasonService } from 'src/app/shared/services/reason.service';
import * as reasonActions from '../state/reason.action';
import { ReasonModel } from '../reason.model';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';

const pageSize = 10;

@Injectable()
export class ReasonsEffects {
    constructor(
        private store: Store<any>,
        private action$: Actions,
        private reasonService: ReasonService) { }

    @Effect()
    getReasons$: Observable<Action> = this.action$
        .pipe(
            ofType(reasonActions.ReasonActionTypes.GetReasons),
            mergeMap((action: reasonActions.GetReasons) =>
                this.reasonService
                    .getAll(action.payload.page, action.payload.numberItemsPerPage, action.queryText)
                    .pipe(map((reasons: PagedResult<ReasonModel>) => {
                        this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(reasons));
                        return new reasonActions.GetReasonsSuccess(reasons);
                    })
                    )
            )
        );

    @Effect()
    getReason$: Observable<Action> = this.action$
        .pipe(
            ofType(reasonActions.ReasonActionTypes.GetReason),
            mergeMap((action: reasonActions.GetReason) =>
                this.reasonService
                    .getBy(action.payload)
                    .pipe(map((reason: ReasonModel) => {
                        return new reasonActions.GetReasonSuccess(reason);
                    })
                    )
            )
        );

    @Effect()
    addReason$: Observable<Action> = this.action$.pipe(
        ofType(reasonActions.ReasonActionTypes.AddReason),
        map((action: reasonActions.AddReason) => action.payload),
        mergeMap((Reason: ReasonModel) =>
            this.reasonService.add(Reason).pipe(
                map(newReason => {
                    this.store.dispatch(new listViewManagementActions.AddSucessAction());
                    this.store.dispatch(new reasonActions.GetReasons(new PagingFilterCriteria(1, pageSize), ''));
                    return new reasonActions.AddReasonSuccess(newReason);
                }),
                catchError(error => of(new reasonActions.AddReasonFail(error)))
            )
        )
    );

    @Effect()
    updateReason$: Observable<Action> = this.action$.pipe(
        ofType(reasonActions.ReasonActionTypes.UpdateReason),
        map((action: reasonActions.UpdateReason) => action.payload),
        mergeMap((reason: ReasonModel) =>
            this.reasonService.update(reason).pipe(
                map(updatedReason => {
                    this.store.dispatch(new listViewManagementActions.UpdateSucessAction());
                    this.store.dispatch(new reasonActions.GetReasons(new PagingFilterCriteria(1, pageSize), ''));
                    return new reasonActions.UpdateReasonSuccess(updatedReason);
                }),
                catchError(error =>
                    of(new reasonActions.UpdateReasonFail(error))
                )
            )
        )
    );

    @Effect()
    deleteReason$: Observable<Action> = this.action$.pipe(
        ofType(reasonActions.ReasonActionTypes.DeleteReason),
        map((action: reasonActions.DeleteReason) => action.payload),
        mergeMap((id: string) =>
            this.reasonService.remove(id).pipe(
                map(() => {
                    this.store.dispatch(new listViewManagementActions.DeleteSucessAction());
                    this.store.dispatch(new reasonActions.GetReasons(new PagingFilterCriteria(1, pageSize), ''));
                    return new reasonActions.DeleteReasonSuccess(id);
                }),
                catchError(error =>
                    of(new reasonActions.DeleteReasonFail(error))
                )
            )
        )
    );
}
