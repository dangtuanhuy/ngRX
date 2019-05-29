import { GoodsReturnState, key } from './goods-return.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

const getGoodsReturnFeatureState = createFeatureSelector<GoodsReturnState>(
    `goods-return`
);

export const getGoodsReturns = createSelector(
    getGoodsReturnFeatureState,
    state => state[key].inventoryTransactionGoodsReturns
);

export const getReturnOrdersByVendor = createSelector(
    getGoodsReturnFeatureState,
    state => state[key].returnOrdersViewModel
);

export const getReturnOrders = createSelector(
    getGoodsReturnFeatureState,
    state => state[key].returnOrders
);

export const getSelectedItems = createSelector(
    getGoodsReturnFeatureState,
    state => state[listViewManagementKey].selectedItems
);

export const getSelectedItem = createSelector(
    getGoodsReturnFeatureState,
    state => state[listViewManagementKey].selectedItem
);

