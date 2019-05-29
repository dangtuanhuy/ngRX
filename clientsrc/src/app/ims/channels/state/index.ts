import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChannelState, key } from './channel.reducer';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

const getChannelFeatureState = createFeatureSelector<ChannelState>(`channels`);

export const getChannels = createSelector(
  getChannelFeatureState,
  state => state[key].channels
);

export const getChannel = createSelector(
  getChannelFeatureState,
  state => state[key].channel
);

export const getSelectedItem = createSelector(
  getChannelFeatureState,
  state => state[listViewManagementKey].selectedItem
);
