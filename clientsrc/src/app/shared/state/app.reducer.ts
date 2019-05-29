import { State } from './app.state';
import { AppActions, AppActionTypes } from './app.action';

const initialState: State = {
  user: null,
  users: []
};

export function reducer(state = initialState, action: AppActions): State {
  switch (action.type) {
    case AppActionTypes.GetUsersSuccessAction:
      return {
        ...state,
        users: action.payload
      };

    default:
      return state;
  }
}
