import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TransferOutState, key } from './transfer-out.reducer';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

const getTransferOutFeatureState = createFeatureSelector<TransferOutState>(`transfer-outs`);

export const getAllocationTransactions = createSelector(
  getTransferOutFeatureState,
  state => state[key].allocationTransactions
);

export const getAllocationTransactionByListIds = createSelector(
  getTransferOutFeatureState,
  state => state[key].selectedAllocationTransactions
);

export const GetTransferOuts = createSelector(
  getTransferOutFeatureState,
  state => state[key].inventoryTransactionTransferOuts
);

export const GetTransferOut = createSelector(
  getTransferOutFeatureState,
  state => state[key].inventoryTransactionTransferOut
);

export const getSelectedItems = createSelector(
  getTransferOutFeatureState,
  state => state[listViewManagementKey].selectedItems
);
export const getSelectedItem = createSelector(
  getTransferOutFeatureState,
  state => state[listViewManagementKey].selectedItem
);
