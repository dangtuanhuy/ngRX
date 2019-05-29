import * as fromRoot from 'src/app/shared/state/app.state';
import { ChannelActions, ChannelActionTypes } from './channel.action';
import { ChannelModel } from '../channel.model';

export interface State extends fromRoot.State {
  Channels: ChannelState;
}

export interface ChannelState {
  channels: ChannelModel[];
  channel: ChannelModel;
}

const initialState: ChannelState = {
  channels: [],
  channel: null
};

export const key = 'channels_reducer';

export function reducer(
  state = initialState,
  action: ChannelActions
): ChannelState {
  switch (action.type) {
    case ChannelActionTypes.GetChannelsSuccess:
      return {
        ...state,
        channels: action.payload.data
      };
    case ChannelActionTypes.GetChannelSuccess:
      return {
        ...state,
        channel: action.payload
      };
    case ChannelActionTypes.AddChannelSuccess:
      return {
        ...state,
        channels: [...state.channels, action.payload]
      };
    case ChannelActionTypes.AddChannelFail: {
      return {
        ...state
      };
    }
    case ChannelActionTypes.UpdateChannelSuccess:
      const updatedChannels = state.channels.map(item =>
        action.payload.id === item.id ? action.payload : item
      );
      return {
        ...state,
        channels: updatedChannels
      };
    case ChannelActionTypes.UpdateChannelFail: {
      return {
        ...state
      };
    }
    case ChannelActionTypes.DeleteChannelSuccess:
      return {
        ...state,
        channels: state.channels.filter(
          channel => channel.id !== action.payload
        )
      };
    case ChannelActionTypes.DeleteChannelFail:
      return {
        ...state
      };
    default:
      return state;
  }
}
