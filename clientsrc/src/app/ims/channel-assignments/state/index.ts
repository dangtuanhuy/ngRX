import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChannelAssignmentState, key } from './channel-assignment.reducer';

const getChannelAssignmentFeatureState = createFeatureSelector<ChannelAssignmentState>(`channelassignment`);

export const getChannels = createSelector(
    getChannelAssignmentFeatureState,
    state => state.channel
);
