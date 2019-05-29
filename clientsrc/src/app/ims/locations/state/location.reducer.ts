import * as fromRoot from 'src/app/shared/state/app.state';
import { LocationModel } from '../location.model';
import { LocationActions, LocationActionTypes } from './location.action';

export interface State extends fromRoot.State {
  locations: LocationState;
}

export interface LocationState {
  locations: Array<LocationModel>;
  location: LocationModel;
}

export const initialState: LocationState = {
  locations: [],
  location: null
};

export const key = 'locations_reducer';

export function reducer(
  state = initialState,
  action: LocationActions
): LocationState {
  switch (action.type) {
    case LocationActionTypes.GetLocationsSuccess:
      return {
        ...state,
        locations: action.payload.data
      };
    case LocationActionTypes.GetLocationSuccess:
      return {
        ...state,
        location: action.payload
      };
    case LocationActionTypes.AddLocationSuccess:
      return {
        ...state,
        locations: [...state.locations, action.payload]
      };
    case LocationActionTypes.AddLocationFail: {
      return {
        ...state
      };
    }
    case LocationActionTypes.UpdateLocationSuccess:
      const updatedLocations = state.locations.map(item =>
        action.payload.id === item.id ? action.payload : item
      );
      return {
        ...state,
        locations: updatedLocations
      };
    case LocationActionTypes.UpdateLocationFail: {
      return {
        ...state
      };
    }
    case LocationActionTypes.DeleteLocationSuccess:
      return {
        ...state,
        locations: state.locations.filter(
          Location => Location.id !== action.payload
        )
      };
    case LocationActionTypes.DeleteLocationFail:
      return {
        ...state
      };
    default:
      return state;
  }
}
