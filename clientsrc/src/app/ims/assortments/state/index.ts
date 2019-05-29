import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AssortmentState, key } from './assortment.reducer';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

const getAssortmentFeatureState = createFeatureSelector<AssortmentState>(`assortments`);

export const getAssortments = createSelector(
  getAssortmentFeatureState,
  state => state[key].assortments
);

export const getAssortment = createSelector(
  getAssortmentFeatureState,
  state => state[key].assortment
);

export const getSelectedItem = createSelector(
  getAssortmentFeatureState,
  state => state[listViewManagementKey].selectedItem
);
