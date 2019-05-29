import * as fromRoot from 'src/app/shared/state/app.state';
import { ChannelStoreAssignmentActions, ChannelStoreAssignmentActionTypes } from './channel-store-assignment.action';
import { ChannelModel } from '../../channels/channel.model';

export interface State extends fromRoot.State {
    ChannelStoreAssignments: ChannelStoreAssignmentState;
}

export interface ChannelStoreAssignmentState {
    channel: ChannelModel;
}

export const key = 'channel_store_assignments_reducer';

const initialState: ChannelStoreAssignmentState = {
    channel: null
};

export function reducer(state = initialState, action: ChannelStoreAssignmentActions): ChannelStoreAssignmentState {
    switch (action.type) {
        case ChannelStoreAssignmentActionTypes.GetChannelSuccess:
            return {
                ...state,
                channel: action.payload
            };
        default:
            return state;
    }
}
