import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as allocationTransactionActions from '../state/allocation-transaction.action';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { AllocationTransactionService } from '../../../shared/services/allocation-transaction.service';
import { AllocationTransactionModel, UpdateStatusAllocationTransactionModel } from '../allocation-transaction.model';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { FilterRequestModel } from '../../goods-inwards/goods-inward.model';

const pageSize = 10;

@Injectable()
export class AllocationTransactionEffects {
  constructor(
    private store: Store<any>,
    private action$: Actions,
    private allocationTransactionService: AllocationTransactionService
  ) { }

  @Effect()
  getAllocationTransactions$: Observable<Action> = this.action$
    .pipe(
      ofType(allocationTransactionActions.AllocationTransactionActionTypes.GetAllocationTransactions),
      mergeMap((action: allocationTransactionActions.GetAllocationTransactions) =>
        this.allocationTransactionService
          .getAll(action.payload.page, action.payload.numberItemsPerPage, action.filterRequestModel)
          .pipe(map((allocationTransactions: PagedResult<AllocationTransactionModel>) => {
            this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(allocationTransactions));
            return new allocationTransactionActions.GetAllocationTransactionsSuccess(allocationTransactions);
          })
          )
      )
    );

  @Effect()
  getAllocationTransaction$: Observable<Action> = this.action$
    .pipe(
      ofType(allocationTransactionActions.AllocationTransactionActionTypes.GetAllocationTransaction),
      mergeMap((action: allocationTransactionActions.GetAllocationTransaction) =>
        this.allocationTransactionService
          .getBy(action.payload)
          .pipe(map((allocationTransaction: AllocationTransactionModel) => {
            return new allocationTransactionActions.GetAllocationTransactionSuccess(allocationTransaction);
          })
          )
      )
    );

  @Effect()
  addAllocationTransaction$: Observable<Action> = this.action$.pipe(
    ofType(allocationTransactionActions.AllocationTransactionActionTypes.AddAllocationTransaction),
    map((action: allocationTransactionActions.AddAllocationTransaction) => action.payload),
    mergeMap((allocationTransaction: AllocationTransactionModel) =>
      this.allocationTransactionService.add(allocationTransaction).pipe(
        map(newAllocationTransaction => {
          this.store.dispatch(new listViewManagementActions.AddSucessAction());
          this.store.dispatch(new allocationTransactionActions.GetAllocationTransactions(
            new PagingFilterCriteria(1, pageSize), new FilterRequestModel())
          );
          return new allocationTransactionActions.AddAllocationTransactionSuccess(newAllocationTransaction);
        }),
        catchError(error => of(new allocationTransactionActions.AddAllocationTransactionFail(error)))
      )
    )
  );

  @Effect()
  updateAllocationTransaction$: Observable<Action> = this.action$.pipe(
    ofType(allocationTransactionActions.AllocationTransactionActionTypes.UpdateAllocationTransaction),
    map((action: allocationTransactionActions.UpdateAllocationTransaction) => action.payload),
    mergeMap((allocationTransaction: AllocationTransactionModel) =>
      this.allocationTransactionService.update(allocationTransaction).pipe(
        map(updatedAllocationTransaction => {
          this.store.dispatch(new listViewManagementActions.UpdateSucessAction());
          this.store.dispatch(new allocationTransactionActions.GetAllocationTransactions(
            new PagingFilterCriteria(1, pageSize), new FilterRequestModel())
          );
          return new allocationTransactionActions.UpdateAllocationTransactionSuccess(updatedAllocationTransaction);
        }),
        catchError(error =>
          of(new allocationTransactionActions.UpdateAllocationTransactionFail(error))
        )
      )
    )
  );

  @Effect()
  deleteAllocationTransaction$: Observable<Action> = this.action$.pipe(
    ofType(allocationTransactionActions.AllocationTransactionActionTypes.DeleteAllocationTransaction),
    map((action: allocationTransactionActions.DeleteAllocationTransaction) => action.payload),
    mergeMap((id: string) =>
      this.allocationTransactionService.remove(id).pipe(
        map(() => {
          this.store.dispatch(new listViewManagementActions.DeleteSucessAction());
          this.store.dispatch(new allocationTransactionActions.GetAllocationTransactions(
            new PagingFilterCriteria(1, pageSize), new FilterRequestModel())
          );
          return new allocationTransactionActions.DeleteAllocationTransactionSuccess(id);
        }),
        catchError(error =>
          of(new allocationTransactionActions.DeleteAllocationTransactionFail(error))
        )
      )
    )
  );

  @Effect()
  updateStatusAllocationTransaction$: Observable<Action> = this.action$.pipe(
    ofType(allocationTransactionActions.AllocationTransactionActionTypes.UpdateStatusAllocationTransaction),
    map((action: allocationTransactionActions.UpdateStatusAllocationTransaction) => action.payload),
    mergeMap((updateStatusAllocationTransactionModel: UpdateStatusAllocationTransactionModel) =>
      this.allocationTransactionService.updateStatus(updateStatusAllocationTransactionModel).pipe(
        map(() => {
          this.store.dispatch(new allocationTransactionActions.GetAllocationTransactions(
            new PagingFilterCriteria(1, pageSize), new FilterRequestModel())
          );
          return new allocationTransactionActions.UpdateStatusAllocationTransactionSuccess(updateStatusAllocationTransactionModel);
        }),
        catchError(error =>
          of(new allocationTransactionActions.UpdateStatusAllocationTransactionFail(error))
        )
      )
    )
  );
}
