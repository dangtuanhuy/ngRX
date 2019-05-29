import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReasonState, key } from './reason.reducer';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

const getReasonFeatureState = createFeatureSelector<ReasonState>(`reasons`);

export const getReasons = createSelector(
    getReasonFeatureState,
    state => state[key].reasons
);

export const getReason = createSelector(
    getReasonFeatureState,
    state => state[key].reason
);

export const getSelectedItem = createSelector(
    getReasonFeatureState,
    state => state[listViewManagementKey].selectedItem
);
