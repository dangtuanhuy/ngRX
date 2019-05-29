import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SalesState } from './sales.reducer';

const getSalesFeatureState = createFeatureSelector<SalesState>('sales');

export const getCustomer = createSelector(
    getSalesFeatureState,
    state => state.customer
);

export const getProducts = createSelector(
    getSalesFeatureState,
    state => state.products
);

export const getStatus = createSelector(
    getSalesFeatureState,
    state => state.status
);

export const getGST = createSelector(
    getSalesFeatureState,
    state => state.GST
);

export const getGSTInclusive = createSelector(
    getSalesFeatureState,
    state => state.GSTInclusive
);

export const getSaleItemViewModels = createSelector(
    getSalesFeatureState,
    state => state.saleItemViewModels
);

export const getPromotions = createSelector(
    getSalesFeatureState,
    state => state.promotions
);
