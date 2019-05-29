import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PendingSalesState } from './pending-sales.reducer';

export const pendingSalesFeatureName = 'pending-sale';

const getPendingSaleFeatureState = createFeatureSelector<PendingSalesState>(pendingSalesFeatureName);

export const getPendingSales = createSelector(
    getPendingSaleFeatureState,
    state => state.sales
);

export const getPageIndex = createSelector(
    getPendingSaleFeatureState,
    state => state.pageIndex
);

export const getPageSize = createSelector(
    getPendingSaleFeatureState,
    state => state.pageSize
);

export const getTotalItem = createSelector(
    getPendingSaleFeatureState,
    state => state.totalItem
);

export const getPendingSale = createSelector(
    getPendingSaleFeatureState,
    state => state.sale
);
