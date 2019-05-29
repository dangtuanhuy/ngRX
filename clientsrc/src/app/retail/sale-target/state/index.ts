import * as fromRoot from '../../../shared/state/app.state';
import * as fromSaleTarget from './sale-target.reducer';
import { SaleTargetState } from './sale-target.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends fromRoot.State {
    products: fromSaleTarget.SaleTargetState;
}

const getStoreFeatureState = createFeatureSelector<SaleTargetState>(`sale-target`);

export const getCurrentPage = createSelector(
    getStoreFeatureState,
    state => state[fromSaleTarget.key].selectedPage
);

export const getTotalItem = createSelector(
    getStoreFeatureState,
    state => state[fromSaleTarget.key].totalItems
);

export const getStores = createSelector(
    getStoreFeatureState,
    state => state[fromSaleTarget.key].stores
);

export const getReports = createSelector(
    getStoreFeatureState,
    state => state[fromSaleTarget.key].reports
);

export const getState = createSelector(
    getStoreFeatureState,
    state => state[fromSaleTarget.key].state
);
