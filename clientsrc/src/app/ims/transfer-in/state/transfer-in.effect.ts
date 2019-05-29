import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as transferInActions from '../state/transfer-in.action';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { TransferOutService } from 'src/app/shared/services/transfer-out.service';
import { InventoryTransactionTransferInViewModel } from '../transfer-in.model';
import { TransferInService } from 'src/app/shared/services/transfer-in.service';

@Injectable()
export class TransferInEffects {
  constructor(
    private store: Store<any>,
    private action$: Actions,
    private transferOutService: TransferOutService,
    private transferInService: TransferInService
  ) { }


  @Effect()
  getInventoryTransactionTransferIns$: Observable<Action> = this.action$
    .pipe(
      ofType(transferInActions.TransferInActionTypes.GetTransferIns),
      mergeMap((action: transferInActions.GetTransferIns) =>
        this.transferInService
          .getInventoryTransactionTransferIns(
              action.payload.page,
              action.payload.numberItemsPerPage,
              action.transferRequestModel
          )
          .pipe(map((inventoryTransactionTransferIns: PagedResult<InventoryTransactionTransferInViewModel>) => {
            this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(inventoryTransactionTransferIns));
            return new transferInActions.GetTransferInsSuccess(inventoryTransactionTransferIns);
          })
          )
      )
    );

  @Effect()
  getInventoryTransactionTransferOut$: Observable<Action> = this.action$
    .pipe(
      ofType(transferInActions.TransferInActionTypes.GetTransferIn),
      mergeMap((action: transferInActions.GetTransferIn) =>
        this.transferInService
          .getBy(action.payload)
          .pipe(map((inventoryTransactionTransferIn: InventoryTransactionTransferInViewModel) => {
            return new transferInActions.GetTransferInSuccess(inventoryTransactionTransferIn);
          })
          )
      )
    );


  @Effect()
  getInventoryTransactionTransferOutsByLocation$: Observable<Action> = this.action$
    .pipe(
      ofType(transferInActions.TransferInActionTypes.GetInventoryTransactionTransferInsByLocation),
      mergeMap((action: transferInActions.GetInventoryTransactionTransferInsByLocation) =>
        this.transferOutService
          .getInventoryTransactionTransferOutsByLocation(
              action.payload.page,
              action.payload.numberItemsPerPage,
              action.transferOutRequestModel
          )
          .pipe(map((inventoryTransactionTransferIns: PagedResult<InventoryTransactionTransferInViewModel>) => {
            this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(inventoryTransactionTransferIns));
            return new transferInActions.GetInventoryTransactionTransferInsByLocationSuccess(inventoryTransactionTransferIns);
          })
          )
      )
    );
}
