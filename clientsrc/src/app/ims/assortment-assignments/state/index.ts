import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AssortmentAssignmentState, key } from './assortment-assignment.reducer';

const getAssortmentAssignmentFeatureState = createFeatureSelector<AssortmentAssignmentState>(`assortmentassignment`);

export const getAssortments = createSelector(
    getAssortmentAssignmentFeatureState,
    state => state.assortment
);
