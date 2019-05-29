import { Action } from '@ngrx/store';
import { ActivityModel, GetActivityRequestModel } from '../activity.model';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { User } from 'src/app/shared/base-model/user.model';

export enum ActivityActionTypes {
  GetActivities = '[Activity] Get Activities',
  GetActivitiesSuccess = '[Activity] Get Activities Success',
  GetActivitiesFail = '[Activity] Get Activities Fail',

  GetUsers = '[Activity] Get Users',
  GetUsersSuccess = '[Activity] Get Users Success',
  GetUsersFail = '[Activity] Get Users Fail'
}

export class GetActivities implements Action {
  readonly type = ActivityActionTypes.GetActivities;
  constructor(public payload: GetActivityRequestModel) { }
}

export class GetActivitiesSuccess implements Action {
  readonly type = ActivityActionTypes.GetActivitiesSuccess;
  constructor(public payload: PagedResult<ActivityModel>) { }
}

export class GetActivitiesFail implements Action {
  readonly type = ActivityActionTypes.GetActivitiesFail;
  constructor(public payload: null) { }
}

export class GetUsers implements Action {
  readonly type = ActivityActionTypes.GetUsers;
  constructor() { }
}

export class GetUsersSuccess implements Action {
  readonly type = ActivityActionTypes.GetUsersSuccess;
  constructor(public payload: User[]) { }
}

export class GetUsersFail implements Action {
  readonly type = ActivityActionTypes.GetUsersFail;
  constructor(public payload: null) { }
}

export type ActivityActions = GetActivitiesSuccess | GetActivitiesFail
  | GetUsersSuccess | GetUsersFail;
