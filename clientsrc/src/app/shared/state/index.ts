import { createFeatureSelector, createSelector } from '@ngrx/store';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { State } from './app.state';

const getAppFeatureState = createFeatureSelector<State>(`app`);

export const getUsers = createSelector(
    getAppFeatureState,
    state => state.users
);
