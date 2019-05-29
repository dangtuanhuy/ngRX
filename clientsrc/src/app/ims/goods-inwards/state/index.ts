import { GoodsInwardState, key } from './goods-inward.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

const getGoodsInwardFeatureState = createFeatureSelector<GoodsInwardState>(
    `goods-inward`
);

export const getPurchaseOrdersViewModel = createSelector(
    getGoodsInwardFeatureState,
    state => state[key].purchaseOrdersViewModel
);

export const getPurchaseOrders = createSelector(
    getGoodsInwardFeatureState,
    state => state[key].purchaseOrders
);

export const getSelectedItems = createSelector(
    getGoodsInwardFeatureState,
    state => state[listViewManagementKey].selectedItems
);

export const getSelectedItem = createSelector(
    getGoodsInwardFeatureState,
    state => state[listViewManagementKey].selectedItem
  );

export const GetGoodsInwards = createSelector(
    getGoodsInwardFeatureState,
    state => state[key].inventoryTransactionGoodsInwards
  );

export const GetGoodsInward = createSelector(
    getGoodsInwardFeatureState,
    state => state[key].inventoryTransactionGoodsInward
  );

