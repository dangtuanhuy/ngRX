import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StoreState, key } from './store.reducer';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import * as fromRoot from '../../../shared/state/app.state';
import * as fromStore from './store.reducer';

export interface State extends fromRoot.State {
    products: fromStore.StoreState;
}

const getStoreFeatureState = createFeatureSelector<StoreState>(`stores`);

export const getSelectedItem = createSelector(
    getStoreFeatureState,
    state => state[listViewManagementKey].selectedItem
);

export const getStores = createSelector(
    getStoreFeatureState,
    state => state[fromStore.key].stores
);

export const getStore = createSelector(
    getStoreFeatureState,
    state => state[fromStore.key].store
);

