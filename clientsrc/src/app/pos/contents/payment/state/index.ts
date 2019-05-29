import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PaymentModeState } from './payment.reducer';

const getpaymentModesFeatureState = createFeatureSelector<PaymentModeState>('payments');

export const getPaymentModes = createSelector(
    getpaymentModesFeatureState,
    state => state.paymentModes
);
