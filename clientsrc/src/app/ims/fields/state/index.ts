import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FieldState, key } from './field.reducer';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

const getFieldFeatureState = createFeatureSelector<FieldState>(`fields`);

export const getFields = createSelector(
    getFieldFeatureState,
    state => state[key].fields
);

export const getField = createSelector(
    getFieldFeatureState,
    state => state[key].field
);

export const getEntityRefList = createSelector(
    getFieldFeatureState,
    state => state[key].entityRefList
);

export const getSelectedItem = createSelector(
    getFieldFeatureState,
    state => state[listViewManagementKey].selectedItem
);






