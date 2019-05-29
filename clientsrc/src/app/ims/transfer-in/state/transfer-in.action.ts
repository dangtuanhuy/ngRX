import { Action } from '@ngrx/store';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { TransferInRequestModel, InventoryTransactionTransferInModel, InventoryTransactionTransferInViewModel } from '../transfer-in.model';
import { FilterRequestModel } from '../../goods-inwards/goods-inward.model';

export enum TransferInActionTypes {
  GetTransferIns = '[TransferIn] Get TransferIns',
  GetTransferInsSuccess = '[TransferIn] Get TransferIns Success',
  GetTransferInsFail = '[TransferIn] Get TransferIns Fail',
  GetTransferIn = '[TransferIn] Get TransferIn',
  GetTransferInSuccess = '[TransferIn] Get TransferIn Success',
  GetTransferInFail = '[TransferIn] Get TransferIn Fail',
  GetInventoryTransactionTransferInsByLocation = '[TransferIn] Get InventoryTransactionTransferIns',
  GetInventoryTransactionTransferInsByLocationSuccess = '[TransferIn] Get InventoryTransactionTransferIns Success',
  GetInventoryTransactionTransferInsByLocationFail = '[TransferIn] Get InventoryTransactionTransferIns Fail'
}


export class GetInventoryTransactionTransferInsByLocation implements Action {
  readonly type = TransferInActionTypes.GetInventoryTransactionTransferInsByLocation;
  constructor(public payload: PagingFilterCriteria, public transferOutRequestModel: TransferInRequestModel) { }
}

export class GetInventoryTransactionTransferInsByLocationSuccess implements Action {
  readonly type = TransferInActionTypes.GetInventoryTransactionTransferInsByLocationSuccess;
  constructor(public payload: PagedResult<InventoryTransactionTransferInViewModel>) { }
}

export class GetInventoryTransactionTransferInsByLocationFail implements Action {
  readonly type = TransferInActionTypes.GetInventoryTransactionTransferInsByLocationFail;
  constructor(public payload: null) { }
}

export class GetTransferIns implements Action {
  readonly type = TransferInActionTypes.GetTransferIns;
  constructor(public payload: PagingFilterCriteria, public transferRequestModel: FilterRequestModel) { }
}

export class GetTransferInsSuccess implements Action {
  readonly type = TransferInActionTypes.GetTransferInsSuccess;
  constructor(public payload: PagedResult<InventoryTransactionTransferInViewModel>) { }
}

export class GetTransferInsFail implements Action {
  readonly type = TransferInActionTypes.GetTransferInsFail;
  constructor(public payload: null) { }
}

export class GetTransferIn implements Action {
  readonly type = TransferInActionTypes.GetTransferIn;
  constructor(public payload: string) { }
}

export class GetTransferInSuccess implements Action {
  readonly type = TransferInActionTypes.GetTransferInSuccess;
  constructor(public payload: InventoryTransactionTransferInViewModel) { }
}

export class GetTransferInFail implements Action {
  readonly type = TransferInActionTypes.GetTransferInFail;
  constructor(public payload: null) { }
}

export type TransferInActions =
    GetTransferIns
  | GetTransferInsSuccess
  | GetTransferInsFail
  | GetTransferIn
  | GetTransferInSuccess
  | GetTransferInFail
  | GetInventoryTransactionTransferInsByLocation
  | GetInventoryTransactionTransferInsByLocationSuccess
  | GetInventoryTransactionTransferInsByLocationFail;
