import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TransferInState, key } from './transfer-in.reducer';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

const getTransferInFeatureState = createFeatureSelector<TransferInState>(`transfer-ins`);

export const getInventoryTransactionTransferIns = createSelector(
    getTransferInFeatureState,
  state => state[key].inventoryTransactionTransferIns
);

export const getInventoryTransactionTransferIn = createSelector(
  getTransferInFeatureState,
  state => state[key].inventoryTransactionTransferIn
);

export const getSelectedItems = createSelector(
  getTransferInFeatureState,
  state => state[listViewManagementKey].selectedItems
);
export const getSelectedItem = createSelector(
  getTransferInFeatureState,
  state => state[listViewManagementKey].selectedItem
);
