import { Action } from '@ngrx/store';
import { AllocationTransactionModel, UpdateStatusAllocationTransactionModel } from '../allocation-transaction.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { FilterRequestModel } from '../../goods-inwards/goods-inward.model';

export enum AllocationTransactionActionTypes {
  GetAllocationTransactions = '[AllocationTransaction] Get AllocationTransactions',
  GetAllocationTransaction = '[AllocationTransaction] Get AllocationTransaction',
  GetAllocationTransactionsSuccess = '[AllocationTransaction] Get AllocationTransactions Success',
  GetAllocationTransactionSuccess = '[AllocationTransaction] Get AllocationTransaction Success',
  GetAllocationTransactionsFail = '[AllocationTransaction] Get AllocationTransactions Fail',
  AddAllocationTransaction = '[AllocationTransaction] Add AllocationTransaction',
  AddAllocationTransactionSuccess = '[AllocationTransaction] Add AllocationTransaction Success',
  AddAllocationTransactionFail = '[AllocationTransaction] Add AllocationTransaction Fail',
  UpdateAllocationTransaction = '[AllocationTransaction] Update AllocationTransaction',
  UpdateAllocationTransactionSuccess = '[AllocationTransaction] Update AllocationTransaction Success',
  UpdateAllocationTransactionFail = '[AllocationTransaction] Update AllocationTransaction Fail',
  DeleteAllocationTransaction = '[AllocationTransaction] Delete AllocationTransaction',
  DeleteAllocationTransactionSuccess = '[AllocationTransaction] Delete AllocationTransaction Success',
  DeleteAllocationTransactionFail = '[AllocationTransaction] Delete AllocationTransaction Fail',
  UpdateStatusAllocationTransaction = '[AllocationTransaction] Update Status AllocationTransaction',
  UpdateStatusAllocationTransactionSuccess = '[AllocationTransaction] Update Status AllocationTransaction Success',
  UpdateStatusAllocationTransactionFail = '[AllocationTransaction] Update Status AllocationTransaction Fail',
}


export class GetAllocationTransactions implements Action {
  readonly type = AllocationTransactionActionTypes.GetAllocationTransactions;
  constructor(public payload: PagingFilterCriteria, public filterRequestModel: FilterRequestModel ) { }
}

export class GetAllocationTransaction implements Action {
  readonly type = AllocationTransactionActionTypes.GetAllocationTransaction;
  constructor(public payload: string) { }
}

export class GetAllocationTransactionsSuccess implements Action {
  readonly type = AllocationTransactionActionTypes.GetAllocationTransactionsSuccess;
  constructor(public payload: PagedResult<AllocationTransactionModel>) { }
}

export class GetAllocationTransactionSuccess implements Action {
  readonly type = AllocationTransactionActionTypes.GetAllocationTransactionSuccess;
  constructor(public payload: AllocationTransactionModel) { }
}

export class GetAllocationTransactionsFail implements Action {
  readonly type = AllocationTransactionActionTypes.GetAllocationTransactionsFail;
  constructor(public payload: null) { }
}

export class AddAllocationTransaction implements Action {
  readonly type = AllocationTransactionActionTypes.AddAllocationTransaction;
  constructor(public payload: AllocationTransactionModel) { }
}

export class AddAllocationTransactionSuccess implements Action {
  readonly type = AllocationTransactionActionTypes.AddAllocationTransactionSuccess;
  constructor(public payload: AllocationTransactionModel) { }
}

export class AddAllocationTransactionFail implements Action {
  readonly type = AllocationTransactionActionTypes.AddAllocationTransactionFail;
  constructor(public payload: string) { }
}

export class UpdateAllocationTransaction implements Action {
  readonly type = AllocationTransactionActionTypes.UpdateAllocationTransaction;
  constructor(public payload: AllocationTransactionModel) { }
}

export class UpdateAllocationTransactionSuccess implements Action {
  readonly type = AllocationTransactionActionTypes.UpdateAllocationTransactionSuccess;
  constructor(public payload: AllocationTransactionModel) { }
}

export class UpdateAllocationTransactionFail implements Action {
  readonly type = AllocationTransactionActionTypes.UpdateAllocationTransactionFail;
  constructor(public payload: string) { }
}

export class DeleteAllocationTransaction implements Action {
  readonly type = AllocationTransactionActionTypes.DeleteAllocationTransaction;
  constructor(public payload: string) { }
}

export class DeleteAllocationTransactionSuccess implements Action {
  readonly type = AllocationTransactionActionTypes.DeleteAllocationTransactionSuccess;
  constructor(public payload: string) { }
}

export class DeleteAllocationTransactionFail implements Action {
  readonly type = AllocationTransactionActionTypes.DeleteAllocationTransactionFail;
  constructor(public payload: string) { }
}

export class UpdateStatusAllocationTransaction implements Action {
  readonly type = AllocationTransactionActionTypes.UpdateStatusAllocationTransaction;
  constructor(public payload: UpdateStatusAllocationTransactionModel) { }
}

export class UpdateStatusAllocationTransactionSuccess implements Action {
  readonly type = AllocationTransactionActionTypes.UpdateStatusAllocationTransactionSuccess;
  constructor(public payload: UpdateStatusAllocationTransactionModel) { }
}

export class UpdateStatusAllocationTransactionFail implements Action {
  readonly type = AllocationTransactionActionTypes.UpdateStatusAllocationTransactionFail;
  constructor(public payload: string) { }
}

export type AllocationTransactionActions =
  GetAllocationTransactions
  | GetAllocationTransaction
  | GetAllocationTransactionsSuccess
  | GetAllocationTransactionSuccess
  | GetAllocationTransactionsFail
  | AddAllocationTransaction
  | AddAllocationTransactionSuccess
  | AddAllocationTransactionFail
  | UpdateAllocationTransaction
  | UpdateAllocationTransactionSuccess
  | UpdateAllocationTransactionFail
  | DeleteAllocationTransaction
  | DeleteAllocationTransactionSuccess
  | DeleteAllocationTransactionFail
  | UpdateStatusAllocationTransaction
  | UpdateStatusAllocationTransactionSuccess
  | UpdateStatusAllocationTransactionFail;
