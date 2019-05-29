import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AllocationTransactionState, key } from './allocation-transaction.reducer';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

const getAllocationTransactionFeatureState = createFeatureSelector<AllocationTransactionState>(`stock-allocation`);

export const getAllocationTransactions = createSelector(
  getAllocationTransactionFeatureState,
  state => state[key].allocationTransactions
);

export const getAllocationTransaction = createSelector(
  getAllocationTransactionFeatureState,
  state => state[key].allocationTransaction
);

export const getSelectedItem = createSelector(
  getAllocationTransactionFeatureState,
  state => state[listViewManagementKey].selectedItem
);
