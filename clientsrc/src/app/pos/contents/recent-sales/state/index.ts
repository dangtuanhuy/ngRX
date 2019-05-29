import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RecentSalesState } from './recent-sales.reducer';

export const recentSalesFeatureName = 'recent-sale';

const getRecentSaleFeatureState = createFeatureSelector<RecentSalesState>(recentSalesFeatureName);

export const getRecentSales = createSelector(
    getRecentSaleFeatureState,
    state => state.sales
);

export const getPageIndex = createSelector(
    getRecentSaleFeatureState,
    state => state.pageIndex
);

export const getPageSize = createSelector(
    getRecentSaleFeatureState,
    state => state.pageSize
);

export const getTotalItem = createSelector(
    getRecentSaleFeatureState,
    state => state.totalItem
);

export const getRecentSale = createSelector(
    getRecentSaleFeatureState,
    state => state.sale
);
