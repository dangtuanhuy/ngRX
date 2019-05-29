import { OpenDayState } from './open-day.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const openDayFeatureName = 'open-day';

const getOpenDayFeatureState = createFeatureSelector<OpenDayState>(openDayFeatureName);

export const getDenominations = createSelector(
    getOpenDayFeatureState,
    state => state.denominations
);
