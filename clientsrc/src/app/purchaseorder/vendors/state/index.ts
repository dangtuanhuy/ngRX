import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VendorState, key } from './vendor.reducer';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

const getVendorFeatureState = createFeatureSelector<VendorState>(`vendors`);

export const getVendors = createSelector(
  getVendorFeatureState,
  state => state[key].vendors
);

export const getVendor = createSelector(
  getVendorFeatureState,
  state => state[key].vendor
);

export const getSelectedItem = createSelector(
  getVendorFeatureState,
  state => state[listViewManagementKey].selectedItem
);


export const getPaymentTerms = createSelector(
  getVendorFeatureState,
  state => state[key].paymentTerms
);

export const getCurrencies = createSelector(
  getVendorFeatureState,
  state => state[key].currencies
);

export const getTaxTypes = createSelector(
  getVendorFeatureState,
  state => state[key].taxTypes
);
