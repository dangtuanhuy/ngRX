import { CloseDayState } from './close-day.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const closeDayFeatureName = 'close-day';

const getCloseDayFeatureState = createFeatureSelector<CloseDayState>(closeDayFeatureName);

export const getDenominations = createSelector(
    getCloseDayFeatureState,
    state => state.denominations
);
