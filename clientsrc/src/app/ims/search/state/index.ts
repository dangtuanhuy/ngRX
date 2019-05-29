import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SearchState, key } from './search.reducer';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

const getSearchFeatureState = createFeatureSelector<SearchState>(
    `search`
);

export const getIndexes = createSelector(
    getSearchFeatureState,
    state => state[key].indexes
);

