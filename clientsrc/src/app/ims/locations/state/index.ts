import { createSelector, createFeatureSelector } from '@ngrx/store';
import { LocationState, key } from './location.reducer';
import * as fromRoot from 'src/app/shared/state/app.state';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

export const getLocationFeatureState = createFeatureSelector<LocationState>(`locations`);

export interface State extends fromRoot.State {
    locations: LocationState;
}

export const getLocations = createSelector(
    getLocationFeatureState,
    state => state[key].locations
);

export const getSelectedItem = createSelector(
    getLocationFeatureState,
    state => state[listViewManagementKey].selectedItem
);

export const getLocation = createSelector(
    getLocationFeatureState,
    state => state[key].location
  );
