import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as assortmentActions from '../state/assortment.action';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { AssortmentService } from '../../../shared/services/assortment.service';
import { AssortmentModel } from '../assortment.model';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';

const pageSize = 10;

@Injectable()
export class AssortmentEffects {
  constructor(
    private store: Store<any>,
    private action$: Actions,
    private assortmentService: AssortmentService
  ) { }

  @Effect()
  getAssortments$: Observable<Action> = this.action$
    .pipe(
      ofType(assortmentActions.AssortmentActionTypes.GetAssortments),
      mergeMap((action: assortmentActions.GetAssortments) =>
        this.assortmentService
          .getAll(action.payload.page, action.payload.numberItemsPerPage)
          .pipe(map((assortments: PagedResult<AssortmentModel>) => {
            this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(assortments));
            return new assortmentActions.GetAssortmentsSuccess(assortments);
          })
          )
      )
    );

  @Effect()
  getAssortment$: Observable<Action> = this.action$
    .pipe(
      ofType(assortmentActions.AssortmentActionTypes.GetAssortment),
      mergeMap((action: assortmentActions.GetAssortment) =>
        this.assortmentService
          .getBy(action.payload)
          .pipe(map((assortment: AssortmentModel) => {
            return new assortmentActions.GetAssortmentSuccess(assortment);
          })
          )
      )
    );

  @Effect()
  addAssortment$: Observable<Action> = this.action$.pipe(
    ofType(assortmentActions.AssortmentActionTypes.AddAssortment),
    map((action: assortmentActions.AddAssortment) => action.payload),
    mergeMap((assortment: AssortmentModel) =>
      this.assortmentService.add(assortment).pipe(
        map(newAssortment => {
          this.store.dispatch(new listViewManagementActions.AddSucessAction());
          this.store.dispatch(new assortmentActions.GetAssortments(new PagingFilterCriteria(1, pageSize)));
          return new assortmentActions.AddAssortmentSuccess(newAssortment);
        }),
        catchError(error => of(new assortmentActions.AddAssortmentFail(error)))
      )
    )
  );

  @Effect()
  updateAssortment$: Observable<Action> = this.action$.pipe(
    ofType(assortmentActions.AssortmentActionTypes.UpdateAssortment),
    map((action: assortmentActions.UpdateAssortment) => action.payload),
    mergeMap((assortment: AssortmentModel) =>
      this.assortmentService.update(assortment).pipe(
        map(updatedAssortment => {
          this.store.dispatch(new listViewManagementActions.UpdateSucessAction());
          this.store.dispatch(new assortmentActions.GetAssortments(new PagingFilterCriteria(1, pageSize)));
          return new assortmentActions.UpdateAssortmentSuccess(updatedAssortment);
        }),
        catchError(error =>
          of(new assortmentActions.UpdateAssortmentFail(error))
        )
      )
    )
  );

  @Effect()
  deleteAssortment$: Observable<Action> = this.action$.pipe(
    ofType(assortmentActions.AssortmentActionTypes.DeleteAssortment),
    map((action: assortmentActions.DeleteAssortment) => action.payload),
    mergeMap((id: string) =>
      this.assortmentService.remove(id).pipe(
        map(() => {
          this.store.dispatch(new listViewManagementActions.DeleteSucessAction());
          this.store.dispatch(new assortmentActions.GetAssortments(new PagingFilterCriteria(1, pageSize)));
          return new assortmentActions.DeleteAssortmentSuccess(id);
        }),
        catchError(error =>
          of(new assortmentActions.DeleteAssortmentFail(error))
        )
      )
    )
  );
}
