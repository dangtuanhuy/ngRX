import { UserActions, UserActionTypes } from './user.actions';

export interface UserState {
  userName: string;
  userId: string;
  role: string;
}

const initialState: UserState = {
  userName: null,
  userId: null,
  role: null
};

export function reducer(state = initialState, action: UserActions): UserState {
  switch (action.type) {
    case UserActionTypes.LoginSuccessul:
      return {
        ...state,
        userName: action.payload.name,
        userId: action.payload.sub,
        role: action.payload.role
      };

    default:
      return state;
  }
}
