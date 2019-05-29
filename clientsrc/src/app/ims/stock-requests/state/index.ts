import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StockRequestState, key } from './stock-request.reducer';

const getStockRequestFeatureState = createFeatureSelector<StockRequestState>('stockrequests');

export const getStockRequests = createSelector(
    getStockRequestFeatureState,
    state => state[key].stockRequests
);

export const getStockRequest = createSelector(
    getStockRequestFeatureState,
    state => state[key].stockRequest
);

export const getProducts = createSelector(
    getStockRequestFeatureState,
    state => state[key].products
);

export const getProduct = createSelector(
    getStockRequestFeatureState,
    state => state[key].product
);

export const getLocations = createSelector(
    getStockRequestFeatureState,
    state => state[key].locations
);

export const getStockTypes = createSelector(
    getStockRequestFeatureState,
    state => state[key].stockTypes
);

export const getSelectedItem = createSelector(
    getStockRequestFeatureState,
    state => state[listViewManagementKey].selectedItem
);
