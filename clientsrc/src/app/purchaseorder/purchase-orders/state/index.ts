import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PurchaseOrderState, key } from './purchase-order.reducer';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

const getPurchaseOrderFeatureState = createFeatureSelector<PurchaseOrderState>(`purchase-orders`);

export const getPurchaseOrders = createSelector(
    getPurchaseOrderFeatureState,
    state => state[key].purchaseOrders
);

export const getPurchaseOrder = createSelector(
    getPurchaseOrderFeatureState,
    state => state[key].purchaseOrder
);

export const getAllVendors = createSelector(
    getPurchaseOrderFeatureState,
    state => state[key].vendors
);

export const getSelectedItem = createSelector(
    getPurchaseOrderFeatureState,
    state => state[listViewManagementKey].selectedItem
);

export const getCurrencies = createSelector(
    getPurchaseOrderFeatureState,
    state => state[key].currencies
);

export const getUsersManager = createSelector(
    getPurchaseOrderFeatureState,
    state => state[key].usersManager
);

export const getPurchaseOrderType = createSelector(
    getPurchaseOrderFeatureState,
    state => state[key].purchaseOrderType
);

export const getInvoiceInfo = createSelector(
    getPurchaseOrderFeatureState,
    state => state[key].invoiceInfo
);
