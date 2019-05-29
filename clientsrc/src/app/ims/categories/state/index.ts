import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoryState, key } from './category.reducer';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

const getCategoryFeatureState = createFeatureSelector<CategoryState>(`categories`);

export const getCategories = createSelector(
  getCategoryFeatureState,
  state => state[key].categories
);


export const getCategory = createSelector(
  getCategoryFeatureState,
  state => state[key].category
);

export const getSelectedItem = createSelector(
  getCategoryFeatureState,
  state => state[listViewManagementKey].selectedItem
);
