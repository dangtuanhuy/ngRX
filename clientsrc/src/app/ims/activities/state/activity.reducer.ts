import * as fromRoot from 'src/app/shared/state/app.state';
import { ActivityActions, ActivityActionTypes } from './activity.action';
import { ActivityModel } from '../activity.model';
import { User } from 'src/app/shared/base-model/user.model';

export interface State extends fromRoot.State {
  activities: ActivityState;
}

export interface ActivityState {
  activities: ActivityModel[];
  activity: ActivityModel;
  users: User[];
}

const initialState: ActivityState = {
  activities: [],
  activity: null,
  users: []
};

export const key = 'activities_reducer';

export function reducer(
  state = initialState,
  action: ActivityActions
): ActivityState {
  switch (action.type) {
    case ActivityActionTypes.GetActivitiesSuccess:
      return {
        ...state,
        activities: action.payload.data
      };
    case ActivityActionTypes.GetUsersSuccess:
      return {
        ...state,
        users: action.payload
      };
    default:
      return state;
  }
}
