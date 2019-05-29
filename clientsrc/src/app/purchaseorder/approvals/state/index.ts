import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApprovalState, key } from './approval.reducer';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

const getApprovalFeatureState = createFeatureSelector<ApprovalState>(`approvals`);

export const getApprovals = createSelector(
    getApprovalFeatureState,
    state => state[key].approvals
);

export const getSelectedItem = createSelector(
    getApprovalFeatureState,
    state => state[listViewManagementKey].selectedItem
);

export const getPurchaseOrder = createSelector(
    getApprovalFeatureState,
    state => state[key].purchaseOrder
);
