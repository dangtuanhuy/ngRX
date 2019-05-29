import { Action } from '@ngrx/store';
import { ChannelModel } from '../../channels/channel.model';

export enum ChannelActionTypes {
  GetChannelAssignment = '[ChannelAssignment] Get Channels Assignment',
  GetChannelAssignmentSuccess = '[ChannelAssignment] Get Channels Assignment Success',
  GetAllChannelAssignment = '[ChannelAssignment] Get All Channels Assignment',
  GetChannelAssignmentByName = '[ChannelAssignment] Get Channels Assignment by name',
  ResetChannelAssignment = '[ChannelAssignment] Reset Channels Assignment',
  GetChannelAssignmentSelected = '[ChannelAssignment] Get Channels Assignment Selected',
}


export class GetChannelAssignmentSuccess implements Action {
  readonly type = ChannelActionTypes.GetChannelAssignmentSuccess;
  constructor(public payload: ChannelModel) { }
}

export class GetChannelAssignmentByName implements Action {
    readonly type = ChannelActionTypes.GetChannelAssignmentByName;
    constructor(public payload: string) { }
}

export class GetAllChannelAssignment implements Action {
  readonly type = ChannelActionTypes.GetAllChannelAssignment;
  constructor() { }
}

export class GetChannelAssignmentSelected implements Action {
  readonly type = ChannelActionTypes.GetChannelAssignmentSelected;
  constructor(public payload: string) { }
}

export class ResetChannelAssignment implements Action {
  readonly type = ChannelActionTypes.ResetChannelAssignment;
  constructor() { }
}

export type ChannelAssignmentActions =
| GetChannelAssignmentSuccess
| GetChannelAssignmentByName
| GetChannelAssignmentSelected
| ResetChannelAssignment
| GetAllChannelAssignment;
