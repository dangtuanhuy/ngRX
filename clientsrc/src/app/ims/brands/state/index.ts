import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BrandState, key } from './brand.reducer';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

const getBrandFeatureState = createFeatureSelector<BrandState>(`brands`);

export const getBrands = createSelector(
    getBrandFeatureState,
    state => state[key].brands
);

export const getBrand = createSelector(
    getBrandFeatureState,
    state => state[key].brand
);

export const getSelectedItem = createSelector(
    getBrandFeatureState,
    state => state[listViewManagementKey].selectedItem
);
