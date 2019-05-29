import { createFeatureSelector, createSelector } from '@ngrx/store';
import { key as listViewManagementKey} from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { PromotionState, key } from './promotion.reducer';

const getPromotionFeatureState = createFeatureSelector<PromotionState>(`promotions`);

export const getPromotions = createSelector(
    getPromotionFeatureState,
    state => state[key].promotions
);

export const getSelectedItem = createSelector(
    getPromotionFeatureState,
    state => state[listViewManagementKey].selectedItem
);

export const getLocations = createSelector(
    getPromotionFeatureState,
    state => state[key].locations
);

export const getPromotionTypes = createSelector(
    getPromotionFeatureState,
    state => state[key].promotionTypes
);

export const getDiscountTypes = createSelector(
    getPromotionFeatureState,
    state => state[key].discountTypes
);

export const getConditionTypes = createSelector(
    getPromotionFeatureState,
    state => state[key].conditionTypes
);

export const getOperatorTypes = createSelector(
    getPromotionFeatureState,
    state => state[key].operatorTypes
);

export const getCouponCodes = createSelector(
    getPromotionFeatureState,
    state => state[key].couponCodes
);

