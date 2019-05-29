import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ActivityState, key } from './activity.reducer';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

const getActivityFeatureState = createFeatureSelector<ActivityState>(
  `activities`
);

export const getActivities = createSelector(
  getActivityFeatureState,
  state => state[key].activities
);

export const getUsers = createSelector(
  getActivityFeatureState,
  state => state[key].users
);
