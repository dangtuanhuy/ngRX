import { createFeatureSelector, createSelector } from '@ngrx/store';
import { QuickSelectsState } from './quick-select.reducer';

export const quickSelectsFeatureName = 'quick-select';

const getQuickSelectFeatureState = createFeatureSelector<QuickSelectsState>(quickSelectsFeatureName);

export const getCategories = createSelector(
    getQuickSelectFeatureState,
    state => state.categories
);

export const getCategory = createSelector(
    getQuickSelectFeatureState,
    state => state.category
);

export const getCategoryTotalItems = createSelector(
    getQuickSelectFeatureState,
    state => state.categoryTotalItems
);

export const getVariants = createSelector(
    getQuickSelectFeatureState,
    state => state.variants
);

export const getVariantTotalItems = createSelector(
    getQuickSelectFeatureState,
    state => state.variantTotalItems
);
