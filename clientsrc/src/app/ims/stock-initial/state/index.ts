
import { StockInitialState, key } from './stock-initial.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const getStockInitialFeatureState = createFeatureSelector<StockInitialState>(
    `stock-initial`
);

export const getLocations = createSelector(
    getStockInitialFeatureState,
    state => state[key].locations
);

