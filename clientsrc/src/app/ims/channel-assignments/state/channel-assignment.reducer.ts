import * as fromRoot from 'src/app/shared/state/app.state';
import { ChannelAssignmentActions, ChannelActionTypes } from './channel-assignment.action';
import { AssortmentModel } from '../../assortments/assortment.model';

export interface State extends fromRoot.State {
    channels: ChannelAssignmentState;
}

export interface ChannelAssignmentState {
    channel: AssortmentModel;
}

export const key = 'channels_assignment_reducer';

const initialState: ChannelAssignmentState = {
    channel: null
};

export function reducer(state = initialState, action: ChannelAssignmentActions): ChannelAssignmentState {
    switch (action.type) {
        case ChannelActionTypes.GetChannelAssignmentSuccess:
            return {
                ...state,
                channel: action.payload,
            };
        case ChannelActionTypes.ResetChannelAssignment:
            return {
                ...state,
                channel: null,
            };
        default:
            return state;
    }
}
