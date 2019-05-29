import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerState } from './customer.reducer';

export const customerFeatureName = 'customers';

const getCustomerFeatureState = createFeatureSelector<CustomerState>(customerFeatureName);

export const getCustomers = createSelector(
    getCustomerFeatureState,
    state => state.customers
);

export const getCustomer = createSelector(
    getCustomerFeatureState,
    state => state.customer
);

export const getPageInformation = createSelector(
    getCustomerFeatureState,
    state => state.pageInformation
);
