import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
    key as channelAssigStoreKey,
    ChannelStoreAssignmentState
} from './channel-store-assignment.reducer';

const getChannelStoreAssignmentsFeatureState = createFeatureSelector<ChannelStoreAssignmentState>(channelAssigStoreKey);

export const getChannel = createSelector(
    getChannelStoreAssignmentsFeatureState,
    state => state.channel
);
