import { Action } from '@ngrx/store';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { AllocationTransactionModel } from '../../allocation-transaction/allocation-transaction.model';
import { TransferOutRequestModel,
         AllocationTransactionByListIdModel,
         InventoryTransactionTransferOutViewModel,
         AddTransferOutRequestModel
       } from '../transfer-out.model';
import { FilterRequestModel } from '../../goods-inwards/goods-inward.model';

export enum TransferOutActionTypes {
  GetTransferOuts = '[TransferOut] Get TransferOuts',
  GetTransferOutsSuccess = '[TransferOut] Get TransferOuts Success',
  GetTransferOutsFail = '[TransferOut] Get TransferOuts Fail',
  GetTransferOut = '[TransferOut] Get TransferOut',
  GetTransferOutSuccess = '[TransferOut] Get TransferOut Success',
  GetTransferOutFail = '[TransferOut] Get TransferOut Fail',
  GetAllocationTransactions = '[TransferOut] Get AllocationTransactions',
  GetAllocationTransactionsSuccess = '[TransferOut] Get AllocationTransactions Success',
  GetAllocationTransactionsFail = '[TransferOut] Get AllocationTransactions Fail',
  GetAllocationTransactionByListIds = '[TransferOut] Get AllocationTransactionByListIds',
  GetAllocationTransactionByListIdsSuccess = '[TransferOut] Get AllocationTransactionByListIds Success',
  GetAllocationTransactionByListIdsFail = '[TransferOut] Get AllocationTransactionByListIds Fail',
  AddTransferOut = '[TransferOut] Add Transfer Out',
  AddTransferOutSuccess = '[TransferOut] Add Transfer Out Success',
  AddTransferOutFail = '[TransferOut] Add Transfer Out Fail',
}


export class GetTransferOuts implements Action {
  readonly type = TransferOutActionTypes.GetTransferOuts;
  constructor(public payload: PagingFilterCriteria, public transferRequestModel: FilterRequestModel) { }
}

export class GetTransferOutsSuccess implements Action {
  readonly type = TransferOutActionTypes.GetTransferOutsSuccess;
  constructor(public payload: PagedResult<InventoryTransactionTransferOutViewModel>) { }
}

export class GetTransferOutsFail implements Action {
  readonly type = TransferOutActionTypes.GetTransferOutsFail;
  constructor(public payload: null) { }
}

export class GetTransferOut implements Action {
  readonly type = TransferOutActionTypes.GetTransferOut;
  constructor(public payload: string) { }
}

export class GetTransferOutSuccess implements Action {
  readonly type = TransferOutActionTypes.GetTransferOutSuccess;
  constructor(public payload: InventoryTransactionTransferOutViewModel) { }
}

export class GetTransferOutFail implements Action {
  readonly type = TransferOutActionTypes.GetTransferOutFail;
  constructor(public payload: null) { }
}

export class GetAllocationTransactions implements Action {
  readonly type = TransferOutActionTypes.GetAllocationTransactions;
  constructor(public payload: PagingFilterCriteria, public transferOutRequestModel: TransferOutRequestModel) { }
}

export class GetAllocationTransactionsSuccess implements Action {
  readonly type = TransferOutActionTypes.GetAllocationTransactionsSuccess;
  constructor(public payload: PagedResult<AllocationTransactionModel>) { }
}

export class GetAllocationTransactionsFail implements Action {
  readonly type = TransferOutActionTypes.GetAllocationTransactionsFail;
  constructor(public payload: null) { }
}

export class GetAllocationTransactionByListIds implements Action {
  readonly type = TransferOutActionTypes.GetAllocationTransactionByListIds;
  constructor(public allocationTransactionListIdModel: AllocationTransactionByListIdModel) { }
}

export class GetAllocationTransactionByListIdsSuccess implements Action {
  readonly type = TransferOutActionTypes.GetAllocationTransactionByListIdsSuccess;
  constructor(public payload: Array<AllocationTransactionModel>) { }
}

export class GetAllocationTransactionByListIdsFail implements Action {
  readonly type = TransferOutActionTypes.GetAllocationTransactionByListIdsFail;
  constructor(public payload: null) { }
}

export class AddTransferOut implements Action {
  readonly type = TransferOutActionTypes.AddTransferOut;
  constructor(public payload: AddTransferOutRequestModel) { }
}

export class AddTransferOutSuccess implements Action {
  readonly type = TransferOutActionTypes.AddTransferOutSuccess;
  constructor(public payload: AddTransferOutRequestModel) { }
}

export class AddTransferOutFail implements Action {
  readonly type = TransferOutActionTypes.AddTransferOutFail;
  constructor(public payload: any) { }
}


export type TransferOutActions =
    GetTransferOuts
  | GetTransferOutsSuccess
  | GetTransferOutsFail
  | GetTransferOut
  | GetTransferOutSuccess
  | GetTransferOutFail
  | GetAllocationTransactions
  | GetAllocationTransactionsSuccess
  | GetAllocationTransactionsFail
  | GetAllocationTransactionByListIds
  | GetAllocationTransactionByListIdsSuccess
  | GetAllocationTransactionByListIdsFail
  | AddTransferOut
  | AddTransferOutSuccess
  | AddTransferOutFail;
