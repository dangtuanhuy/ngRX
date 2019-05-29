import * as fromRoot from 'src/app/shared/state/app.state';
import { TransferOutActions, TransferOutActionTypes } from './transfer-out.action';
import { AllocationTransactionModel } from '../../allocation-transaction/allocation-transaction.model';
import { InventoryTransactionTransferOutViewModel } from '../transfer-out.model';


export interface State extends fromRoot.State {
  allocationTransactions: TransferOutState;
}

export interface TransferOutState {
  allocationTransactions: AllocationTransactionModel[];
  selectedAllocationTransactions: AllocationTransactionModel[];
  inventoryTransactionTransferOuts: InventoryTransactionTransferOutViewModel[];
  inventoryTransactionTransferOut: InventoryTransactionTransferOutViewModel;
}

const initialState: TransferOutState = {
  allocationTransactions: [],
  selectedAllocationTransactions: [],
  inventoryTransactionTransferOuts: [],
  inventoryTransactionTransferOut: null
};

export const key = 'transfer_out_reducer';

export function reducer(
  state = initialState,
  action: TransferOutActions
): TransferOutState {
  switch (action.type) {
    case TransferOutActionTypes.GetAllocationTransactionsSuccess:
      return {
        ...state,
        allocationTransactions: action.payload.data
      };
    case TransferOutActionTypes.GetTransferOutsSuccess:
      return {
        ...state,
        inventoryTransactionTransferOuts: action.payload.data
      };
    case TransferOutActionTypes.GetTransferOutSuccess:
      return {
        ...state,
        inventoryTransactionTransferOut: action.payload
      };
    case TransferOutActionTypes.GetAllocationTransactionByListIdsSuccess:
      return {
        ...state,
        selectedAllocationTransactions: action.payload
      };
    case TransferOutActionTypes.AddTransferOutSuccess:
      return {
        ...state
  };
    default:
      return state;
  }
}
