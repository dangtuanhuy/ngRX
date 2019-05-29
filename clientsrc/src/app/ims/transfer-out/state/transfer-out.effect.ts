import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as transferOutActions from '../state/transfer-out.action';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { AllocationTransactionService } from '../../../shared/services/allocation-transaction.service';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { AllocationTransactionModel } from '../../allocation-transaction/allocation-transaction.model';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import {
          AllocationTransactionByListIdModel,
          InventoryTransactionTransferOutViewModel,
          AddTransferOutRequestModel
       } from '../transfer-out.model';
import { TransferOutService } from 'src/app/shared/services/transfer-out.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Injectable()
export class TransferOutEffects {
  constructor(
    private store: Store<any>,
    private action$: Actions,
    private allocationTransactionService: AllocationTransactionService,
    private transferOutService: TransferOutService,
    private notificationService: NotificationService
  ) { }

  @Effect()
  getAllocationTransactions$: Observable<Action> = this.action$
    .pipe(
      ofType(transferOutActions.TransferOutActionTypes.GetAllocationTransactions),
      mergeMap((action: transferOutActions.GetAllocationTransactions) =>
        this.allocationTransactionService
          .getAllocationTransactionsByLocation(action.payload.page, action.payload.numberItemsPerPage, action.transferOutRequestModel)
          .pipe(map((allocationTransactions: PagedResult<AllocationTransactionModel>) => {
            this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(allocationTransactions));
            return new transferOutActions.GetAllocationTransactionsSuccess(allocationTransactions);
          })
          )
      )
    );

  @Effect()
  getAllocationTransactionByListIds$: Observable<Action> = this.action$.pipe(
    ofType(transferOutActions.TransferOutActionTypes.GetAllocationTransactionByListIds),
    map((action: transferOutActions.GetAllocationTransactionByListIds) => action.allocationTransactionListIdModel),
    mergeMap((allocationTransactionByListIdModel: AllocationTransactionByListIdModel) =>
      this.allocationTransactionService
        .getAllocationTransactionsByListId(allocationTransactionByListIdModel)
        .pipe(map(newAllocationTransactionByListIdModel => {
          return new transferOutActions.GetAllocationTransactionByListIdsSuccess(
            newAllocationTransactionByListIdModel.allocationTransactions);
        }),
          catchError(error => of(new transferOutActions.GetAllocationTransactionByListIdsFail(error)))
        )
    )
  );

  @Effect()
  getInventoryTransactionTransferOuts$: Observable<Action> = this.action$
    .pipe(
      ofType(transferOutActions.TransferOutActionTypes.GetTransferOuts),
      mergeMap((action: transferOutActions.GetTransferOuts) =>
        this.transferOutService
          .getInventoryTransactionTransferOuts(action.payload.page, action.payload.numberItemsPerPage, action.transferRequestModel)
          .pipe(map((inventoryTransactionTransferOuts: PagedResult<InventoryTransactionTransferOutViewModel>) => {
            this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(inventoryTransactionTransferOuts));
            return new transferOutActions.GetTransferOutsSuccess(inventoryTransactionTransferOuts);
          })
          )
      )
    );


  @Effect()
  getInventoryTransactionTransferOut$: Observable<Action> = this.action$
    .pipe(
      ofType(transferOutActions.TransferOutActionTypes.GetTransferOut),
      mergeMap((action: transferOutActions.GetTransferOut) =>
        this.transferOutService
          .getBy(action.payload)
          .pipe(map((inventoryTransactionTransferOut: InventoryTransactionTransferOutViewModel) => {
            return new transferOutActions.GetTransferOutSuccess(inventoryTransactionTransferOut);
          })
          )
      )
    );

  @Effect()
  addTransferOut$: Observable<Action> = this.action$.pipe(
        ofType(transferOutActions.TransferOutActionTypes.AddTransferOutSuccess),
        map((action: transferOutActions.AddTransferOutSuccess) => action.payload),
        mergeMap((transfeOut: AddTransferOutRequestModel) =>
            this.transferOutService.add(transfeOut).pipe(
                map((newTransfeOut: any) => {
                    this.store.dispatch(new listViewManagementActions.AddSucessAction());
                    this.notificationService.success('Add Transfer Out Successful');
                    return new transferOutActions.AddTransferOutSuccess(newTransfeOut);
                }),
                catchError(error => of(new transferOutActions.AddTransferOutFail(error)))
            )
        )
    );
}
