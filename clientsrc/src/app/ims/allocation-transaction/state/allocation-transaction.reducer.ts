import * as fromRoot from 'src/app/shared/state/app.state';
import { AllocationTransactionActions, AllocationTransactionActionTypes } from './allocation-transaction.action';
import { AllocationTransactionModel, AllocationTransactionStatus } from '../allocation-transaction.model';

export interface State extends fromRoot.State {
  allocationTransactions: AllocationTransactionState;
}

export interface AllocationTransactionState {
  allocationTransactions: AllocationTransactionModel[];
  allocationTransaction: AllocationTransactionModel;
}

const initialState: AllocationTransactionState = {
  allocationTransactions: [],
  allocationTransaction: null
};

export const key = 'stock_allocation_reducer';

export function reducer(
  state = initialState,
  action: AllocationTransactionActions
): AllocationTransactionState {
  switch (action.type) {
    case AllocationTransactionActionTypes.GetAllocationTransactionsSuccess:
      return {
        ...state,
        allocationTransactions: action.payload.data
      };
    case AllocationTransactionActionTypes.GetAllocationTransactionSuccess:
      return {
        ...state,
        allocationTransaction: action.payload
      };
    case AllocationTransactionActionTypes.AddAllocationTransactionSuccess:
      return {
        ...state,
        allocationTransactions: [...state.allocationTransactions, action.payload]
      };
    case AllocationTransactionActionTypes.AddAllocationTransactionFail: {
      return {
        ...state
      };
    }
    case AllocationTransactionActionTypes.UpdateAllocationTransactionSuccess:
      const updatedAllocationTransactions = state.allocationTransactions.map(item =>
        action.payload.id === item.id ? action.payload : item
      );
      return {
        ...state,
        allocationTransactions: updatedAllocationTransactions
      };
    case AllocationTransactionActionTypes.UpdateAllocationTransactionFail: {
      return {
        ...state
      };
    }
    case AllocationTransactionActionTypes.DeleteAllocationTransactionSuccess:
      return {
        ...state,
        allocationTransactions: state.allocationTransactions.filter(
          allocationTransaction => allocationTransaction.id !== action.payload
        )
      };
    case AllocationTransactionActionTypes.DeleteAllocationTransactionFail:
      return {
        ...state
      };

    case AllocationTransactionActionTypes.UpdateStatusAllocationTransactionSuccess:
      const status = getAllocationTransactionStatus(action.payload.status);
      const allocation = state.allocationTransactions.find(x => x.id === action.payload.id);
      allocation.status = status;
      const allocationTransactions = state.allocationTransactions.map(item =>
        action.payload.id === item.id ? allocation : item
      );
      return {
        ...state,
        allocationTransactions: allocationTransactions
      };
    case AllocationTransactionActionTypes.UpdateStatusAllocationTransactionFail: {
      return {
        ...state
      };
    }

    default:
      return state;
  }
}

function getAllocationTransactionStatus(status: any) {
  return Object.values(AllocationTransactionStatus).includes(+status)
  ? Object.keys(AllocationTransactionStatus).find(function(item, index) { return index === (+status - 1); })
  : status;
}
